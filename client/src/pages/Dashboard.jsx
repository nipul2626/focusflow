import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useTaskStore } from '../stores/taskStore';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { user, logout } = useAuthStore();
    const { tasks, fetchTasks, isLoading } = useTaskStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-indigo-600">Focus Flow</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Welcome, {user?.name}!</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Your Tasks
                </h2>

                {isLoading ? (
                    <p>Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-gray-600 mb-4">No tasks yet. Create your first task!</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {tasks.map((task) => (
                            <div key={task.id} className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {task.title}
                                </h3>
                                {task.description && (
                                    <p className="text-gray-600 mb-4">{task.description}</p>
                                )}
                                <div className="flex items-center gap-4 text-sm">
                  <span className={`px-3 py-1 rounded-full ${
                      task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                                    <span className={`px-3 py-1 rounded-full ${
                                        task.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                                            task.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                                                task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                    }`}>
                    {task.priority}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}