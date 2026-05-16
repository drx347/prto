import { useEffect, useMemo, useRef, useState } from "react";
import Reveal from "../../components/Reveal";
import Showcase from "../../components/Showcase";
import AvatarPlaceholder from "../../components/AvatarPlaceholder";
import AnimatedProfileMeta from "../../components/AnimatedProfileMeta";
import EducationTimeline from "../../components/EducationTimeline";
import ContactForm from "../../components/ContactForm";
import { GithubIcon, LinkedinIcon, MailIcon as MailIcon2 } from "../../components/Icons";
import { profile } from "../../content/profile";

const ROLE_PHRASES = ["Fullstack Developer", "Web Development", "Roblox Studio Scripting", "Discord Bot Development", "Cybersecurity Beginner"];
const EDU_DECOR_TAGS = ["Self-Taught", "Web Dev", "Bots", "Scripting"];

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 17 17 7M10 7h7v7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 6h16v12H4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="m4 7 8 6 8-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function socialIcon(label) {
  const lower = label.toLowerCase();
  if (lower.includes("github")) return GithubIcon;
  if (lower.includes("linkedin")) return LinkedinIcon;
  if (lower.includes("email") || lower.includes("mail")) return MailIcon2;
  return null;
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

function useRotatingTypewriter(
  phrases,
  {
    typeMs = 36,
    deleteMs = 22,
    pauseMs = 1100,
    startDelayMs = 420,
  } = {}
) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!phrases?.length) {
      setText("");
      return;
    }

    if (prefersReducedMotion()) {
      setText(phrases[0] ?? "");
      return;
    }

    let timeoutId = 0;
    let pauseTimeoutId = 0;
    const phrase = phrases[idx] ?? "";

    timeoutId = window.setTimeout(
      () => {
        if (!deleting) {
          const next = phrase.slice(0, text.length + 1);
          setText(next);
          if (next.length >= phrase.length) {
            pauseTimeoutId = window.setTimeout(() => setDeleting(true), pauseMs);
          }
        } else {
          const next = text.slice(0, Math.max(0, text.length - 1));
          setText(next);
          if (next.length === 0) {
            setDeleting(false);
            setIdx((v) => (v + 1) % phrases.length);
          }
        }
      },
      text.length === 0 && !deleting ? startDelayMs : deleting ? deleteMs : typeMs
    );

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (pauseTimeoutId) window.clearTimeout(pauseTimeoutId);
    };
  }, [phrases, idx, deleting, text, typeMs, deleteMs, pauseMs, startDelayMs]);

  return text;
}

function RotatingTypeLine({ phrases = ROLE_PHRASES }) {
  const typedRole = useRotatingTypewriter(phrases);
  return (
    <p className="typeLine">
      {typedRole}
      <span className="caret" aria-hidden="true" />
    </p>
  );
}

export default function HomeDesktop({ rootClassName = "homeRoot homeRoot--desktop" }) {
  const aboutText = useMemo(() => profile.about.join(" "), []);
  const aboutBadges = useMemo(() => profile.aboutBadges?.slice(0, 3) ?? [], []);

  const aboutDecoRef = useRef(null);
  const tiltRafRef = useRef(0);
  const tiltTargetRef = useRef({ x: 0, y: 0 });
  const tiltCurrentRef = useRef({ x: 0, y: 0 });
  const heroDecoRef = useRef(null);
  const heroTiltRafRef = useRef(0);
  const heroTiltTargetRef = useRef({ x: 0, y: 0 });
  const heroTiltCurrentRef = useRef({ x: 0, y: 0 });

  const tiltEnabled = useMemo(() => {
    if (typeof window === "undefined") return false;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
    return !reduce && !coarse;
  }, []);

  const setAboutDecoVars = (x, y) => {
    const el = aboutDecoRef.current;
    if (!el) return;

    const tiltX = (-y * 7).toFixed(2);
    const tiltY = (x * 10).toFixed(2);
    const moveX = (x * 12).toFixed(1);
    const moveY = (y * 10).toFixed(1);

    el.style.setProperty("--aboutTiltX", `${tiltX}deg`);
    el.style.setProperty("--aboutTiltY", `${tiltY}deg`);
    el.style.setProperty("--aboutMoveX", `${moveX}px`);
    el.style.setProperty("--aboutMoveY", `${moveY}px`);
  };

  const tickAboutTilt = () => {
    const current = tiltCurrentRef.current;
    const target = tiltTargetRef.current;

    current.x += (target.x - current.x) * 0.12;
    current.y += (target.y - current.y) * 0.12;

    setAboutDecoVars(current.x, current.y);

    const done =
      Math.abs(target.x - current.x) < 0.0008 && Math.abs(target.y - current.y) < 0.0008;

    if (done) {
      tiltRafRef.current = 0;
      return;
    }

    tiltRafRef.current = requestAnimationFrame(tickAboutTilt);
  };

  const onAboutPointerMove = (e) => {
    if (!tiltEnabled) return;
    const el = aboutDecoRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const x = Math.max(-1, Math.min(1, px * 2 - 1));
    const y = Math.max(-1, Math.min(1, py * 2 - 1));

    tiltTargetRef.current = { x, y };
    if (!tiltRafRef.current) tiltRafRef.current = requestAnimationFrame(tickAboutTilt);
  };

  const onAboutPointerLeave = () => {
    tiltTargetRef.current = { x: 0, y: 0 };
    if (!tiltRafRef.current) tiltRafRef.current = requestAnimationFrame(tickAboutTilt);
  };

  const setHeroDecoVars = (x, y) => {
    const el = heroDecoRef.current;
    if (!el) return;

    const tiltX = (-y * 9).toFixed(2);
    const tiltY = (x * 11).toFixed(2);
    const moveX = (x * 24).toFixed(1);
    const moveY = (y * 16).toFixed(1);
    const glowX = `${(x * 18 + 50).toFixed(2)}%`;
    const glowY = `${(y * 18 + 50).toFixed(2)}%`;

    el.style.setProperty("--heroTiltX", `${tiltX}deg`);
    el.style.setProperty("--heroTiltY", `${tiltY}deg`);
    el.style.setProperty("--heroShiftX", `${moveX}px`);
    el.style.setProperty("--heroShiftY", `${moveY}px`);
    el.style.setProperty("--heroGlowX", glowX);
    el.style.setProperty("--heroGlowY", glowY);
  };

  const tickHeroTilt = () => {
    const current = heroTiltCurrentRef.current;
    const target = heroTiltTargetRef.current;

    current.x += (target.x - current.x) * 0.1;
    current.y += (target.y - current.y) * 0.1;

    setHeroDecoVars(current.x, current.y);

    const done =
      Math.abs(target.x - current.x) < 0.0008 && Math.abs(target.y - current.y) < 0.0008;

    if (done) {
      heroTiltRafRef.current = 0;
      return;
    }

    heroTiltRafRef.current = requestAnimationFrame(tickHeroTilt);
  };

  const onHeroPointerMove = (e) => {
    if (!tiltEnabled) return;
    const el = heroDecoRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const x = Math.max(-1, Math.min(1, px * 2 - 1));
    const y = Math.max(-1, Math.min(1, py * 2 - 1));

    heroTiltTargetRef.current = { x, y };
    if (!heroTiltRafRef.current) heroTiltRafRef.current = requestAnimationFrame(tickHeroTilt);
  };

  const onHeroPointerLeave = () => {
    heroTiltTargetRef.current = { x: 0, y: 0 };
    if (!heroTiltRafRef.current) heroTiltRafRef.current = requestAnimationFrame(tickHeroTilt);
  };

  useEffect(() => {
    return () => {
      if (heroTiltRafRef.current) cancelAnimationFrame(heroTiltRafRef.current);
      if (tiltRafRef.current) cancelAnimationFrame(tiltRafRef.current);
    };
  }, []);

  return (
    <main className={rootClassName}>
      <section
        id="home"
        className="heroV2"
        onPointerMove={onHeroPointerMove}
        onPointerLeave={onHeroPointerLeave}
      >
        <div className="heroDeco" aria-hidden="true">
          <div className="heroDecoScene" ref={heroDecoRef}>
            <span className="heroDecoAura auraA" />
            <span className="heroDecoAura auraB" />
            <span className="heroDecoMotif motifA" />
            <span className="heroDecoMotif motifB" />
            <span className="heroDecoMotif motifC" />
            <span className="heroDecoMotif motifD" />
            <span className="heroDecoMotif motifE" />
            <span className="heroDecoTrail trailA" />
            <span className="heroDecoTrail trailB" />
          </div>
        </div>
        <div className="container heroV2Inner heroV2Inner--center">
          <div className="heroLeftV2">
            {false ? (
              <Reveal>
                <div className="badge">
                  <span className="badgeSpark" aria-hidden="true">
                  ✦
                  </span>
                  {/* removed */}
                </div>
              </Reveal>
            ) : null}

            <Reveal delayMs={30}>
              <div className="heroEyebrow" aria-label="Portfolio context">
                <span>Jawa Timur, Indonesia</span>
                <span>UT Student</span>
                <span>Build log 2026</span>
              </div>
            </Reveal>

            <Reveal delayMs={60}>
              <h1 className="heroTitle">
                <span className="heroTitleTop edgyText">Audrey</span>
                <span className="heroTitleBottom accentText">builds web things</span>
              </h1>
            </Reveal>

            <Reveal delayMs={90}>
              <RotatingTypeLine />
            </Reveal>

            <Reveal delayMs={120}>
              <p className="heroSubtitle">{profile.tagline}</p>
            </Reveal>

            <Reveal delayMs={135}>
              <div className="humanNote" aria-label="Short personal note">
                <span className="humanNoteLabel">currently</span>
                <span>
                  Turning small experiments into clean interfaces, Discord tools, and Lua scripts
                  that are actually pleasant to use.
                </span>
              </div>
            </Reveal>

            <Reveal delayMs={150}>
              <div className="chipRow" aria-label="Tech highlight">
                {profile.heroChips.map((c) => (
                  <span key={c} className="chip">
                    {c}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delayMs={180}>
              <div className="heroButtons">
                <a className="btn2" href="#portfolio">
                  Projects{" "}
                  <span className="btnIcon" aria-hidden="true">
                    <ArrowUpRightIcon />
                  </span>
                </a>
                <a className="btn2 btn2Ghost" href="#contact">
                  Contact{" "}
                  <span className="btnIcon" aria-hidden="true">
                    <MailIcon />
                  </span>
                </a>
              </div>
            </Reveal>

            <Reveal delayMs={210}>
              <div className="iconRow" aria-label="Sosial">
                {profile.socials.slice(0, 3).map((s) => {
                  const Icon = socialIcon(s.label);
                  return (
                    <a
                      key={s.href}
                      className="iconBtn"
                      href={s.href}
                      target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={s.href.startsWith("mailto:") ? undefined : "noreferrer"}
                      aria-label={s.label}
                      title={s.label}
                    >
                      {Icon ? <Icon title={s.label} /> : s.label.slice(0, 1)}
                    </a>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="about" className="aboutV2">
        <div className="container">
          <div className="aboutDesktopGrid">
            <div className="aboutDesktopMain">
          <Reveal>
            <div className="aboutHeaderCard" aria-label="About header">
              <div className="aboutHeaderCover" aria-hidden="true" />
              <div className="aboutNotebookTape" aria-hidden="true">profile note</div>
              <div className="aboutSectionHead aboutSectionHeadCentered" aria-hidden="true" />
              <div className="aboutHeaderRow">
                <div className="aboutHeaderMain" aria-label="Profil">
                  <div className="aboutHeaderTop">
                    <div className="aboutHeaderAvatarWrap" aria-label="Foto profil">
                      <div className="aboutHeaderAvatarInner">
                        <AvatarPlaceholder alt={`Foto ${profile.name}`} />
                      </div>
                      <span className="aboutHeaderStatus" aria-hidden="true" />
                    </div>

                    <div className="aboutHeaderInfo">
                      <h2 className="aboutHeaderName">{profile.name}</h2>
                      <p
                        className="aboutHeaderMeta muted"
                      >
                        <span className="aboutHeaderMetaLegacy" aria-hidden="true">
                          {profile.role}
                          {profile.age ? ` \u2022 ${profile.age} y/o` : ""}
                        </span>
                        <AnimatedProfileMeta
                          text={
                            profile.age
                              ? `${profile.role} \u2022 ${profile.age} y/o`
                              : profile.role
                          }
                        />
                      </p>
                      <p className="aboutHeaderLocation">
                        <span className="aboutLocIcon" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                            />
                            <circle cx="12" cy="10" r="2.6" fill="currentColor" />
                          </svg>
                        </span>
                        <span>{profile.location}</span>
                      </p>
                      {aboutBadges.length ? (
                        <div className="aboutHeaderBadges" aria-label="Focus area">
                          {aboutBadges.map((badge, index) => (
                            <span
                              key={badge}
                              className="aboutHeaderBadge"
                              style={{ "--about-badge-delay": `${index * 140}ms` }}
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="aboutHeaderActions" aria-label="Social actions">
                    <div className="aboutHeaderIcons">
                      {profile.socials.slice(0, 3).map((s) => {
                        const Icon = socialIcon(s.label);
                        return (
                          <a
                            key={s.href}
                            className="iconBtn"
                            href={s.href}
                            target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                            rel={s.href.startsWith("mailto:") ? undefined : "noreferrer"}
                            aria-label={s.label}
                            title={s.label}
                          >
                            {Icon ? <Icon title={s.label} /> : s.label.slice(0, 1)}
                          </a>
                        );
                      })}
                    </div>

                    {profile.discordInvite ? (
                      <a
                        className="aboutDiscordBtn"
                        href={profile.discordInvite}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="aboutDiscordIcon" aria-hidden="true">
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M7.5 8.5h9a3 3 0 0 1 3 3v2.4a3.6 3.6 0 0 1-3.6 3.6H9.2L6.3 20v-2.5A3.8 3.8 0 0 1 4.5 14V11.5a3 3 0 0 1 3-3Z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinejoin="round"
                            />
                            <circle cx="10" cy="13" r="1" fill="currentColor" />
                            <circle cx="14" cy="13" r="1" fill="currentColor" />
                          </svg>
                        </span>
                        Join Discord
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="aboutBodyV3">
            <Reveal delayMs={60}>
              <p className="aboutLead muted">{aboutText}</p>
            </Reveal>

            <Reveal delayMs={85}>
              <div className="fieldNotes" aria-label="Working notes">
                <span>UI that feels calm</span>
                <span>Performance before sparkle</span>
                <span>Learning in public, one build at a time</span>
              </div>
            </Reveal>

            {profile.quote ? (
              <Reveal delayMs={110}>
                <div className="aboutQuote" aria-label="Quote">
                  <div className="aboutQuoteMark" aria-hidden="true">
                    “
                  </div>
                  <p className="aboutQuoteText">{profile.quote}</p>
                </div>
              </Reveal>
            ) : null}

            <Reveal delayMs={150}>
              <div className="aboutCtas">
                <a className="btn2 btn2Ghost" href="#portfolio">
                  <span className="btnIcon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M9 18 3 12l6-6m6 0 6 6-6 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  View Projects
                </a>
              </div>
            </Reveal>
          </div>
            </div>

            <Reveal delayMs={90}>
              <aside
                className="aboutMediaWrap"
                aria-label="Decorative panel"
                ref={aboutDecoRef}
                data-tilt={tiltEnabled ? "on" : "off"}
                onPointerMove={onAboutPointerMove}
                onPointerLeave={onAboutPointerLeave}
              >
                <div className="aboutDecoPanel" aria-hidden="true">
                  <span className="aboutDecoSpark s1" />
                  <span className="aboutDecoSpark s2" />
                  <span className="aboutDecoSpark s3" />
                  <span className="aboutDecoSpark s4" />
                  <span className="aboutDecoSpark s5" />
                  <span className="aboutDecoSpark s6" />
                  {aboutBadges.map((badge, index) => (
                    <span
                      key={badge}
                      className={`aboutFloatingTag aboutFloatingTag--${index + 1}`}
                      style={{ "--about-badge-delay": `${index * 160}ms` }}
                    >
                      {badge}
                    </span>
                  ))}

                  <svg className="aboutDecoOrbits" viewBox="0 0 600 600" fill="none" aria-hidden="true">
                    <path
                      d="M90 330c80 90 340 90 420 0"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      opacity="0.65"
                    />
                    <path
                      d="M120 250c90-95 270-95 360 0"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      opacity="0.55"
                    />
                    <circle cx="300" cy="300" r="210" stroke="currentColor" strokeWidth="1.1" opacity="0.18" />
                    <circle cx="300" cy="300" r="150" stroke="currentColor" strokeWidth="1.1" opacity="0.12" />
                  </svg>

                  <div className="aboutDecoCrosshair" aria-hidden="true">
                    <span className="aboutDecoCrosshairH" />
                    <span className="aboutDecoCrosshairV" />
                  </div>

                  <div className="aboutDecoDevice">
                    <div className="aboutDecoDeviceTop">
                      <span className="aboutDecoDot" />
                      <span className="aboutDecoDot" />
                      <span className="aboutDecoDot" />
                      <span className="aboutDecoPill">BUILD</span>
                    </div>
                    <div className="aboutDecoDeviceScreen">
                      {aboutBadges.length ? (
                        <div className="aboutDecoBadgeRow">
                          {aboutBadges.map((badge, index) => (
                            <span
                              key={badge}
                              className="aboutDecoMiniBadge"
                              style={{ "--about-badge-delay": `${index * 160}ms` }}
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <div className="aboutDecoCodeLine w1" />
                      <div className="aboutDecoCodeLine w2" />
                      <div className="aboutDecoCodeLine w3" />
                      <div className="aboutDecoCodeLine w4" />
                      <div className="aboutDecoCodeLine w5" />
                      <div className="aboutDecoCodeLine w6" />
                      <div className="aboutDecoCursor" />
                      <span className="aboutDecoScanline" />
                      <span className="aboutDecoCorner c1" />
                      <span className="aboutDecoCorner c2" />
                      <span className="aboutDecoCorner c3" />
                      <span className="aboutDecoCorner c4" />
                    </div>
                    <div className="aboutDecoDeviceBase" />
                  </div>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="education" className="eduV2">
        <div className="container">
          <div className="eduHeader">
            <Reveal>
              <p className="kickerV2">Education</p>
            </Reveal>
            <Reveal delayMs={70}>
              <h2 className="h2V2">Education History</h2>
            </Reveal>
            <Reveal delayMs={110}>
              <div className="eduRibbon" aria-label="Education highlights">
                <span className="eduRibbonLine" aria-hidden="true" />
                {EDU_DECOR_TAGS.map((item) => (
                  <span key={item} className="eduRibbonChip">
                    {item}
                  </span>
                ))}
                <span className="eduRibbonLine" aria-hidden="true" />
              </div>
            </Reveal>
          </div>

          <Reveal delayMs={90}>
            <EducationTimeline items={profile.education ?? []} />
          </Reveal>
        </div>
      </section>

      <Showcase
        projects={profile.projects}
        skills={profile.skills}
        yearsExperience={profile.yearsExperience}
      />

      <section id="contact" className="contactV2">
        <div className="container contactInner">
          <Reveal>
            <div className="contactLeft">
              <p className="contactHandNote">available for ideas, experiments, and useful little tools</p>
              <div className="contactOrbitRow" aria-hidden="true">
                <span className="contactOrbitDot" />
                <span className="contactOrbitDot" />
                <span className="contactOrbitDot" />
              </div>
              <p className="kickerV2">Contact</p>
              <h2 className="h2V2">Tell me what you want to build.</h2>
              <p className="muted">
                Kirim pesan lewat form di bawah dengan klik <b>Send Message</b>, atau
                langsung lewat Discord <b>{profile.discordHandle}</b>.
              </p>
            </div>
          </Reveal>

          <Reveal delayMs={90}>
            <ContactForm discordHandle={profile.discordHandle} />
          </Reveal>
        </div>
      </section>

      <section id="faq" className="faq">
        <div className="container">
          <Reveal>
            <div className="faqHeader">
              <h2 className="h2V2">FAQ</h2>
              <p className="muted">
                Beberapa pertanyaan yang sering ditanyain tentang role dan proyek.
              </p>
            </div>
          </Reveal>

          <div className="faqGrid">
            <Reveal delayMs={60}>
              <details className="faqItem">
                <summary className="faqQ">Apa itu Fullstack Developer?</summary>
                <div className="faqA muted">
                  Fullstack Developer adalah developer yang bisa menangani sisi{" "}
                  <b>Frontend</b> (UI/UX, tampilan web) dan <b>Backend</b> (server,
                  API, database). Biasanya nggak harus “jago semuanya”, tapi paham
                  alur end-to-end dari aplikasi.
                </div>
              </details>
            </Reveal>

            <Reveal delayMs={90}>
              <details className="faqItem">
                <summary className="faqQ">Apa bedanya Frontend dan Backend?</summary>
                <div className="faqA muted">
                  Frontend fokus di tampilan dan interaksi pengguna. Backend fokus
                  di logika aplikasi, autentikasi, penyimpanan data, dan API yang
                  dipakai frontend.
                </div>
              </details>
            </Reveal>

            <Reveal delayMs={120}>
              <details className="faqItem">
                <summary className="faqQ">Teknologi apa saja yang sering dipakai?</summary>
                <div className="faqA muted">
                  Paling sering: <b>React</b> + <b>Vite</b> / <b>Next.js</b> untuk frontend,{" "}
                  <b>Tailwind CSS</b> / CSS untuk styling, dan <b>Node.js</b> untuk kebutuhan backend
                  atau tooling. Untuk data biasanya <b>MongoDB</b> / SQL, dan kadang pakai <b>Three.js</b>{" "}
                  buat visual/interaktif.
                </div>
              </details>
            </Reveal>

            <Reveal delayMs={150}>
              <details className="faqItem">
                <summary className="faqQ">Apakah project-nya bisa dicoba (demo)?</summary>
                <div className="faqA muted">
                  Bisa. Masuk ke bagian <b>Projects</b>, lalu klik tombol <b>Open Web</b> / <b>Open App</b>{" "}
                  di kartu project. Contoh demo:{" "}
                  <code className="inlineCode">helloenglish.vercel.app</code>.
                </div>
              </details>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
