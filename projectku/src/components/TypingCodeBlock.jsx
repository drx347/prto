function formatDeveloperCode(profile) {
  const stack = profile.heroChips.map((chip) => `"${chip}"`).join(", ");

  return [
    "const developer = {",
    `  name: "${profile.name}",`,
    `  role: "${profile.role}",`,
    `  location: "${profile.location}",`,
    `  experience: "${profile.yearsExperience} years",`,
    `  stack: [${stack}],`,
    "};",
  ].join("\n");
}

export default function TypingCodeBlock({ profile }) {
  const code = formatDeveloperCode(profile);

  return (
    <pre className="typingCode" aria-label="Developer summary code">
      <code>{code}</code>
    </pre>
  );
}
