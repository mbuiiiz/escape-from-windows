import React from 'react';

export function EscapeFromWindowsLanding({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white">
      <div className="text-center px-8">
        <h1 className="text-4xl font-bold tracking-tight text-blue-900">Escape From Windows</h1>
        <p className="text-sm text-gray-700 mt-3">
          Click Start to begin. Your instructions will be saved on the Desktop.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <button className="xp-button" onClick={onStart}>
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
