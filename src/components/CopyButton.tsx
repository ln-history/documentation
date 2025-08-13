import { useState } from 'react';
import '/src/styles/global.css';

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const CopyIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <title>Copy icon</title>
      <path
        fill="currentColor"
        d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm0-2h9V4H9zm-4 6q-.825 0-1.412-.587T3 20V6h2v14h11v2zm4-6V4z"
      />
    </svg>
  );

  return (
    <button
      className={`copy-button ${copied ? 'copy-button--copied' : ''}`}
      onClick={handleCopy}
      type="button"
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      <CopyIcon />
    </button>
  );
};

export { CopyButton as default };
