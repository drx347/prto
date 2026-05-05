import Showcase from "../components/Showcase";
import { profile } from "../content/profile";

export default function Portfolio() {
  return (
    <main>
      <Showcase
        projects={profile.projects}
        skills={profile.skills}
        yearsExperience={profile.yearsExperience}
      />
    </main>
  );
}
