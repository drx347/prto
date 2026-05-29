import { useEffect, useMemo, useState } from "react";

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
  const code = useMemo(() => formatDeveloperCode(profile), [profile]);
  const [visibleLength, setVisibleLength] = useState(0);

  useEffect(() => {
    setVisibleLength(0);
    const typeDelay = 24;
    const holdDelay = 1900;
    const clearDelay = 520;
    let timeoutId = 0;

    function scheduleNext(length) {
      if (length < code.length) {
        timeoutId = window.setTimeout(() => {
          const nextLength = length + 1;
          setVisibleLength(nextLength);
          scheduleNext(nextLength);
        }, code[length] === "\n" ? typeDelay * 5 : typeDelay);
        return;
      }

      timeoutId = window.setTimeout(() => {
        setVisibleLength(0);
        timeoutId = window.setTimeout(() => scheduleNext(0), clearDelay);
      }, holdDelay);
    }

    scheduleNext(0);
    return () => window.clearTimeout(timeoutId);
  }, [code]);

  const visibleCode = code.slice(0, visibleLength);

  return (
    <pre className="typingCode" aria-label="Developer summary code">
      <code className="typingCodeGhost" aria-hidden="true">
        {code}
      </code>
      <code className="typingCodeVisible">
        {visibleCode}
        <span className="typingCursor" aria-hidden="true" />
      </code>
    </pre>
  );
}
