import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface MotionContextValue {
  celebrate: () => void;
  isFocusMode: boolean;
  setFocusMode: (focus: boolean) => void;
}

const MotionContext = createContext<MotionContextValue | null>(null);

export function MotionProvider({ children }: { children: ReactNode }) {
  const [isFocusMode, setFocusMode] = useState(false);

  const celebrate = useCallback(() => {
    /* visual celebrate handled by CoinRewardAnimation */
  }, []);

  return (
    <MotionContext.Provider value={{ celebrate, isFocusMode, setFocusMode }}>
      {children}
    </MotionContext.Provider>
  );
}

export function useMotion() {
  const ctx = useContext(MotionContext);
  if (!ctx) throw new Error('useMotion must be used within MotionProvider');
  return ctx;
}

export function useMotionOptional() {
  return useContext(MotionContext);
}
