interface ConceptJourneyProps {
  icon: string;
  label: string;
  labels: readonly string[];
  reducedMotion: boolean;
  stage: number;
}

export function ConceptJourney({ icon, label, labels, reducedMotion, stage }: ConceptJourneyProps) {
  return <div className={`concept-journey${reducedMotion ? " concept-journey--still" : ""}`} aria-label={label} role="img">
    <span className="concept-journey-icon" aria-hidden="true">{icon}</span>
    <div className="concept-journey-track" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => <span className={`concept-journey-node${index === stage ? " concept-journey-node--active" : ""}${index < stage ? " concept-journey-node--visited" : ""}`} key={labels[index]}><b>{index + 1}</b><small>{labels[index]}</small></span>)}
    </div>
  </div>;
}
