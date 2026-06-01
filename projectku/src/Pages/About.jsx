import Reveal from "../components/Reveal";
import AvatarPlaceholder from "../components/AvatarPlaceholder";
import { profile } from "../content/profile";

export default function About() {
  return (
    <main>
      <section className="aboutV2">
        <div className="container aboutInner">
          <Reveal>
            <div className="aboutCard">
              <p className="kickerV2">{profile.name}</p>
              <h2 className="h2V2">About Me</h2>
              <div className="aboutText">
                {profile.about.map((p) => (
                  <p key={p} className="muted">
                    {p}
                  </p>
                ))}
              </div>
              {profile.quote ? (
                <div className="aboutQuote" aria-label="Quote">
                  <div className="aboutQuoteMark" aria-hidden="true">
                    &ldquo;
                  </div>
                  <p className="aboutQuoteText">{profile.quote}</p>
                </div>
              ) : null}
            </div>
          </Reveal>
          <Reveal delayMs={90}>
            <div className="aboutSide">
              <AvatarPlaceholder alt={`${profile.name} profile photo`} />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
