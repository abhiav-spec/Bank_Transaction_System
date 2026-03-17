export default function GlassCard({ className = '', children, noPad = false }) {
  return (
    <div className={`glass-card ${noPad ? '' : 'p-5'} ${className}`}>
      {children}
    </div>
  );
}
