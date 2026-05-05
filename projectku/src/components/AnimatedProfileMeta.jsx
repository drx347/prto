export default function AnimatedProfileMeta({ text }) {
  return (
    <span className="aboutHeaderMetaShine" role="text">
      <span className="aboutHeaderMetaSrOnly">{text}</span>

      <span className="aboutHeaderMetaVisual" aria-hidden="true">
        {Array.from(text).map((char, index) => (
          <span
            key={`${char}-${index}`}
            className={`aboutHeaderMetaChar${char === " " ? " aboutHeaderMetaChar--space" : ""}`}
            style={{ "--char-index": `${index}` }}
          >
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}
