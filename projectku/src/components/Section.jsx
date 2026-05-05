import Reveal from "./Reveal";

export default function Section({ id, title, kicker, children }) {
  return (
    <section id={id} className="section">
      <div className="container">
        <Reveal>
          <div className="sectionHeader">
            {kicker ? <p className="kicker">{kicker}</p> : null}
            <h2 className="h2">{title}</h2>
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
