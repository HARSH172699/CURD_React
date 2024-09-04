const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataFilePath = path.join(__dirname, '../data/notes.json');


const readData = () => {
  const jsonData = fs.readFileSync(dataFilePath);
  return JSON.parse(jsonData);
};

const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};


router.get('/', (req, res) => {
  const notes = readData();
  res.json(notes);
});


router.post('/', (req, res) => {
  const { title, content } = req.body;
  const notes = readData();
  const newNote = {
    id: notes.length > 0 ? notes[notes.length - 1].id + 1 : 1,
    title,
    content,
    created_at: new Date(),
    updated_at: new Date(),
  };
  notes.push(newNote);
  writeData(notes);
  res.json(newNote);
});


router.put('/:id', (req, res) => {
    const { title, content } = req.body;
    const notes = readData();
    const noteId = parseInt(req.params.id, 10);
  
    if (isNaN(noteId)) {
      return res.status(400).json({ message: 'Invalid note ID' });
    }
  
    const noteIndex = notes.findIndex(note => note.id === noteId);
    if (noteIndex === -1) {
      return res.status(404).json({ message: 'Note not found' });
    }
  
    const updatedNote = {
      ...notes[noteIndex],
      title: title || notes[noteIndex].title,
      content: content || notes[noteIndex].content,
      updated_at: new Date(),
    };
  
    notes[noteIndex] = updatedNote;
    writeData(notes);
  
    res.json(updatedNote);
  });
  
router.delete('/:id', (req, res) => {
  const notes = readData();
  const noteId = parseInt(req.params.id, 10);
  const updatedNotes = notes.filter((note) => note.id !== noteId);
  writeData(updatedNotes);
  res.json({ message: 'Note deleted' });
});

module.exports = router;
