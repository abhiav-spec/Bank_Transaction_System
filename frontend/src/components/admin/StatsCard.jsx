import GlassCard from '../GlassCard';

export default function StatsCard({ title, value, accent = 'text-blue-600' }) {
  return (
    <GlassCard>
      <p className="text-xs uppercase tracking-widest text-slate-700">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${accent}`}>{value}</p>
    </GlassCard>
  );
}
