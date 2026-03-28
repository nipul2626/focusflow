import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function Login() {
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuthStore();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        const success = await login(formData);
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="card">
                <h2 className="card-title">
                    Welcome Back
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type="email"
                            required
                            className="custom-input peer"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <label className="absolute left-4 top-3 text-gray-200 text-sm transition-all
peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pink-300
peer-valid:-top-2 peer-valid:text-xs backdrop-blur-sm px-1 rounded">
                            Email
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            required
                            className="custom-input peer"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <label className="absolute left-4 top-3 text-gray-200 text-sm transition-all
peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pink-300
peer-valid:-top-2 peer-valid:text-xs backdrop-blur-sm px-1 rounded">
                            Password
                        </label>
                    </div>

                    <div className="custom-btn-container w-full">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="custom-btn"
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        className="text-purple-400 hover:text-pink-400 transition duration-300"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}