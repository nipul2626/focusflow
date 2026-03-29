import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAnalyticsStore } from '../stores/analyticsStore';
import GlowButton from '../components/GlowButton';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const RANGE_MAP = {
    '7d': 'week',
    '30d': 'month',
    all: 'year',
};

export default function Analytics() {
    const navigate = useNavigate();
    const { overview, trends, fetchOverview, fetchTrends, isLoading } = useAnalyticsStore();
    const [range, setRange] = useState('7d');

    useEffect(() => {
        fetchOverview();
    }, []);

    useEffect(() => {
        fetchTrends(RANGE_MAP[range]);
    }, [range]);

    const trendSource = trends?.trend || overview?.weeklyTrend || [];
    const categorySource = trends?.categoryBreakdown || overview?.categoryBreakdown || [];

    const lineData = useMemo(() => ({
        labels: trendSource.map((d) => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })),
        datasets: [
            {
                label: 'Focus Minutes',
                data: trendSource.map((d) => d.minutes),
                borderColor: '#22d3ee',
                backgroundColor: 'rgba(34, 211, 238, 0.2)',
                pointBackgroundColor: '#a855f7',
                pointBorderColor: '#fff',
                tension: 0.35,
                fill: true,
            },
        ],
    }), [trendSource]);

    const barData = useMemo(() => ({
        labels: categorySource.map((c) => c.category?.name || 'Uncategorized'),
        datasets: [
            {
                label: 'Minutes',
                data: categorySource.map((c) => c.totalMinutes),
                backgroundColor: categorySource.map((c) => c.category?.color || '#22d3ee'),
                borderRadius: 8,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.2)',
            },
        ],
    }), [categorySource]);

    const neonChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#cbd5e1' } },
        },
        scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.12)' } },
            y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.12)' } },
        },
    };

    if (isLoading || !overview) {
        return <div className="dashboard-shell min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" /></div>;
    }

    const statCards = [
        { title: "Today's Focus", value: `${overview.today.focusMinutes}m`, subtitle: `${overview.today.sessions} sessions`, icon: '⚡', delta: '+12%' },
        { title: 'Tasks Completed', value: overview.today.tasksCompleted, subtitle: 'Today', icon: '✅', delta: '+8%' },
        { title: 'Total Sessions', value: overview.totals.sessions, subtitle: 'All time', icon: '⏱️', delta: '+5%' },
        { title: 'Total Minutes', value: overview.totals.minutes, subtitle: 'All time', icon: '📈', delta: '+18%' },
    ];

    return (
        <div className="dashboard-shell min-h-screen">
            <div className="dashboard-aurora" />
            <div className="dashboard-grid-overlay" />

            <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/45 backdrop-blur-xl">
                <div className="max-w-[1300px] mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3 relative z-10">
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">Analytics Dashboard</h1>
                    <div className="flex flex-wrap gap-3">
                        <GlowButton onClick={() => navigate('/dashboard')}>← Dashboard</GlowButton>
                        <GlowButton variant="subtle" onClick={() => navigate('/profile')}>👤 Profile</GlowButton>
                    </div>
                </div>
            </header>

            <main className="max-w-[1300px] mx-auto px-4 py-8 relative z-10">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                    <h2 className="text-2xl font-bold text-slate-100">Focus Insights</h2>
                    <div className="flex gap-2">
                        {['7d', '30d', 'all'].map((item) => (
                            <button
                                key={item}
                                onClick={() => setRange(item)}
                                className={`px-4 py-2 rounded-xl font-medium transition ${range === item ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white' : 'bg-slate-900/50 border border-white/15 text-slate-200'}`}
                            >
                                {item.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                    {statCards.map((card, i) => (
                        <motion.div
                            key={card.title}
                            className="rounded-2xl p-[1px] bg-gradient-to-r from-cyan-400/70 via-violet-400/70 to-fuchsia-500/70"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                        >
                            <div className="rounded-2xl bg-slate-900/80 border border-white/10 p-5">
                                <div className="flex items-start justify-between">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl">{card.icon}</div>
                                    <span className="text-emerald-300 text-sm">↗ {card.delta}</span>
                                </div>
                                <p className="text-slate-300 mt-4 text-sm">{card.title}</p>
                                <p className="text-3xl font-bold text-white">{card.value}</p>
                                <p className="text-slate-400 text-sm">{card.subtitle}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.section className="rounded-3xl border border-cyan-300/20 bg-slate-900/60 backdrop-blur-xl p-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                        <h3 className="text-xl font-bold text-slate-100 mb-4">Weekly Focus Trend</h3>
                        <div style={{ height: 320 }}>
                            {lineData.labels.length > 0 ? (
                                <Line data={lineData} options={neonChartOptions} />
                            ) : (
                                <EmptyAnalyticsCard title="No trend data yet" subtitle="Start a few focus sessions to see your graph." />
                            )}
                        </div>
                    </motion.section>

                    <motion.section className="rounded-3xl border border-fuchsia-300/20 bg-slate-900/60 backdrop-blur-xl p-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                        <h3 className="text-xl font-bold text-slate-100 mb-4">Time by Category</h3>
                        <div style={{ height: 320 }}>
                            {barData.labels.length > 0 ? (
                                <Bar data={barData} options={neonChartOptions} />
                            ) : (
                                <EmptyAnalyticsCard title="No category data yet" subtitle="Create tasks in categories and start focus timer." />
                            )}
                        </div>
                    </motion.section>
                </div>
            </main>
        </div>
    );
}

function EmptyAnalyticsCard({ title, subtitle }) {
    return (
        <div className="h-full rounded-2xl border border-dashed border-cyan-300/30 bg-slate-950/40 flex flex-col items-center justify-center text-center p-6">
            <p className="text-lg font-semibold text-slate-100">{title}</p>
            <p className="text-sm text-slate-300 mt-2">{subtitle}</p>
            <p className="mt-3 text-cyan-300">✨ Keep going — your insights will appear here</p>
        </div>
    );
}