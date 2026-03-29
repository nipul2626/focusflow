import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import GlowButton from '../components/GlowButton';

const PRESET_COLORS = [
    '#22d3ee', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
    '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#60a5fa', '#c084fc',
];

export default function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [saveState, setSaveState] = useState('idle');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const [formData, setFormData] = useState({
        displayName: '',
        bio: '',
        accentColor: '#6366f1',
        focusDuration: 25,
        shortBreak: 5,
        longBreak: 15,
    });

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get('/profile');
                setProfile(data.profile);
                setFormData({
                    displayName: data.profile.displayName || '',
                    bio: data.profile.bio || '',
                    accentColor: data.profile.accentColor || '#6366f1',
                    focusDuration: data.profile.focusDuration || 25,
                    shortBreak: data.profile.shortBreak || 5,
                    longBreak: data.profile.longBreak || 15,
                });
            } catch (error) {
                console.error('Fetch profile error:', error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleUploadAvatar = async () => {
        if (!avatarFile) return;
        const payload = new FormData();
        payload.append('avatar', avatarFile);

        try {
            const { data } = await api.post('/profile/avatar', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProfile(data.profile);
            setAvatarFile(null);
            setAvatarPreview(null);
        } catch (error) {
            console.error('Upload avatar error:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveState('saving');
        try {
            const { data } = await api.put('/profile', formData);
            setProfile(data.profile);
            setSaveState('saved');
            setTimeout(() => setSaveState('idle'), 1600);
        } catch (error) {
            console.error('Update profile error:', error);
            setSaveState('idle');
        }
    };

    if (isLoading) {
        return <div className="dashboard-shell min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" /></div>;
    }

    return (
        <div className="dashboard-shell min-h-screen">
            <div className="dashboard-aurora" />
            <div className="dashboard-grid-overlay" />

            <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/45 backdrop-blur-xl">
                <div className="max-w-[1000px] mx-auto px-4 py-4 flex items-center justify-between gap-3 relative z-10">
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">Focus Flow</h1>
                    <div className="flex gap-3">
                        <GlowButton onClick={() => navigate('/dashboard')}>← Dashboard</GlowButton>
                        <GlowButton variant="subtle" onClick={() => navigate('/analytics')}>📊 Analytics</GlowButton>
                    </div>
                </div>
            </header>

            <main className="max-w-[1000px] mx-auto px-4 py-8 relative z-10">
                <motion.div
                    className="rounded-3xl border border-cyan-300/20 bg-slate-900/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(8,8,24,0.55)] p-8"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-3xl font-extrabold text-slate-100 mb-8">Profile Settings</h2>

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-slate-200 mb-4">Profile Picture</h3>
                        <div className="flex items-center gap-6 flex-wrap">
                            <div className="relative group">
                                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-500 opacity-70 blur-sm group-hover:opacity-100 transition" />
                                <img
                                    src={avatarPreview || profile?.avatarUrl || 'https://via.placeholder.com/150'}
                                    alt="Avatar"
                                    className="relative w-32 h-32 rounded-full object-cover border-4 border-slate-900"
                                />
                            </div>

                            <div className="flex gap-3 items-center">
                                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" id="avatar-upload" />
                                <GlowButton onClick={() => document.getElementById('avatar-upload').click()}>
                                    Choose Photo
                                </GlowButton>
                                {avatarFile && (
                                    <GlowButton
                                        type="button"
                                        variant="subtle"
                                        onClick={handleUploadAvatar}
                                    >
                                        Upload
                                    </GlowButton>
                                )}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-slate-200 font-medium mb-2">Display Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl bg-slate-950/70 text-slate-100 border border-cyan-300/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                value={formData.displayName}
                                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-slate-200 font-medium mb-2">Bio</label>
                            <textarea
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl bg-slate-950/70 text-slate-100 border border-cyan-300/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-slate-200 font-medium mb-2">Accent Color</label>
                            <div className="grid grid-cols-8 gap-3">
                                {PRESET_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, accentColor: color })}
                                        className={`w-10 h-10 rounded-xl border-2 transition ${formData.accentColor === color ? 'border-white scale-110 shadow-[0_0_14px_rgba(255,255,255,0.45)]' : 'border-white/20'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[['Focus Duration (min)', 'focusDuration', 60], ['Short Break (min)', 'shortBreak', 30], ['Long Break (min)', 'longBreak', 60]].map(([label, key, max]) => (
                                <div key={key}>
                                    <label className="block text-slate-200 font-medium mb-2">{label}</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={max}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-950/70 text-slate-100 border border-cyan-300/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        value={formData[key]}
                                        onChange={(e) => setFormData({ ...formData, [key]: parseInt(e.target.value, 10) || 1 })}
                                    />
                                </div>
                            ))}
                        </div>

                        <motion.button
                            type="submit"
                            disabled={saveState === 'saving'}
                            className={`w-full px-6 py-3 rounded-xl font-semibold text-white transition ${saveState === 'saved' ? 'bg-emerald-500' : 'bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500'}`}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            {saveState === 'saving' ? 'Saving...' : saveState === 'saved' ? 'Saved ✓' : 'Save Changes'}
                        </motion.button>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}
