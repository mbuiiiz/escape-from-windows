import React from 'react';
import { useWindows, WindowState } from '@/contexts/WindowContext';
import { Window } from '@/components/xp/Window';
import { MyComputer } from '@/components/apps/MyComputer';
import { RecycleBin } from '@/components/apps/RecycleBin';
import { InternetExplorer } from '@/components/apps/InternetExplorer';
import { Notepad } from '@/components/apps/Notepad';
import { NotepadPlusPlus } from '@/components/apps/NotepadPlusPlus';
import { CommandPrompt } from '@/components/apps/CommandPrompt';
import { SystemRestore } from '@/components/apps/SystemRestore';
import { DateTimeSettings } from '@/components/apps/DateTimeSettings';
import { FileProperties } from '@/components/apps/FileProperties';
const componentMap: Record<string, React.ComponentType<{ windowId: string; props?: Record<string, unknown> }>> = {
  MyComputer,
  RecycleBin,
  InternetExplorer,
  Notepad,
  NotepadPlusPlus,
  CommandPrompt,
  SystemRestore,
  DateTimeSettings,
  FileProperties,
};
export function WindowManager() {
  const { windows, activeWindowId } = useWindows();
  return (
    <>
      {windows.map((win: WindowState) => {
        const Component = componentMap[win.component];
        if (!Component) return null;
        return (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            icon={win.icon}
            x={win.x}
            y={win.y}
            width={win.width}
            height={win.height}
            zIndex={win.zIndex}
            isMinimized={win.isMinimized}
            isMaximized={win.isMaximized}
            isActive={activeWindowId === win.id}
          >
            <Component windowId={win.id} props={win.props} />
          </Window>
        );
      })}
    </>
  );
}