import React, { useEffect, useRef } from 'react';
interface MenuItem {
  label?: string;
  type?: 'separator';
  disabled?: boolean;
  onClick?: () => void;
  submenu?: MenuItem[];
}
interface ContextMenuProps {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}
export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  // Adjust position if menu would go off screen
  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - 250);
  return (
    <div
      ref={menuRef}
      className="xp-context-menu"
      style={{ left: adjustedX, top: adjustedY }}
    >
      {items.map((item, index) => {
        if (item.type === 'separator') {
          return <div key={index} className="xp-context-menu-separator" />;
        }
        return (
          <div
            key={index}
            className={`xp-context-menu-item ${item.disabled ? 'disabled' : ''}`}
            onClick={() => {
              if (!item.disabled) {
                item.onClick?.();
                onClose();
              }
            }}
          >
            {item.label}
            {item.submenu && <span className="absolute right-2">▶</span>}
          </div>
        );
      })}
    </div>
  );
}
