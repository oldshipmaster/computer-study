export type BibiMood = "happy" | "thinking" | "celebrating";

interface BibiProps {
  className?: string;
  mood: BibiMood;
  message: string;
}

export function Bibi({ className = "", mood, message }: BibiProps) {
  return (
    <aside
      className={`bibi bibi--${mood} ${className}`.trim()}
      aria-label={`比比：${message}`}
    >
      <div className="bibi-portrait" aria-hidden="true">
        <span className="bibi-antenna">
          <span className="bibi-antenna-light" />
        </span>
        <span className="bibi-ear bibi-ear--left" />
        <span className="bibi-ear bibi-ear--right" />
        <span className="bibi-head">
          <span className="bibi-screen">
            <span className="bibi-eye bibi-eye--left" />
            <span className="bibi-eye bibi-eye--right" />
            <span className="bibi-mouth" />
          </span>
        </span>
        <span className="bibi-body">
          <span className="bibi-heart">★</span>
        </span>
        <span className="bibi-arm bibi-arm--left" />
        <span className="bibi-arm bibi-arm--right" />
      </div>
      <div className="bibi-message">
        <strong>比比</strong>
        <p>{message}</p>
      </div>
    </aside>
  );
}
