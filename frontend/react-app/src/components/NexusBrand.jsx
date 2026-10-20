import React from 'react';

// The same wordmark geometry used by K-NEXUS App.
export default function NexusBrand() {
  return <span className="nexus-wordmark" role="img" aria-label="K NEXUS">
    <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 8v32M12 25 29 8M12 25l17 15" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="square" /><path d="m28 19 10-9v28L28 28" fill="none" stroke="#8bd885" strokeWidth="4" strokeLinejoin="round" /></svg>
    <span>NEXUS</span>
  </span>;
}
