import { useState } from 'react'
import { Plus, Menu, Edit3 } from 'lucide-react'

const StickyWall = ({ notes, setStickyNotes, sidebarOpen, setSidebarOpen }) => {
  const [showAddNote, setShowAddNote] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [newNote, setNewNote] = useState({ title: '', content: '', color: 'yellow' })

  const colors = {
    yellow: 'bg-light-yellow border-yellow-200',
    blue: 'bg-light-blue border-blue-200',
    pink: 'bg-light-pink border-pink-200',
    orange: 'bg-light-orange border-orange-200',
    green: 'bg-light-green border-green-200'
  }

  const handleAddNote = () => {
    if (newNote.title.trim()) {
      setStickyNotes([...notes, {
        id: Date.now(),
        ...newNote
      }])
      setNewNote({ title: '', content: '', color: 'yellow' })
      setShowAddNote(false)
    }
  }

  const handleDeleteNote = (noteId) => {
    setStickyNotes(notes.filter(note => note.id !== noteId))
  }

  const handleUpdateNote = (noteId, updates) => {
    setStickyNotes(notes.map(note => 
      note.id === noteId ? { ...note, ...updates } : note
    ))
  }

  const startEditNote = (note) => {
    setEditingNote({ ...note })
  }

  const saveEditNote = () => {
    if (editingNote && editingNote.title.trim()) {
      handleUpdateNote(editingNote.id, editingNote)
      setEditingNote(null)
    }
  }

  const cancelEditNote = () => {
    setEditingNote(null)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center gap-4">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
          )}
          <h1 className="text-2xl font-semibold text-gray-900">Sticky Wall</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Existing Notes */}
          {notes.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p className="text-lg font-medium mb-2">No sticky notes yet</p>
              <p className="text-sm">Click "Add New Note" to create your first note</p>
            </div>
          ) : (
            notes.map((note) => {
            const isEditing = editingNote && editingNote.id === note.id
            
            if (isEditing) {
              return (
                <div
                  key={note.id}
                  className={`p-4 rounded-lg border-2 ${colors[editingNote.color]} shadow-sm min-h-[200px]`}
                >
                  <input
                    type="text"
                    value={editingNote.title}
                    onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
                    className="w-full bg-transparent border-none text-lg font-semibold text-gray-900 focus:outline-none mb-3"
                    autoFocus
                  />
                  <textarea
                    value={editingNote.content}
                    onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                    className="w-full bg-transparent border-none text-sm text-gray-700 focus:outline-none resize-none mb-4"
                    rows="6"
                  />
                  
                  {/* Color Selector */}
                  <div className="flex gap-2 mb-4">
                    {Object.keys(colors).map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditingNote({...editingNote, color})}
                        className={`w-6 h-6 rounded-full border-2 ${
                          editingNote.color === color ? 'border-gray-800' : 'border-gray-300'
                        } ${colors[color].split(' ')[0]}`}
                      />
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={saveEditNote}
                      className="px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditNote}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )
            }
            
            return (
              <div
                key={note.id}
                className={`p-4 rounded-lg border-2 ${colors[note.color]} shadow-sm hover:shadow-md transition-shadow min-h-[200px]`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {note.title}
                  </h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEditNote(note)}
                      className="text-gray-400 hover:text-blue-500 p-1 rounded transition-colors"
                      title="Edit note"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-gray-400 hover:text-red-500 text-xl leading-none p-1"
                      title="Delete note"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                  {note.content}
                </div>
              </div>
            )
            })
          )}

          {/* Add New Note Button */}
          {!showAddNote ? (
            <button
              onClick={() => setShowAddNote(true)}
              className="min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
            >
              <Plus size={48} className="mb-2" />
              <span className="text-lg font-medium">Add New Note</span>
            </button>
          ) : (
            /* Add New Note Form */
            <div className={`p-4 rounded-lg border-2 ${colors[newNote.color]} shadow-sm min-h-[200px]`}>
              <input
                type="text"
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                className="w-full bg-transparent border-none text-lg font-semibold text-gray-900 placeholder-gray-500 focus:outline-none mb-3"
                autoFocus
              />
              <textarea
                placeholder="Note content..."
                value={newNote.content}
                onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                className="w-full bg-transparent border-none text-sm text-gray-700 placeholder-gray-500 focus:outline-none resize-none mb-4"
                rows="6"
              />
              
              {/* Color Selector */}
              <div className="flex gap-2 mb-4">
                {Object.keys(colors).map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewNote({...newNote, color})}
                    className={`w-6 h-6 rounded-full border-2 ${
                      newNote.color === color ? 'border-gray-800' : 'border-gray-300'
                    } ${colors[color].split(' ')[0]}`}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleAddNote}
                  className="px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowAddNote(false)
                    setNewNote({ title: '', content: '', color: 'yellow' })
                  }}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Empty Note Placeholder */}
          <div className="min-h-[200px] border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-100">
            <Plus size={48} className="text-gray-300" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StickyWall
