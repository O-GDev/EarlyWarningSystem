import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

// Simple middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Serve a simple HTML page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>EWERS Diagnostic</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #0066cc; }
        .container { border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .diagnostic { background-color: #f9f9f9; }
        .success { color: green; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto; }
      </style>
    </head>
    <body>
      <h1>EWERS Diagnostic Page</h1>
      
      <div class="container">
        <h2>Server Status</h2>
        <p><span class="success">✓</span> Server is running successfully on port: ${port}</p>
        <p>Server time: ${new Date().toLocaleString()}</p>
        <p>Node.js version: ${process.version}</p>
      </div>
      
      <div class="container diagnostic">
        <h2>Environment Information</h2>
        <p>PORT: ${process.env.PORT || 'Not set'}</p>
        <p>NODE_ENV: ${process.env.NODE_ENV || 'Not set'}</p>
        <p>Host: ${req.headers.host || 'Unknown'}</p>
      </div>
      
      <div class="container">
        <h2>Request Headers</h2>
        <pre>${JSON.stringify(req.headers, null, 2)}</pre>
      </div>
    </body>
    </html>
  `);
});

// Start the server
server.listen(port, '0.0.0.0', () => {
  console.log(`Diagnostic server running at http://localhost:${port}`);
});

// Log any errors
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Handle process termination gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});