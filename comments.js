//Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const commentsPath = path.join(__dirname, 'comments.json');

//Get all comments
app.get('/comments', (req, res) => {
  fs.readFile(commentsPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading comments file');
    } else {
      res.send(data);
    }
  });
});

//Add a comment
app.post('/comments', (req, res) => {
  const comment = req.body;
  fs.readFile(commentsPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading comments file');
    } else {
      const comments = JSON.parse(data);
      comments.push(comment);
      fs.writeFile(commentsPath, JSON.stringify(comments, null, 2), (err) => {
        if (err) {
          res.status(500).send('Error writing comments file');
        } else {
          res.send('Comment added successfully');
        }
      });
    }
  });
});

//Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

//Create comments.json file with empty array if it doesn't exist
fs.readFile(commentsPath, 'utf8', (err) => {
  if (err) {
    fs.writeFile(commentsPath, '[]', (err) => {
      if (err) {
        console.log('Error creating comments file');
      } else {
        console.log('Comments file created successfully');
      }
    });
  }
});
//Run the server with node comments.js
//Access the server on http://localhost:3000
//Use Postman to make POST request to http://localhost:3000/comments with JSON body e.g. {"name": "Alice", "comment": "Hello, World!"}
//Use Postman to make GET