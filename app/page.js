'use client'

import { useState, useEffect } from 'react'

export default function Notepad() {
  const [notes, setNotes] = useState([])
  const [currentNote, setCurrentNote] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [showList, setShowList] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('notes')
    if (saved) {
      setNotes(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const createNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      timestamp: new Date().toISOString()
    }
    setNotes([newNote, ...notes])
    setCurrentNote(newNote.id)
    setTitle(newNote.title)
    setContent(newNote.content)
    setShowList(false)
  }

  const saveNote = () => {
    if (currentNote) {
      setNotes(notes.map(note =>
        note.id === currentNote
          ? { ...note, title, content, timestamp: new Date().toISOString() }
          : note
      ))
    }
    setShowList(true)
    setCurrentNote(null)
  }

  const openNote = (note) => {
    setCurrentNote(note.id)
    setTitle(note.title)
    setContent(note.content)
    setShowList(false)
  }

  const deleteNote = (id) => {
    if (confirm('Delete this note?')) {
      setNotes(notes.filter(note => note.id !== id))
      if (currentNote === id) {
        setCurrentNote(null)
        setShowList(true)
      }
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={styles.container}>
      {showList ? (
        <div style={styles.listView}>
          <div style={styles.header}>
            <h1 style={styles.headerTitle}>My Notes</h1>
            <button style={styles.addButton} onClick={createNote}>+</button>
          </div>
          <div style={styles.notesList}>
            {notes.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>No notes yet</p>
                <p style={styles.emptySubtext}>Tap + to create a note</p>
              </div>
            ) : (
              notes.map(note => (
                <div key={note.id} style={styles.noteItem} onClick={() => openNote(note)}>
                  <div style={styles.noteContent}>
                    <h3 style={styles.noteTitle}>{note.title || 'Untitled'}</h3>
                    <p style={styles.notePreview}>{note.content.substring(0, 100) || 'No content'}</p>
                    <p style={styles.noteDate}>{formatDate(note.timestamp)}</p>
                  </div>
                  <button
                    style={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNote(note.id)
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div style={styles.editorView}>
          <div style={styles.editorHeader}>
            <button style={styles.backButton} onClick={saveNote}>← Back</button>
            <button style={styles.saveButton} onClick={saveNote}>Save</button>
          </div>
          <input
            style={styles.titleInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
          />
          <textarea
            style={styles.contentInput}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing..."
          />
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    overflow: 'hidden'
  },
  listView: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  headerTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '600'
  },
  addButton: {
    backgroundColor: 'white',
    color: '#4CAF50',
    border: 'none',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    fontSize: '32px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    lineHeight: '32px'
  },
  notesList: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px'
  },
  emptyState: {
    textAlign: 'center',
    marginTop: '100px',
    color: '#999'
  },
  emptyText: {
    fontSize: '20px',
    margin: '16px 0'
  },
  emptySubtext: {
    fontSize: '16px',
    margin: 0
  },
  noteItem: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  noteContent: {
    flex: 1,
    minWidth: 0
  },
  noteTitle: {
    margin: '0 0 8px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  notePreview: {
    margin: '0 0 8px 0',
    fontSize: '14px',
    color: '#666',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  noteDate: {
    margin: 0,
    fontSize: '12px',
    color: '#999'
  },
  deleteButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '8px',
    marginLeft: '8px'
  },
  editorView: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  editorHeader: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  backButton: {
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '8px 16px'
  },
  saveButton: {
    backgroundColor: 'white',
    color: '#4CAF50',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '8px 24px'
  },
  titleInput: {
    border: 'none',
    borderBottom: '1px solid #e0e0e0',
    padding: '16px',
    fontSize: '20px',
    fontWeight: '600',
    outline: 'none'
  },
  contentInput: {
    flex: 1,
    border: 'none',
    padding: '16px',
    fontSize: '16px',
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit'
  }
}
