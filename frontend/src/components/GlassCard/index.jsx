export default function GlassCard({ className = '', children }) {
  return <div className={`glass-card p-5 ${className}`}>{children}</div>;
}
