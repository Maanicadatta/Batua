export default function Card({ icon, title, children }) {
  return (
    <div className="card hover-pop">
      <div className={`card-icon ${icon}`} aria-hidden />
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
