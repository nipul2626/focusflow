import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Signup() {
    const navigate = useNavigate();
    const { register, isLoading, error, clearError } = useAuthStore();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        const success = await register(formData);
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="card">
                <h2 className="card-title">
                    Create Account
                </h2>

                {error && (
                    <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* NAME */}
                    <div className="relative">
                        <input
                            type="text"
                            required
                            className="custom-input peer"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                        />
                        <label className="absolute left-4 top-3 text-gray-300 text-sm transition-all
                            peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pink-300
                            peer-valid:-top-2 peer-valid:text-xs backdrop-blur-sm px-1 rounded">
                            Name
                        </label>
                    </div>

                    {/* EMAIL */}
                    <div className="relative">
                        <input
                            type="email"
                            required
                            className="custom-input peer"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                        />
                        <label className="absolute left-4 top-3 text-gray-300 text-sm transition-all
                            peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pink-300
                            peer-valid:-top-2 peer-valid:text-xs backdrop-blur-sm px-1 rounded">
                            Email
                        </label>
                    </div>

                    {/* PASSWORD */}
                    <div className="relative">
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="custom-input peer"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                        />
                        <label className="absolute left-4 top-3 text-gray-300 text-sm transition-all
                            peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pink-300
                            peer-valid:-top-2 peer-valid:text-xs backdrop-blur-sm px-1 rounded">
                            Password
                        </label>
                    </div>

                    {/* BUTTON */}
                    <div className="custom-btn-container w-full">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="custom-btn"
                        >
                            {isLoading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                {/* FOOTER */}
                <p className="text-center text-gray-400 mt-6 text-sm">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-semibold text-pink-400 hover:text-purple-400 transition duration-300 hover:underline"
                    >
                        Login →
                    </Link>
                </p>
            </div>
        </div>
    );
}