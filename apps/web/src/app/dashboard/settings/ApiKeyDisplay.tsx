"use client";

import { useState } from "react";

export default function ApiKeyDisplay({ apiKey }: { apiKey: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="mt-4 p-6 rounded-lg border border-pulse-border bg-pulse-surface">
      <h3 className="text-lg font-medium text-white mb-2">Your API Key</h3>
      <p className="text-pulse-muted text-sm mb-4">
        Use this key in your VS Code extension settings to authenticate your heartbeats. 
        <br />
        <span className="text-yellow-400 font-semibold">Keep this secret!</span>
      </p>

      <div className="flex items-center gap-3">
        <code className="flex-1 bg-pulse-bg border border-pulse-border rounded-md px-4 py-3 text-pulse-green font-mono text-sm overflow-x-auto">
          {apiKey || "No API Key found"}
        </code>
        <button
          onClick={handleCopy}
          disabled={!apiKey}
          className="bg-pulse-green/10 hover:bg-pulse-green/20 text-pulse-green border border-pulse-green/30 px-4 py-3 rounded-md font-medium transition-all focus:ring-2 focus:ring-pulse-green focus:outline-none flex-shrink-0 disabled:opacity-50"
        >
          {copied ? "Copied!" : "Copy Key"}
        </button>
      </div>

      <div className="mt-6">
        <button className="text-red-400 hover:text-red-300 text-sm font-medium underline underline-offset-4 decoration-red-400/30 hover:decoration-red-300">
          Revoke & Generate New Key
        </button>
      </div>
    </div>
  );
}
