/**
 * Truncated SHA-256 state hash with hover title and click-to-copy of the full digest.
 * @param {{ hash?: string | null, className?: string }} props
 */
export default function CopyableStateHash({ hash, className = '' }) {
  const fullHash = typeof hash === 'string' ? hash.trim() : '';

  if (!fullHash) {
    return <span className={className || undefined}>—</span>;
  }

  const truncated =
    fullHash.length > 16
      ? `${fullHash.slice(0, 8)}...${fullHash.slice(-8)}`
      : fullHash;

  const copyFullHash = (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      return;
    }

    void navigator.clipboard.writeText(fullHash).catch(() => {
      /* clipboard unavailable */
    });
  };

  return (
    <span
      role="button"
      tabIndex={0}
      className={`font-mono text-xs text-teal-400 cursor-pointer hover:text-teal-300 transition-colors ${className}`.trim()}
      title={fullHash}
      aria-label={`Copy state hash ${fullHash}`}
      onClick={copyFullHash}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          copyFullHash(event);
        }
      }}
    >
      {truncated}
    </span>
  );
}
