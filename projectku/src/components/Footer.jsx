import { profile } from "../content/profile";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footerV2">
      <div className="container footerV2Inner">
        <p className="footerText">
          © {year} {profile.name}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
