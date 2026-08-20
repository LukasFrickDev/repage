import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function focusElement(element: HTMLElement) {
  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '-1');
  }

  element.focus({ preventScroll: true });
}

export function NavigationManager() {
  const location = useLocation();
  const lastLocation = useRef<string | null>(null);

  useLayoutEffect(() => {
    const locationIdentity = `${location.key}:${location.pathname}:${location.hash}`;

    if (lastLocation.current === locationIdentity) return;

    const isInitialLocation = lastLocation.current === null;
    lastLocation.current = locationIdentity;

    if (location.hash) {
      const targetId = decodeURIComponent(location.hash.slice(1));
      const target = document.getElementById(targetId);

      if (target) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
        if (!isInitialLocation) focusElement(target);
      }

      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    if (!isInitialLocation) {
      const routeFocusTarget = document.querySelector<HTMLElement>('[data-route-heading]')
        ?? document.getElementById('main-content');

      if (routeFocusTarget) focusElement(routeFocusTarget);
    }
  }, [location.hash, location.key, location.pathname]);

  return null;
}
