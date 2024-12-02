const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the "public" directory
const projectPath = path.join(__dirname); // Set the project directory dynamically
app.use(express.static(projectPath));

// Serve the main HTML file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(projectPath, 'index.html')); // Adjust if your main file is named differently
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});