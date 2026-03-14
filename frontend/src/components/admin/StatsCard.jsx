import GlassCard from '../GlassCard';

export default function StatsCard({ title, value, accent = 'text-cyan-100' }) {
  return (
    <GlassCard>
      <p className="text-xs uppercase tracking-widest text-slate-300">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${accent}`}>{value}</p>
    </GlassCard>
  );
}
