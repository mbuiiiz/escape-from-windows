import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { useWindows } from '@/contexts/WindowContext';
import { Minus, Square, X } from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  icon: string;
  children: ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isActive: boolean;
  resizable?: boolean;
}

export function Window({
  id,
  title,
  icon,
  children,
  x,
  y,
  width,
  height,
  zIndex,
  isMinimized,
  isMaximized,
  isActive,
  resizable = true,
}: WindowProps) {
  const { closeWindow, minimizeWindow, maximizeWindow, restoreWindow, focusWindow, updateWindowPosition, updateWindowSize } = useWindows();
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.xp-titlebar-button')) return;
    focusWindow(id);
    if (!isMaximized) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - x,
        y: e.clientY - y,
      });
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMaximized) return;
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width,
      height,
    });
    focusWindow(id);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - 100));
        const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - 100));
        updateWindowPosition(id, newX, newY);
      }
      if (isResizing) {
        const newWidth = Math.max(200, resizeStart.width + (e.clientX - resizeStart.x));
        const newHeight = Math.max(150, resizeStart.height + (e.clientY - resizeStart.y));
        updateWindowSize(id, newWidth, newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, id, updateWindowPosition, updateWindowSize]);

  if (isMinimized) return null;

  const windowStyle: React.CSSProperties = isMaximized
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: 'calc(100% - 30px)',
        zIndex,
      }
    : {
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        zIndex,
      };

  return (
    <div
      ref={windowRef}
      className="xp-window xp-window-opening flex flex-col"
      style={windowStyle}
      onClick={() => focusWindow(id)}
    >
      {/* Title Bar */}
      <div
        className={`xp-titlebar ${isActive ? '' : 'inactive'}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => isMaximized ? restoreWindow(id) : maximizeWindow(id)}
      >
        <img src={icon} alt="" className="xp-titlebar-icon" />
        <span className="xp-titlebar-text">{title}</span>
        <div className="xp-titlebar-buttons">
          <button
            className="xp-titlebar-button"
            onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
          >
            <Minus size={12} color="white" />
          </button>
          <button
            className="xp-titlebar-button"
            onClick={(e) => { e.stopPropagation(); isMaximized ? restoreWindow(id) : maximizeWindow(id); }}
          >
            <Square size={10} color="white" />
          </button>
          <button
            className="xp-titlebar-button close"
            onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
          >
            <X size={12} color="white" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[hsl(210_20%_93%)]">
        {children}
      </div>

      {/* Resize Handle */}
      {resizable && !isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
          style={{
            background: 'linear-gradient(135deg, transparent 50%, hsl(210 40% 70%) 50%)',
          }}
        />
      )}
    </div>
  );
}
