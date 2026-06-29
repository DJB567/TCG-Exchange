/**
 * Letter-split wordmark. Each glyph rises and settles with a stagger when the
 * hero first paints. Letters are grouped by word so a word never breaks
 * mid-way — wrapping only happens between words.
 */
export function AnimatedWordmark({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(" ");
  let g = 0; // running glyph index for a continuous stagger across words

  return (
    <span className={className} aria-label={text} role="text">
      {words.map((word, wi) => (
        <span key={wi}>
          <span className="inline-block whitespace-nowrap">
            {word.split("").map((ch, ci) => {
              const delay = g++ * 45;
              return (
                <span
                  key={ci}
                  aria-hidden
                  className="letter"
                  style={{ animationDelay: `${delay}ms` }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
          {/* breakable gap between words */}
          {wi < words.length - 1 ? <span aria-hidden> </span> : null}
        </span>
      ))}
    </span>
  );
}
