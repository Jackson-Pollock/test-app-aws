const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Set up Express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define MongoDB Schema and Model
const textSchema = new mongoose.Schema({
  content: String
});
const Text = mongoose.model('Text', textSchema);

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { inputText } = req.body;
  const newText = new Text({ content: inputText });

  newText.save((err) => {
    if (err) {
      res.send('Error occurred while saving to MongoDB');
    } else {
      res.send('Data saved to MongoDB');
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
