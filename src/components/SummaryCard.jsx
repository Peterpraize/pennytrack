export default function SummaryCard({ title, value, description, tone = 'neutral', icon }) {
  return (
    <article className={`summary-card summary-card-${tone}`}>
      <div className="summary-card-top"><span className="summary-label">{title}</span><span className="summary-icon" aria-hidden="true">{icon}</span></div>
      <p className="summary-value">{value}</p>
      <p className="summary-description">{description}</p>
    </article>
  );
}
