import React, { useState } from 'react';
import { Copy } from 'lucide-react';

const CopyButton = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-2 p-1 rounded hover:bg-slate-200"
      title="Copy"
    >
      {copied ? (
        <span className="text-green-500 text-xs">✔️</span>
      ) : (
        <Copy className="w-4 h-4 text-slate-400" />
      )}
    </button>
  );
};

export default CopyButton;
