import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/notes')
      .then(response => setNotes(response.data))
      .catch(error => console.error(error));
  }, []);

  const saveNote = () => {
    if (editingNote) {
      const shouldUpdate = window.confirm('Are you sure you want to update this note?');
      if (!shouldUpdate) return;

      axios.put(`http://localhost:5000/notes/${editingNote.id}`, { title, content })
        .then(response => {
          setNotes(notes.map(note => (note.id === editingNote.id ? response.data : note)));
          clearForm();
        })
        .catch(error => console.error(error));
    } else {
      axios.post('http://localhost:5000/notes', { title, content })
        .then(response => {
          setNotes([...notes, response.data]);
          clearForm();
        })
        .catch(error => console.error(error));
    }
  };

  const deleteNote = (id) => {
    const shouldDelete = window.confirm('Are you sure you want to delete this note?');
    if (!shouldDelete) return;

    axios.delete(`http://localhost:5000/notes/${id}`)
      .then(() => setNotes(notes.filter(note => note.id !== id)))
      .catch(error => console.error(error));
  };

  const handleEditClick = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const clearForm = () => {
    setTitle('');
    setContent('');
    setEditingNote(null);
  };

  return (
    <div className="App">
      <h1>Notes</h1>
      <div className="note-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
        ></textarea>
        <button onClick={saveNote}>{editingNote ? 'Update Note' : 'Add Note'}</button>
        <button onClick={clearForm} className="clear-button">Clear</button>
      </div>

      <table className="note-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Content</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note, index) => (
            <tr key={note.id}>
              <td>{index + 1}</td>
              <td>{note.title}</td>
              <td>{note.content}</td>
              <td>
                <button className="edit-button" onClick={() => handleEditClick(note)}>Edit</button>
                <button className="delete-button" onClick={() => deleteNote(note.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
