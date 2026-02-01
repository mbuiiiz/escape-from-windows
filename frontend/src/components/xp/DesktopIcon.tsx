import React from 'react';
interface DesktopIconProps {
  name: string;
  icon: string;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
}
export function DesktopIcon({ name, icon, isSelected, onClick, onDoubleClick }: DesktopIconProps) {
  return (
    <div
      className={`xp-desktop-icon ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <img src={icon} alt={name} draggable={false} />
      <span className="xp-desktop-icon-text">{name}</span>
    </div>
  );
}