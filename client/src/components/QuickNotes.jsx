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
        <div className="rounded-3xl border border-white/10 bg-slate-900/55 backdrop-blur-xl shadow-[0_12px_30px_rgba(8,8,24,0.55)] p-6 h-[620px] xl:h-[640px] flex flex-col">
            <h3 className="text-2xl font-extrabold text-slate-100 mb-4">📝 Quick Notes</h3>

            <form onSubmit={handleCreate} className="mb-4">
        <textarea
            className="w-full px-4 py-3 border border-cyan-300/20 rounded-xl bg-slate-950/70 text-slate-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 resize-none"
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
                            className="rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-slate-900/80 to-slate-800/80 p-4"
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
                                    <p className="text-slate-200 whitespace-pre-wrap">{note.content}</p>
                                    {note.task && <p className="text-xs text-indigo-500 mt-2">📎 {note.task.title}</p>}
                                    <div className="flex gap-3 mt-3 text-sm">
                                        <button onClick={() => startEdit(note)} className="text-cyan-300 hover:text-cyan-200 font-medium">Edit</button>
                                        <button onClick={() => deleteNote(note.id)} className="text-rose-300 hover:text-rose-200 font-medium">Delete</button>
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
