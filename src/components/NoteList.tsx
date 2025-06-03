// src/components/NoteList.tsx
import React from 'react';

import { subscribeToNotes } from '../services/noteService';
import { Note, Notes } from '../types/Note';
import NoteItem from './NoteItem';

interface NoteListProps {
  onEditNote?: (note: Note) => void;
}
// TODO: remove the eslint-disable-next-line when you implement the onEditNote handler
const NoteList: React.FC<NoteListProps> = ({ onEditNote }) => {
  // TODO: load notes using subscribeToNotes from noteService, use useEffect to manage the subscription; try/catch to handle errors (see lab 3)
  // TODO: handle unsubscribing from the notes when the component unmounts
  // TODO: manage state for notes, loading status, and error message
  // TODO: display a loading message while notes are being loaded; error message if there is an error
  const [notes, setNotes] = React.useState<Notes>({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    setLoading(true);
    setError('');

    let unsubscribe: () => void;

    try {
      unsubscribe = subscribeToNotes(
        (newNotes) => {
          setNotes(newNotes);
          setLoading(false);
        },
        (error: unknown) => {
          if (error instanceof Error) {
            setError(error.message || 'Failed to load notes');
            setLoading(false);
          } else {
            setError('Failed to load notes');
          }
          setLoading(false);
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || 'Failed to load notes');
        setLoading(false);
      }
      return;
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // Notes is a constant in this template but needs to be a state variable in your implementation and load from firestore
  // const notes: Notes = {
  //   '1': {
  //     id: '1',
  //     title: 'Note 1',
  //     content: 'This is the content of note 1.',
  //     lastUpdated: Date.now() - 100000,
  //   },
  // };
  if (loading) {
    return (
      <div className="note-list">
        <h2>Notes</h2>
        <p>Loading notes…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="note-list">
        <h2>Notes</h2>
        <p className="error-message">Error: {error}</p>
      </div>
    );
  }

  const noteArray = Object.values(notes).sort((a, b) => b.lastUpdated - a.lastUpdated);

  return (
    <div className="note-list">
      <h2>Notes</h2>
      {noteArray.length === 0 ? (
        <p>No notes yet. Create your first note!</p>
      ) : (
        <div className="notes-container">
          {noteArray.map((note) => (
            <NoteItem key={note.id} note={note} onEdit={onEditNote} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;
