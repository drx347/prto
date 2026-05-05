export default function EducationTimeline({ items = [] }) {
  if (!items?.length) return null;

  return (
    <div className="eduTimeline" role="list" aria-label="Education timeline">
      {items.map((item) => (
        <div key={`${item.period}-${item.title}`} className="eduItem" role="listitem">
          <div className="eduPeriod muted">{item.period}</div>
          <div className="eduRail" aria-hidden="true">
            <span className="eduDot" />
          </div>
          <div className="eduContent">
            <h3 className="eduTitle">{item.title}</h3>
            {item.subtitle ? <p className="eduSubtitle muted">{item.subtitle}</p> : null}
            {item.details ? <p className="eduDetails muted">{item.details}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

