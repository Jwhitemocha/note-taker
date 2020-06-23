const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();


const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({extended: true}))


app.use(express.static('public'));

//get notes
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

// get notes JSON info
app.get("/api/notes", function(req, res) {
  fs.readFile(__dirname + "./sampleNote.json", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    for (var i = 0; i < notes.length; i++) {
      notes[i].id = i;
    };
    res.json(notes);
  });
});

// Adds a new note to the DB file
app.post("/api/notes", function(req, res) {
  var newNote = req.body;
  fs.readFile(__dirname + "./sampleNote.json", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile(__dirname + "./sampleNote.json", JSON.stringify(notes), (err, data) => {
      if (err) throw err;
      res.json(newNote);
    })
  })
});

// Deletes a note by ID, not working right now
app.delete('/api/notes/:noteId', function (req, res) {
  const id = req.params.noteId;
  fs.readFile(__dirname + "./sampleNote.json", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.splice(id, 1);
    fs.writeFile(__dirname + "./sampleNote.json", JSON.stringify(notes), (err, data) => {
      if (err) throw err;
      res.send("ok");
    })
  })
})


app.get("*", function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


app.listen(PORT);