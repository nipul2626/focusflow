import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNoteStore } from '../stores/noteStore';

export default function QuickNotes() {
    const { notes, fetchNotes, createNote, updateNote, deleteNote } = useNoteStore();
    const [newNote, setNewNote] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        const success = await createNote(newNote);
        if (success) {
            setNewNote('');
        }
    };

    const handleUpdate = async (id) => {
        if (!editContent.trim()) return;

        const success = await updateNote(id, editContent);
        if (success) {
            setEditingId(null);
            setEditContent('');
        }
    };

    const startEdit = (note) => {
        setEditingId(note.id);
        setEditContent(note.content);
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 h-[600px] flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📝 Quick Notes</h3>

            {/* Create Note */}
            <form onSubmit={handleCreate} className="mb-4">
        <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={3}
            placeholder="Jot down your thoughts..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
        />
                <button
                    type="submit"
                    className="mt-2 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Add Note
                </button>
            </form>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto space-y-3">
                <AnimatePresence>
                    {notes.map(note => (
                        <motion.div
                            key={note.id}
                            className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            {editingId === note.id ? (
                                <div>
                  <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                  />
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => handleUpdate(note.id)}
                                            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
                                    {note.task && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            📎 {note.task.title}
                                        </p>
                                    )}
                                    <div className="flex gap-2 mt-3 text-xs">
                                        <button
                                            onClick={() => startEdit(note)}
                                            className="text-indigo-600 hover:text-indigo-800"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteNote(note.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}