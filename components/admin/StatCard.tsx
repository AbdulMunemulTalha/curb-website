export default function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-card border border-border-subtle bg-bg-surface p-5">
      <p className="font-body text-xs uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-2 font-mono text-3xl text-text-primary">{value}</p>
    </div>
  );
}
