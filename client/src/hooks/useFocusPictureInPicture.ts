import { useCallback, useEffect, useRef, useState } from 'react';

interface PiPData {
  taskName: string;
  elapsed: string;
  earned: number;
  isPaused: boolean;
}

interface PiPCallbacks {
  onTogglePause: () => void;
  onEnd: () => void;
  onRestoreBar: () => void;
}

interface PiPTheme {
  bg: string;
  bgSecondary: string;
  text: string;
  textSecondary: string;
  lime: string;
  limeFg: string;
  orange: string;
  border: string;
  glowLime: string;
  glowOrange: string;
}

declare global {
  interface Window {
    documentPictureInPicture?: {
      requestWindow: (options?: { width?: number; height?: number }) => Promise<Window>;
      window: Window | null;
    };
  }
}

function readPiPTheme(): PiPTheme {
  const root = document.documentElement;
  const s = getComputedStyle(root);
  const pick = (name: string, fallback: string) => s.getPropertyValue(name).trim() || fallback;

  return {
    bg: pick('--bg-card', 'rgba(12, 12, 12, 0.92)'),
    bgSecondary: pick('--bg-secondary', '#0a0a0a'),
    text: pick('--text-primary', '#ffffff'),
    textSecondary: pick('--text-secondary', '#9a9a9a'),
    lime: pick('--accent-lime', '#c8ff00'),
    limeFg: pick('--accent-lime-fg', '#050505'),
    orange: pick('--accent-orange', '#ff6b4a'),
    border: pick('--border', 'rgba(255, 255, 255, 0.12)'),
    glowLime: pick('--glow-lime', 'rgba(200, 255, 0, 0.12)'),
    glowOrange: pick('--glow-orange', 'rgba(255, 107, 74, 0.15)'),
  };
}

function buildPiPStyles(theme: PiPTheme) {
  return `
  * { box-sizing: border-box; margin: 0; }
  html, body {
    height: 100%;
    overflow: hidden;
  }
  body {
    font-family: Inter, system-ui, sans-serif;
    background: ${theme.bgSecondary};
    color: ${theme.text};
    padding: 0;
  }
  .shell {
    min-height: 100%;
    padding: 14px 16px 12px;
    background:
      radial-gradient(ellipse 120% 80% at 50% -20%, ${theme.glowLime}, transparent 55%),
      radial-gradient(ellipse 80% 60% at 100% 100%, ${theme.glowOrange}, transparent 50%),
      ${theme.bg};
    border: 1px solid ${theme.border};
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .shell.is-paused {
    background:
      radial-gradient(ellipse 100% 70% at 50% -10%, ${theme.glowOrange}, transparent 55%),
      ${theme.bg};
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .status {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
  }
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${theme.lime};
    box-shadow: 0 0 10px ${theme.glowLime};
    flex-shrink: 0;
    animation: pulse 2.4s ease-in-out infinite;
  }
  .shell.is-paused .dot {
    background: ${theme.orange};
    box-shadow: 0 0 8px ${theme.glowOrange};
    animation: none;
    opacity: 0.85;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.55; transform: scale(0.88); }
  }
  .label {
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${theme.lime};
    white-space: nowrap;
  }
  .shell.is-paused .label { color: ${theme.orange}; }
  .coins {
    display: inline-flex;
    align-items: baseline;
    gap: 3px;
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 11px;
    font-weight: 600;
    color: ${theme.orange};
    white-space: nowrap;
  }
  .coins small {
    font-size: 8px;
    letter-spacing: 0.12em;
    opacity: 0.7;
    font-weight: 500;
  }
  .task {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: -0.01em;
    color: ${theme.textSecondary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: -2px;
  }
  .timer {
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 32px;
    font-weight: 600;
    letter-spacing: -0.04em;
    line-height: 1;
    color: ${theme.text};
    font-variant-numeric: tabular-nums;
  }
  .btns {
    display: grid;
    grid-template-columns: 1fr 1.15fr 1fr;
    gap: 6px;
    margin-top: auto;
    padding-top: 2px;
  }
  button {
    border: 1px solid ${theme.border};
    background: rgba(255, 255, 255, 0.04);
    color: ${theme.textSecondary};
    border-radius: 8px;
    padding: 7px 4px;
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }
  button:hover {
    background: rgba(255, 255, 255, 0.08);
    color: ${theme.text};
    border-color: rgba(255, 255, 255, 0.2);
  }
  button.primary {
    background: ${theme.lime};
    color: ${theme.limeFg};
    border-color: transparent;
    box-shadow: 0 0 20px ${theme.glowLime};
  }
  button.primary:hover {
    filter: brightness(1.06);
    color: ${theme.limeFg};
  }
  button.danger:hover {
    border-color: ${theme.orange};
    color: ${theme.orange};
  }
`;
}

function buildPiPHtml(data: PiPData) {
  const pausedClass = data.isPaused ? ' is-paused' : '';
  return `
    <div class="shell${pausedClass}" id="pip-shell">
      <div class="top">
        <div class="status">
          <span class="dot" aria-hidden="true"></span>
          <span class="label">${data.isPaused ? 'PAUSED' : 'FOCUSING · PINNED'}</span>
        </div>
        <span class="coins" id="pip-coins">+${data.earned} <small>COINS</small></span>
      </div>
      <div class="task" id="pip-task">${data.taskName}</div>
      <div class="timer" id="pip-timer">${data.elapsed}</div>
      <div class="btns">
        <button type="button" id="pip-pause">${data.isPaused ? 'RESUME' : 'PAUSE'}</button>
        <button type="button" id="pip-restore" class="primary">SHOW BAR</button>
        <button type="button" id="pip-end" class="danger">END</button>
      </div>
    </div>
  `;
}

const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600;700&display=swap';

export function useFocusPictureInPicture(callbacks: PiPCallbacks) {
  const pipWindowRef = useRef<Window | null>(null);
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [supported, setSupported] = useState(false);
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'documentPictureInPicture' in window);
  }, []);

  const wireButtons = useCallback((win: Window) => {
    win.document.getElementById('pip-pause')?.addEventListener('click', () => {
      callbacksRef.current.onTogglePause();
    });
    win.document.getElementById('pip-restore')?.addEventListener('click', () => {
      callbacksRef.current.onRestoreBar();
    });
    win.document.getElementById('pip-end')?.addEventListener('click', () => {
      callbacksRef.current.onEnd();
    });
  }, []);

  const openPiP = useCallback(
    async (data: PiPData) => {
      if (!window.documentPictureInPicture) return false;
      try {
        if (pipWindowRef.current && !pipWindowRef.current.closed) {
          pipWindowRef.current.close();
        }

        const theme = readPiPTheme();
        const pipWindow = await window.documentPictureInPicture.requestWindow({
          width: 360,
          height: 168,
        });
        pipWindowRef.current = pipWindow;
        setIsPiPActive(true);

        pipWindow.document.head.innerHTML = `
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="${FONT_LINK}" rel="stylesheet" />
          <style>${buildPiPStyles(theme)}</style>
        `;
        pipWindow.document.body.innerHTML = buildPiPHtml(data);
        wireButtons(pipWindow);

        pipWindow.addEventListener('pagehide', () => {
          setIsPiPActive(false);
          pipWindowRef.current = null;
        });

        return true;
      } catch {
        return false;
      }
    },
    [wireButtons]
  );

  const updatePiP = useCallback((data: PiPData) => {
    const win = pipWindowRef.current;
    if (!win || win.closed) {
      setIsPiPActive(false);
      return;
    }
    const timer = win.document.getElementById('pip-timer');
    const coins = win.document.getElementById('pip-coins');
    const task = win.document.getElementById('pip-task');
    const pause = win.document.getElementById('pip-pause');
    const label = win.document.querySelector('.label');
    const shell = win.document.getElementById('pip-shell');
    if (timer) timer.textContent = data.elapsed;
    if (coins) coins.innerHTML = `+${data.earned} <small>COINS</small>`;
    if (task) task.textContent = data.taskName;
    if (pause) pause.textContent = data.isPaused ? 'RESUME' : 'PAUSE';
    if (label) label.textContent = data.isPaused ? 'PAUSED' : 'FOCUSING · PINNED';
    if (shell) shell.classList.toggle('is-paused', data.isPaused);
  }, []);

  const closePiP = useCallback(() => {
    if (pipWindowRef.current && !pipWindowRef.current.closed) {
      pipWindowRef.current.close();
    }
    pipWindowRef.current = null;
    setIsPiPActive(false);
  }, []);

  useEffect(() => () => closePiP(), [closePiP]);

  return { supported, isPiPActive, openPiP, updatePiP, closePiP };
}
