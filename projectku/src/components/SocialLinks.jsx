import { profile } from "../content/profile";
import { GithubIcon, LinkedinIcon, MailIcon } from "./Icons";

function iconFor(label) {
  const lower = label.toLowerCase();
  if (lower.includes("github")) return GithubIcon;
  if (lower.includes("linkedin")) return LinkedinIcon;
  if (lower.includes("email") || lower.includes("mail")) return MailIcon;
  return null;
}

export default function SocialLinks() {
  return (
    <div className="iconRow" aria-label="Sosial">
      {profile.socials.map((s) => {
        const Icon = iconFor(s.label);
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
  );
}
