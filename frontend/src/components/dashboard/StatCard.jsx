import { ArrowDown, ArrowUp } from "lucide-react";

function StatCard({
  title,
  value,
  unit,
  change,
  trend = "up",
  description,
  icon: Icon,
}) {
  const positive = trend === "up";

  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <div>
          <span className="stat-title">{title}</span>

          <div className="stat-value-row">
            <strong>{value}</strong>
            {unit && <span>{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div className="stat-icon">
            <Icon size={18} strokeWidth={1.8} />
          </div>
        )}
      </div>

      <div className="stat-card-bottom">
        <span className={`stat-change ${positive ? "positive" : "negative"}`}>
          {positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {change}
        </span>

        <span className="stat-description">{description}</span>
      </div>
    </article>
  );
}

export default StatCard;