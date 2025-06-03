// REFERENCE SOLUTION - Do not distribute to students
// src/components/NoteEditor.tsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// TODO: Import the saveNote function from your noteService call this to save the note to firebase
import { saveNote } from '../services/noteService';
import { Note } from '../types/Note';

interface NoteEditorProps {
  initialNote?: Note;
  onSave?: (note: Note) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ initialNote, onSave }) => {
  // State for the current note being edited
  const [note, setNote] = useState<Note>(() => {
    return (
      initialNote || {
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      }
    );
  });

  // TODO: create state for saving status
  const [isSaving, setIsSaving] = useState(false);
  // TODO: create state for error handling
  const [error, setError] = useState('');

  // TODO: Update local state when initialNote changes in a useEffect (if editing an existing note)
  // This effect runs when the component mounts or when initialNote changes
  // It sets the note state to the initialNote if provided, or resets to a new empty note, with a unique ID
  React.useEffect(() => {
    if (initialNote) {
      setNote(initialNote);
    } else {
      setNote({
        id: uuidv4(),
        title: '',
        content: '',
        lastUpdated: Date.now(),
      });
    }
  }, [initialNote]);

  //TODO: on form submit create a "handleSubmit" function that saves the note to Firebase and calls the onSave callback if provided
  // This function should also handle any errors that occur during saving and update the error state accordingly
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation: require both title and content
    if (!note.title.trim() || !note.content.trim()) {
      return;
    }

    try {
      setIsSaving(true);
      await saveNote(note);
      if (onSave) {
        onSave({ ...note });
      }
      // If creating a brand-new note (no initialNote), reset form
      if (!initialNote) {
        setNote({
          id: uuidv4(),
          title: '',
          content: '',
          lastUpdated: Date.now(),
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while saving.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // TODO: for each form field; add a change handler that updates the note state with the new value from the form
  // TODO: disable fields and the save button while saving is happening
  // TODO: for the save button, show "Saving..." while saving is happening and "Save Note" when not saving
  // TODO: show an error message if there is an error saving the note

  return (
    <form className="note-editor" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
          disabled={isSaving}
          required
          placeholder="Enter note title"
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={note.content}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
          disabled={isSaving}
          rows={5}
          required
          placeholder="Enter note content"
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : initialNote ? 'Update Note' : 'Save Note'}
        </button>
      </div>
    </form>
  );
};

export default NoteEditor;
