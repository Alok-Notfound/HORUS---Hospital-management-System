import {
  ArrowDown,
  ArrowUp,
  BedDouble,
  CircleAlert,
  DoorOpen,
  Gauge,
  Timer,
} from "lucide-react";

const metrics = [
  {
    label: "Occupancy",
    value: "88.4%",
    detail: "221/250 Beds",
    status: "warning",
    icon: BedDouble,
  },
  {
    label: "Physical Beds Open",
    value: "29",
    detail: "4 ICU · 15 Med · 8 Surg · 2 Peds",
    icon: DoorOpen,
  },
  {
    label: "Net Velocity",
    value: "+5",
    detail: "14 In · 9 Out",
    trend: "up",
    icon: Gauge,
  },
  {
    label: "Lab TAT",
    value: "2.7 hrs",
    detail: "4 Breaching SLA",
    status: "error",
    icon: Timer,
  },
  {
    label: "Lost Bed-Hours",
    value: "18.5",
    detail: "Today",
    icon: CircleAlert,
  },
];

function KpiRibbon() {
  return (
    <section className="kpi-ribbon">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;

        return (
          <article
            className={`kpi-item ${index === 0 ? "kpi-primary" : ""}`}
            key={metric.label}
          >
            <div className="kpi-label-row">
              <span>{metric.label}</span>
              <Icon size={15} strokeWidth={1.8} />
            </div>

            <div className="kpi-value-row">
              <strong>{metric.value}</strong>

              {metric.status === "warning" && (
                <span className="kpi-status warning">WARNING</span>
              )}

              {metric.status === "error" && (
                <span className="kpi-status error">ALERT</span>
              )}

              {metric.trend === "up" && (
                <span className="kpi-trend">
                  <ArrowUp size={12} />
                </span>
              )}
            </div>

            <p>{metric.detail}</p>

            {index === 2 && (
              <div className="velocity-indicator">
                <span>
                  <ArrowUp size={10} />
                  14 In
                </span>
                <span>
                  <ArrowDown size={10} />
                  9 Out
                </span>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}

export default KpiRibbon;