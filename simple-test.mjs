import express from 'express';

const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>EWERS Test Page</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; }
        .container { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
      </style>
    </head>
    <body>
      <h1>Early Warning Early Response System</h1>
      <div class="container">
        <h2>Test Server Working!</h2>
        <p>This simple Express server is up and running on port ${port}.</p>
        <p>The time is: ${new Date().toLocaleTimeString()}</p>
      </div>
    </body>
    </html>
  `);
});

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Simple test server running at http://localhost:${port}`);
});