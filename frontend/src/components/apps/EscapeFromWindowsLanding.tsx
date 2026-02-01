import React from 'react';

export function EscapeFromWindowsLanding({
  onStart,
  onContinue,
  onNewGame,
  hasGame,
  isStarting,
}: {
  onStart: () => void;
  onContinue: () => void;
  onNewGame: () => void;
  hasGame: boolean;
  isStarting?: boolean;
}) {
  const label = hasGame ? 'Continue' : 'Start';
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white">
      <div className="text-center px-8">
        <h1 className="text-4xl font-bold tracking-tight text-blue-900">Escape From Windows</h1>
        <p className="text-sm text-gray-700 mt-3">
          {hasGame
            ? 'A saved session was found. Continue your game.'
            : 'Click Start to begin. Your instructions will be saved on the Desktop.'}
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <button
            className="xp-button"
            onClick={hasGame ? onContinue : onStart}
            disabled={isStarting}
          >
            {isStarting ? 'Starting...' : label}
          </button>
          {hasGame && (
            <button
              className="xp-button"
              onClick={onNewGame}
              disabled={isStarting}
            >
              New Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
