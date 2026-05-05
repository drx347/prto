import { profile } from "../../content/profile";

export default function Projects() {
  return (
    <main>
      <div className="container" style={{ padding: "60px 0" }}>
        <h1 style={{ margin: 0 }}>Projects</h1>
        <ul>
          {profile.projects.map((p) => (
            <li key={p.title} className="muted">
              {p.title}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
