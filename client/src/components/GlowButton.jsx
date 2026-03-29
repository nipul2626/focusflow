export default function GlowButton({
                                       children,
                                       className = '',
                                       variant = 'primary',
                                       type = 'button',
                                       ...props
                                   }) {
    const variants = {
        primary: 'from-cyan-400 via-indigo-500 to-fuchsia-500 text-white',
        subtle: 'from-indigo-300 via-violet-400 to-pink-400 text-white',
        danger: 'from-rose-400 via-red-500 to-orange-500 text-white',
    };

    return (
        <div className={`relative p-[2px] rounded-xl bg-gradient-to-r ${variants[variant]} group ${className}`}>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-80" />
            <button
                type={type}
                className="relative w-full rounded-[10px] bg-slate-900/90 px-4 py-2.5 font-semibold transition-transform duration-200 hover:-translate-y-[1px] disabled:opacity-60"
                {...props}
            >
                {children}
            </button>
        </div>
    );
}