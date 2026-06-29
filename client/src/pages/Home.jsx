import { Link } from "react-router-dom";
import "./Home.css";

/* ---------- Inline icon set (no external icon library required) ---------- */

const IconShield = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M12 3.5l7 3v5.2c0 4.4-3 7.6-7 8.8-4-1.2-7-4.4-7-8.8V6.5l7-3z" />
    <path d="M9 12.2l2.1 2.1 4-4.2" />
  </svg>
);

const IconKey = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <circle cx="8" cy="15" r="3.4" />
    <path d="M10.3 12.7L19 4" />
    <path d="M16 7l2.2 2.2" />
    <path d="M13.2 9.8L15.4 12" />
  </svg>
);

const IconUserPlus = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <circle cx="9.5" cy="8" r="3.3" />
    <path d="M3.8 19c0-3.2 2.6-5.4 5.7-5.4s5.7 2.2 5.7 5.4" />
    <path d="M18.5 8.5v5M16 11h5" />
  </svg>
);

const IconBadge = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M12 2.8l2.4 1.6 2.8.2 1 2.6 2.1 1.9-1 2.7 1 2.7-2.1 1.9-1 2.6-2.8.2L12 21.2l-2.4-1.6-2.8-.2-1-2.6-2.1-1.9 1-2.7-1-2.7 2.1-1.9 1-2.6 2.8-.2L12 2.8z" />
    <path d="M9.2 12.1l2 2 3.6-3.8" />
  </svg>
);

const IconAmbulance = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M3 16V9.5A1.5 1.5 0 0 1 4.5 8H14a1.5 1.5 0 0 1 1.5 1.5V16" />
    <path d="M15.5 11H19a2 2 0 0 1 2 2v3h-2" />
    <circle cx="7" cy="17.5" r="1.6" />
    <circle cx="16.5" cy="17.5" r="1.6" />
    <path d="M3 16h2M14.5 16h2.5" />
    <path d="M8 9.2v3.6M6.2 11h3.6" />
  </svg>
);

const IconPhoneHeart = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M5 4.5c0-.6.5-1 1-1h2.2c.4 0 .8.3.9.7l.8 2.7c.1.4 0 .8-.3 1.1L8.4 9.1c1 2.3 2.7 4 5 5l1.1-1.2c.3-.3.7-.4 1.1-.3l2.7.8c.4.1.7.5.7.9V16.7c0 .6-.5 1-1.1 1-7-.3-12.5-5.8-12.9-12.9 0-.1 0-.2 0-.3z" />
    <path d="M12 3.3c.6-.6 1.6-.6 2.2 0 .6.6.6 1.5 0 2.1L12.7 7l-1.5-1.6c-.6-.6-.6-1.5 0-2.1.6-.6 1.6-.6 2.2 0z" />
  </svg>
);

const services = [
  { id: "police", label: "Police", number: "112", Icon: IconBadge, note: "Crime & immediate threat" },
  { id: "ambulance", label: "Ambulance", number: "108", Icon: IconAmbulance, note: "Medical emergency" },
  { id: "helpline", label: "Women Helpline", number: "181", Icon: IconPhoneHeart, note: "Support, anytime" },
];

export default function Home() {
  return (
    <main className="home-page">
      <div className="bg-aurora" aria-hidden="true" />

      <section className="hero">
        <div className="radar-pulse" aria-hidden="true">
          <span className="ring" />
          <span className="ring" />
          <span className="ring" />
        </div>

        <div className="hero-card">
          <div className="eyebrow">
            <span className="live-dot" />
            Always active &mdash; 24/7 alert network
          </div>

          <div className="brand-mark">
            <IconShield className="brand-icon" />
          </div>

          <h1 className="title">Girls Safety Alert</h1>
          <p className="subtitle">Your Safety, Our Priority</p>

          <p className="description">
            A focused safety companion that puts emergency contacts, quick alerts,
            and trusted support one tap away &mdash; built so help is never more
            than a few seconds out of reach.
          </p>

          <div className="cta-row">
            <Link to="/login" className="btn btn-ghost">
              <IconKey className="btn-icon" />
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              <IconUserPlus className="btn-icon" />
              Register
            </Link>
          </div>
        </div>
      </section>

      <section className="emergency-section">
        <div className="section-heading">
          <h2>Emergency Services</h2>
          <p>One tap away, day or night.</p>
        </div>

        <div className="emergency-grid">
          {services.map(({ id, label, number, Icon, note }) => (
            <a
              key={id}
              href={`tel:${number}`}
              className="emergency-card"
              aria-label={`Call ${label} at ${number}`}
            >
              <span className="emergency-icon">
                <Icon />
              </span>
              <span className="emergency-label">{label}</span>
              <span className="emergency-number">{number}</span>
              <span className="emergency-note">{note}</span>
              <span className="tap-hint">Tap to call</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
