import { useCallback, useRef } from "react";

export default function ProjectCard({ project }) {
  const rafIdRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });

  const applyTilt = useCallback((el) => {
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (pointerRef.current.x - rect.left) / rect.width;
    const y = (pointerRef.current.y - rect.top) / rect.height;
    const clampedX = Math.min(1, Math.max(0, x));
    const clampedY = Math.min(1, Math.max(0, y));

    const px = clampedX - 0.5;
    const py = clampedY - 0.5;

    const rotX = (-py * 10).toFixed(2);
    const rotY = (px * 12).toFixed(2);

    el.style.setProperty("--rx", `${rotX}deg`);
    el.style.setProperty("--ry", `${rotY}deg`);
    el.style.setProperty("--mx", `${(clampedX * 100).toFixed(2)}%`);
    el.style.setProperty("--my", `${(clampedY * 100).toFixed(2)}%`);
  }, []);

  const scheduleTilt = useCallback(
    (el) => {
      if (rafIdRef.current) return;
      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = 0;
        applyTilt(el);
      });
    },
    [applyTilt]
  );

  const onPointerMove = useCallback((e) => {
    const el = e.currentTarget;
    pointerRef.current.x = e.clientX;
    pointerRef.current.y = e.clientY;
    scheduleTilt(el);
  }, [scheduleTilt]);

  const onPointerLeave = useCallback((e) => {
    const el = e.currentTarget;
    if (rafIdRef.current) window.cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = 0;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  }, []);

  const onPointerEnter = useCallback((e) => {
    const el = e.currentTarget;
    pointerRef.current.x = e.clientX;
    pointerRef.current.y = e.clientY;
    scheduleTilt(el);
  }, [scheduleTilt]);

  return (
    <article
      className="card"
      data-magnetic
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {project.thumbnail ? (
        <div className="cardThumb" aria-label={`${project.title} thumbnail`}>
          <img
            className="cardThumbImg"
            src={project.thumbnail}
            alt={`${project.title} preview`}
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}
      <div className="cardBody">
        <h3 className="h3">{project.title}</h3>
        <p className="muted">{project.description}</p>
        {project.showcase?.length ? (
          <ul className="cardShowcase" aria-label="Showcase">
            {project.showcase.slice(0, 3).map((item) => (
              <li key={item} className="cardShowcaseItem muted">
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="tagRow" aria-label="Teknologi">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
      {project.links && project.links.length ? (
        <div className="cardFooter">
          {project.links.map((link, index) => (
            <a
              key={link.href}
              className={["pillLink", index === 0 ? "pillLinkPrimary" : ""].join(
                " "
              )}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${link.label} (buka tab baru)`}
            >
              {link.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
