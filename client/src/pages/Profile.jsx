import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const PRESET_COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16',
    '#22c55e', '#10b981', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
    '#d946ef', '#ec4899'
];

export default function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const [formData, setFormData] = useState({
        displayName: '',
        bio: '',
        accentColor: '#6366f1',
        focusDuration: 25,
        shortBreak: 5,
        longBreak: 15
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/profile');
            setProfile(data.profile);
            setFormData({
                displayName: data.profile.displayName || '',
                bio: data.profile.bio || '',
                accentColor: data.profile.accentColor,
                focusDuration: data.profile.focusDuration,
                shortBreak: data.profile.shortBreak,
                longBreak: data.profile.longBreak
            });
        } catch (error) {
            console.error('Fetch profile error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadAvatar = async () => {
        if (!avatarFile) return;

        const formData = new FormData();
        formData.append('avatar', avatarFile);

        try {
            const { data } = await api.post('/profile/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfile(data.profile);
            setAvatarFile(null);
            setAvatarPreview(null);
            alert('Avatar uploaded successfully!');
        } catch (error) {
            console.error('Upload avatar error:', error);
            alert('Failed to upload avatar');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const { data } = await api.put('/profile', formData);
            setProfile(data.profile);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Update profile error:', error);
            alert('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile Settings</h1>

                    {/* Avatar Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Picture</h2>
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <img
                                    src={avatarPreview || profile?.avatarUrl || 'https://via.placeholder.com/150'}
                                    alt="Avatar"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200"
                                />
                            </div>
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                    id="avatar-upload"
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer inline-block"
                                >
                                    Choose Photo
                                </label>
                                {avatarFile && (
                                    <button
                                        onClick={handleUploadAvatar}
                                        className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Upload
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Display Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.displayName}
                                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Bio</label>
                            <textarea
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Accent Color</label>
                            <div className="grid grid-cols-7 gap-3">
                                {PRESET_COLORS.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, accentColor: color })}
                                        className={`w-12 h-12 rounded-lg border-4 transition ${
                                            formData.accentColor === color
                                                ? 'border-gray-800 scale-110'
                                                : 'border-gray-200'
                                        }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Focus Duration (min)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.focusDuration}
                                    onChange={(e) => setFormData({ ...formData, focusDuration: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Short Break (min)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.shortBreak}
                                    onChange={(e) => setFormData({ ...formData, shortBreak: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Long Break (min)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={formData.longBreak}
                                    onChange={(e) => setFormData({ ...formData, longBreak: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={isSaving}
                            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}