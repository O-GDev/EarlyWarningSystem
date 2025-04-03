import express, { type Request, Response, NextFunction } from "express";
import { registerSimpleRoutes } from "./routes-simple";
import { registerAIRoutes } from "./ai-routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  registerAIRoutes(app);
  const server = await registerSimpleRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error('Server error:', err);
    res.status(status).json({ message });
    // Don't throw the error again, as it would crash the server
    // Instead, just log it and continue
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use port 8080 to match Replit's expected port configuration
  const port = process.env.PORT || 8080;
  server.listen({
    // port: Number(port),
    // host: "0.0.0.0",
    // reusePort: true,    
    port: process.env.PORT || 8080, // Use environment variable if available
    host: "127.0.0.1", // Use localhost instead of 0.0.0.0
  }, () => {
    log(`serving on port ${port}`);
  });
})();
