import { useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";
import TechStackIcon from "./TechStackIcon";

const GALLERY_SOURCES = import.meta.glob("/gallery/**/*.{png,jpg,jpeg,webp,avif,gif}", {
  eager: true,
  import: "default",
});

function filenameFromPath(p) {
  return String(p).split("/").pop() ?? "";
}

function labelFromFilename(name) {
  return name
    .replace(/\.(png|jpe?g|webp|avif|gif)$/i, "")
    .replace(/[_-]+/g, " ")
    .trim();
}

function getGalleryFromFolder() {
  return Object.entries(GALLERY_SOURCES)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, src]) => {
      const file = filenameFromPath(path);
      const label = labelFromFilename(file) || "Gallery image";
      return { key: path, src, alt: label };
    });
}

function Icon({ name }) {
  if (name === "code") {
    return (
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
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <path
        d="M2 12h20M12 2a16 16 0 0 1 0 20M12 2a16 16 0 0 0 0 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TabIcon({ name }) {
  if (name === "projects") return <Icon name="code" />;
  if (name === "gallery") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <path
          d="m6.5 16 3.2-3.3 2.6 2.5 3.4-3.6L19 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="9" r="1.6" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 7h10M7 12h10M7 17h10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StatCard({ stat, delayMs }) {
  return (
    <Reveal delayMs={delayMs}>
      <div className="statCard">
        <div className="statIcon" aria-hidden="true">
          <Icon name={stat.icon} />
        </div>
        <div className="statMain">
          <p className="statLabel">{stat.label}</p>
          <p className="statHelper">{stat.helper}</p>
        </div>
        <div className="statValue">{stat.value}</div>
      </div>
    </Reveal>
  );
}

function techLabelKey(label) {
  return label.trim().toLowerCase().replace(/\s+/g, " ");
}

function TechIcon({ label }) {
  const key = techLabelKey(label);

  if (key.includes("react")) {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="6">
          <ellipse cx="60" cy="60" rx="44" ry="18" />
          <ellipse
            cx="60"
            cy="60"
            rx="44"
            ry="18"
            transform="rotate(60 60 60)"
          />
          <ellipse
            cx="60"
            cy="60"
            rx="44"
            ry="18"
            transform="rotate(120 60 60)"
          />
        </g>
        <circle cx="60" cy="60" r="8" fill="currentColor" />
      </svg>
    );
  }

  if (key.includes("tailwind")) {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path
          d="M35 58c5-14 13-21 24-21 18 0 22 18 30 18 6 0 10-3 14-10-5 14-13 21-24 21-18 0-22-18-30-18-6 0-10 3-14 10Zm0 26c5-14 13-21 24-21 18 0 22 18 30 18 6 0 10-3 14-10-5 14-13 21-24 21-18 0-22-18-30-18-6 0-10 3-14 10Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (key.includes("node")) {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path
          d="M60 10 18 34v52l42 24 42-24V34L60 10Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <path
          d="M45 70V50c0-2 2-4 4-3l22 13c2 1 4 0 4-2V45"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (key.includes("vite")) {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path
          d="M60 10 90 28 72 110 60 96 48 110 30 28 60 10Z"
          fill="currentColor"
        />
        <path
          d="M60 24 76 34 66 80 60 74 54 80 44 34 60 24Z"
          fill="rgba(0,0,0,0.35)"
        />
      </svg>
    );
  }

  if (key.includes("typescript") || key === "ts") {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <rect x="16" y="16" width="88" height="88" rx="18" fill="currentColor" />
        {/* T */}
        <path
          d="M34 44h52v12H66v48H54V56H34V44Z"
          fill="rgba(0,0,0,0.84)"
        />
        {/* S */}
        <path
          d="M74 86c1 7 7 12 16 12 11 0 17-6 17-13 0-6-3-10-12-12-6-2-8-3-8-5 0-2 2-4 5-4 4 0 6 2 7 5l10-3c-2-7-8-11-17-11-10 0-16 6-16 13 0 6 3 10 12 12 6 2 8 3 8 5 0 3-3 4-6 4-5 0-8-2-9-6l-9 3Z"
          fill="rgba(0,0,0,0.84)"
        />
      </svg>
    );
  }

  if (key.includes("vercel")) {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M60 22 104 98H16L60 22Z" fill="currentColor" />
      </svg>
    );
  }

  if (key === "lua" || key.includes(" lua")) {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="40" fill="currentColor" opacity="0.28" />
        <circle cx="72" cy="48" r="28" fill="rgba(0,0,0,0.22)" />
        <circle cx="84" cy="40" r="6" fill="currentColor" />
        <path
          d="M40 84h40"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.9"
        />
      </svg>
    );
  }

  if (key.includes("next")) {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="44" fill="currentColor" />
        <path
          d="M42 78V42h10l16 22V42h10v36H68L52 56v22H42Z"
          fill="rgba(0,0,0,0.82)"
        />
      </svg>
    );
  }

  if (key.includes("three")) {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path
          d="M60 18 24 40v40l36 22 36-22V40L60 18Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <path
          d="M24 40l36 22 36-22M60 62v40"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (key.includes("mongo")) {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path
          d="M60 16c10 14 18 28 18 44 0 20-9 34-18 44-9-10-18-24-18-44 0-16 8-30 18-44Z"
          fill="currentColor"
        />
        <path
          d="M60 26v76"
          stroke="rgba(0,0,0,0.35)"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (key.includes("prisma")) {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M30 88 62 16l28 64-30 24Z" fill="currentColor" />
        <path d="M30 88l32 16 28-24-30 8-30 0Z" fill="rgba(0,0,0,0.35)" />
      </svg>
    );
  }

  if (key.includes("gsap")) {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <rect x="18" y="18" width="84" height="84" rx="22" fill="currentColor" />
        <path
          d="M70 46c-2-6-7-10-15-10-12 0-20 9-20 24 0 16 8 24 21 24 7 0 13-3 17-9l-9-5c-2 3-4 4-8 4-6 0-10-4-10-14 0-9 4-14 10-14 3 0 6 1 7 4l9-4Z"
          fill="rgba(0,0,0,0.78)"
        />
      </svg>
    );
  }

  if (key.includes("framer")) {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path
          d="M30 24h60v18H48v18h42v18H48v18h42v18H30V24Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <rect x="18" y="18" width="84" height="84" rx="22" fill="currentColor" />
      <path
        d="M42 70c0-14 10-24 24-24s24 10 24 24-10 24-24 24-24-10-24-24Z"
        fill="rgba(0,0,0,0.22)"
      />
    </svg>
  );
}

function TechCard({ skill, delayMs }) {
  const label = typeof skill === "string" ? skill : skill?.label;
  const iconKey =
    typeof skill === "string" ? null : skill?.iconKey ?? skill?.icon ?? skill?.key;

  return (
    <Reveal delayMs={delayMs}>
      <div className="techCard" data-magnetic>
        <div className="techIcon" aria-hidden="true">
          <TechStackIcon label={label} iconKey={iconKey}>
            <TechIcon label={label} />
          </TechStackIcon>
        </div>
        <div className="techName">{label}</div>
      </div>
    </Reveal>
  );
}

export default function Showcase({
  projects,
  skills,
  yearsExperience,
}) {
  const [tab, setTab] = useState("projects");
  const galleryItems = useMemo(() => {
    const fromFolder = getGalleryFromFolder();
    if (fromFolder.length) return fromFolder;

    return projects
      .filter((project) => project.thumbnail)
      .map((project) => ({
        key: project.title,
        src: project.thumbnail,
        alt: `${project.title} preview`,
      }));
  }, [projects]);

  const stats = useMemo(() => {
    return [
      {
        label: "TOTAL PROJECTS",
        value: projects.length,
        helper: "Innovative web solutions crafted",
        icon: "code",
      },
      {
        label: "YEARS OF EXPERIENCE",
        value: yearsExperience,
        helper: "Continuous learning journey",
        icon: "globe",
      },
    ];
  }, [projects.length, yearsExperience]);

  return (
    <section id="portfolio" className="showcase">
      <div className="showcaseBackdrop" aria-hidden="true">
        <span className="showcaseGlow showcaseGlow--a" />
        <span className="showcaseGlow showcaseGlow--b" />
        <span className="showcaseGrid" />
      </div>

      <div className="container">
        <div className="statsRow">
          {stats.map((s, idx) => (
            <StatCard key={s.label} stat={s} delayMs={idx * 80} />
          ))}
        </div>

        <div className="showcaseCenter">
          <Reveal>
            <h2 className="showcaseTitle">
              Portfolio <span className="accentText">Showcase</span>
            </h2>
          </Reveal>
          <Reveal delayMs={80}>
            <p className="showcaseDesc">
              Explore my journey through projects and technical expertise. Each section represents a milestone in my continuous learning path.
            </p>
          </Reveal>
        </div>

        <Reveal delayMs={120}>
          <div className="segmented" role="tablist" aria-label="Portfolio tabs">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "projects"}
              className={["segBtn", tab === "projects" ? "isActive" : ""].join(
                " "
              )}
              onClick={() => setTab("projects")}
            >
              <span className="segIcon" aria-hidden="true">
                <TabIcon name="projects" />
              </span>
              Projects
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "gallery"}
              className={["segBtn", tab === "gallery" ? "isActive" : ""].join(
                " "
              )}
              onClick={() => setTab("gallery")}
            >
              <span className="segIcon" aria-hidden="true">
                <TabIcon name="gallery" />
              </span>
              Gallery
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "stack"}
              className={["segBtn", tab === "stack" ? "isActive" : ""].join(" ")}
              onClick={() => setTab("stack")}
            >
              <span className="segIcon" aria-hidden="true">
                <TabIcon name="stack" />
              </span>
              Tech Stack
            </button>
          </div>
        </Reveal>

        <div className="showcaseBody" role="tabpanel">
          {tab === "projects" ? (
            <div className="cardGrid">
              {projects.map((p, idx) => (
                <Reveal key={p.title} delayMs={idx * 70}>
                  <ProjectCard project={p} index={idx} />
                </Reveal>
              ))}
            </div>
          ) : null}

          {tab === "stack" ? (
            <div className="techGrid" aria-label="Tech stack">
              {skills.map((skill, idx) => (
                <TechCard
                  key={typeof skill === "string" ? skill : skill?.label ?? idx}
                  skill={skill}
                  delayMs={idx * 35}
                />
              ))}
            </div>
          ) : null}

          {tab === "gallery" ? (
            <div className="galleryGrid" aria-label="Gallery">
              {galleryItems.map((item, idx) => (
                <Reveal key={item.key ?? item.src ?? idx} delayMs={idx * 60}>
                  <article className="galleryItem">
                    <div className="galleryThumb">
                      <img
                        className="galleryImg"
                        src={item.src}
                        alt={item.alt ?? "Gallery image"}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
