import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNoteStore } from '../stores/noteStore';
import GlowButton from './GlowButton';

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
        if (success) setNewNote('');
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
        <div className="rounded-3xl border border-white/70 bg-white/65 backdrop-blur-xl shadow-[0_12px_30px_rgba(86,69,140,0.12)] p-6 h-[620px] flex flex-col">
            <h3 className="text-2xl font-extrabold text-slate-800 mb-4">📝 Quick Notes</h3>

            <form onSubmit={handleCreate} className="mb-4">
        <textarea
            className="w-full px-4 py-3 border border-indigo-100 rounded-xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 resize-none"
            rows={3}
            placeholder="Jot down your thoughts..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
        />
                <GlowButton type="submit" className="mt-3 w-full">Add Note</GlowButton>
            </form>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                <AnimatePresence>
                    {notes.map((note) => (
                        <motion.div
                            key={note.id}
                            className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50 p-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {editingId === note.id ? (
                                <div>
                  <textarea
                      className="w-full px-3 py-2 border border-indigo-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      rows={3}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                  />
                                    <div className="flex gap-2 mt-2">
                                        <GlowButton className="flex-1" onClick={() => handleUpdate(note.id)}>Save</GlowButton>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-slate-700 whitespace-pre-wrap">{note.content}</p>
                                    {note.task && <p className="text-xs text-indigo-500 mt-2">📎 {note.task.title}</p>}
                                    <div className="flex gap-3 mt-3 text-sm">
                                        <button onClick={() => startEdit(note)} className="text-indigo-600 hover:text-indigo-800 font-medium">Edit</button>
                                        <button onClick={() => deleteNote(note.id)} className="text-rose-600 hover:text-rose-800 font-medium">Delete</button>
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
