import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function useHydrationSafeReducedMotion() {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated && prefersReducedMotion;
}
