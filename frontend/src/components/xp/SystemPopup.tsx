import React from 'react';
import { useSystem, PopupConfig } from '@/contexts/SystemContext';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
export function SystemPopup() {
  const { popups, closePopup } = useSystem();
  if (popups.length === 0) return null;
  const popup = popups[0];
  const getIcon = (type: PopupConfig['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle size={32} className="text-red-600" />;
      case 'warning':
        return <AlertTriangle size={32} className="text-yellow-600" />;
      case 'info':
        return <Info size={32} className="text-blue-600" />;
    }
  };
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/30">
      <div className="xp-window w-[400px]">
        {/* Title Bar */}
        <div className="xp-titlebar">
          <span className="xp-titlebar-text">{popup.title}</span>
        </div>
        {/* Content */}
        <div className="xp-dialog-content">
          <div className="xp-error-dialog">
            <div className="xp-error-icon">
              {getIcon(popup.type)}
            </div>
            <p className="xp-error-message">{popup.message}</p>
          </div>
        </div>
        {/* Buttons */}
        <div className="xp-dialog-buttons">
          {(popup.buttons || [{ label: 'OK' }]).map((btn, i) => (
            <button
              key={i}
              className="xp-button"
              onClick={() => {
                btn.onClick?.();
                closePopup(popup.id);
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}