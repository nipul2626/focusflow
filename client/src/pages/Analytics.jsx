import { useEffect } from 'react';
import { useAnalyticsStore } from '../stores/analyticsStore';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function Analytics() {
    const { overview, fetchOverview, isLoading } = useAnalyticsStore();

    useEffect(() => {
        fetchOverview();
    }, []);

    if (isLoading || !overview) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Weekly trend chart data
    const weeklyChartData = {
        labels: overview.weeklyTrend.map(d => {
            const date = new Date(d.date);
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        }),
        datasets: [
            {
                label: 'Focus Minutes',
                data: overview.weeklyTrend.map(d => d.minutes),
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    // Category breakdown chart data
    const categoryChartData = {
        labels: overview.categoryBreakdown.map(c => c.category?.name || 'Uncategorized'),
        datasets: [
            {
                data: overview.categoryBreakdown.map(c => c.totalMinutes),
                backgroundColor: overview.categoryBreakdown.map(c => c.category?.color || '#gray'),
                borderWidth: 0
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <motion.h1
                    className="text-4xl font-bold text-gray-800 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Analytics Dashboard
                </motion.h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Today's Focus"
                        value={`${overview.today.focusMinutes}m`}
                        subtitle={`${overview.today.sessions} sessions`}
                        color="bg-indigo-500"
                        delay={0}
                    />
                    <StatCard
                        title="Tasks Completed"
                        value={overview.today.tasksCompleted}
                        subtitle="Today"
                        color="bg-green-500"
                        delay={0.1}
                    />
                    <StatCard
                        title="Total Sessions"
                        value={overview.totals.sessions}
                        subtitle="All time"
                        color="bg-purple-500"
                        delay={0.2}
                    />
                    <StatCard
                        title="Total Minutes"
                        value={overview.totals.minutes}
                        subtitle="All time"
                        color="bg-pink-500"
                        delay={0.3}
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Weekly Trend */}
                    <motion.div
                        className="bg-white rounded-xl shadow-lg p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Focus Time</h2>
                        <div style={{ height: '300px' }}>
                            <Line data={weeklyChartData} options={chartOptions} />
                        </div>
                    </motion.div>

                    {/* Category Breakdown */}
                    <motion.div
                        className="bg-white rounded-xl shadow-lg p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Time by Category</h2>
                        <div style={{ height: '300px' }} className="flex items-center justify-center">
                            {overview.categoryBreakdown.length > 0 ? (
                                <Doughnut data={categoryChartData} options={chartOptions} />
                            ) : (
                                <p className="text-gray-500">No category data yet</p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, subtitle, color, delay }) {
    return (
        <motion.div
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
        >
            <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
                <span className="text-white text-2xl font-bold">📊</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
            <p className="text-gray-500 text-sm">{subtitle}</p>
        </motion.div>
    );
}