import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { useSystem } from '@/contexts/SystemContext';
import { useWindows } from '@/contexts/WindowContext';

interface UsbPasswordPromptProps {
  windowId: string;
  props?: Record<string, unknown>;
}

export function UsbPasswordPrompt({ windowId }: UsbPasswordPromptProps) {
  const { setUsbUnlocked } = useFileSystem();
  const { showPopup } = useSystem();
  const { closeWindow, openWindow } = useWindows();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [lockoutUntil, setLockoutUntil] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!lockoutUntil) return;
    const update = () => {
      const diff = new Date(lockoutUntil).getTime() - Date.now();
      setRemainingSeconds(Math.max(0, Math.ceil(diff / 1000)));
    };
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [lockoutUntil]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    const sessionId = localStorage.getItem('xpgame.sessionId');
    if (!sessionId) {
      showPopup({
        id: `usb-no-session-${Date.now()}`,
        type: 'error',
        title: 'No session',
        message: 'Start the game first so a session can be created.',
        buttons: [{ label: 'OK' }],
      });
      return;
    }

    setIsSubmitting(true);
    setInlineError(null);
    try {
      const res = await apiClient.request<{
        success: boolean;
        blocked: boolean;
        locked: boolean;
        attemptsLeft: number;
        lockoutUntil?: string;
        message?: string;
      }>('/api/usb/attempt', {
        method: 'POST',
        body: JSON.stringify({ sessionId, password }),
      });

      setAttemptsLeft(res.attemptsLeft);

      if (res.locked && res.lockoutUntil) {
        setLockoutUntil(res.lockoutUntil);
        showPopup({
          id: `usb-locked-${Date.now()}`,
          type: 'warning',
          title: 'Too many attempts',
          message: 'You are locked out for 2 minutes.',
          buttons: [{ label: 'OK' }],
        });
        return;
      }

      if (res.blocked) {
        showPopup({
          id: `usb-blocked-${Date.now()}`,
          type: 'error',
          title: 'USB locked',
          message: 'Password entry blocked. The only way left is to crack it.',
          buttons: [{ label: 'OK' }],
        });
        navigate('/ending2');
        return;
      }

      if (res.success) {
        setUsbUnlocked(true);
        showPopup({
          id: `usb-unlocked-${Date.now()}`,
          type: 'info',
          title: 'USB unlocked',
          message: 'Access granted.',
          buttons: [{ label: 'OK' }],
        });
        closeWindow(windowId);
        openWindow({
          id: `my-computer-usb-${Date.now()}`,
          title: 'My Computer',
          icon: '/xp-icons/my-computer.png',
          component: 'MyComputer',
          x: 120,
          y: 80,
          width: 700,
          height: 500,
          props: { path: '/my-computer/e' },
        });
        return;
      }

      setInlineError(res.message || 'Incorrect password.');
    } finally {
      setIsSubmitting(false);
      setPassword('');
    }
  };

  const disabled = isSubmitting || (lockoutUntil && remainingSeconds > 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-gray-300 text-xs">
        <span className="font-bold">USB Drive (E:)</span>
      </div>
      <div className="flex-1 p-4 text-sm">
        <p>Enter the USB password to access the drive.</p>
        <div className="mt-3">
          <input
            type="password"
            className="xp-input w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !disabled && password.length > 0) {
                handleSubmit();
              }
            }}
            placeholder="Password"
            disabled={disabled}
          />
        </div>
        <div className="mt-2 text-xs text-gray-600">
          {attemptsLeft !== null && <>Attempts left: {attemptsLeft}</>}
        </div>
        {lockoutUntil && remainingSeconds > 0 && (
          <div className="mt-2 text-xs text-red-600">
            Locked for {remainingSeconds}s
          </div>
        )}
        {inlineError && (
          <div className="mt-2 text-xs text-red-600">
            {inlineError}
          </div>
        )}
      </div>
      <div className="px-4 pb-4 flex justify-end gap-2">
        <button className="xp-button" onClick={() => closeWindow(windowId)}>
          Cancel
        </button>
        <button className="xp-button" onClick={handleSubmit} disabled={disabled || password.length === 0}>
          Submit
        </button>
      </div>
    </div>
  );
}
