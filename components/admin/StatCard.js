export default function StatCard({ label, value, detail, icon: Icon, tone = "green" }) {
  return <article className="statCard"><div className={`statIcon ${tone}`}><Icon size={19} /></div><div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div></article>;
}