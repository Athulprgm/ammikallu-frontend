import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared accessibility behaviour for full-screen overlays (modals / drawers):
 *  - locks background scroll while open (and restores the previous position)
 *  - closes on Escape
 *  - traps Tab focus within the overlay
 *  - moves initial focus into the overlay
 *
 * Returns a ref to attach to the overlay container.
 *
 * onClose is kept in a ref so an inline arrow function won't re-run the
 * effect (and re-lock scroll / steal focus) on every render.
 */
export default function useOverlayA11y(isOpen, onClose) {
  const containerRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    const node = containerRef.current;

    // Lock background scroll, remembering the current position.
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';

    // Move focus into the overlay. Prefer the container itself (tabIndex={-1})
    // so screen readers announce the dialog; otherwise focus first focusable.
    if (node && node.hasAttribute('tabindex')) {
      node.focus();
    } else {
      const firstFocusable = node?.querySelector(FOCUSABLE);
      (firstFocusable || node)?.focus?.();
    }

    const getFocusable = () =>
      Array.from(node?.querySelectorAll(FOCUSABLE) || []).filter(
        el => el.offsetParent !== null
      );

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current?.();
        return;
      }

      if (e.key !== 'Tab' || !node) return;

      const items = getFocusable();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      // Treat the container itself as "inside" but not a tab stop.
      const inside = active === node || node.contains(active);

      if (e.shiftKey) {
        if (active === first || active === node || !inside) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !inside) {
        e.preventDefault();
        first.focus();
      }
    };

    // Capture phase so Tab/Escape are handled even if inner inputs stop propagation.
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      const sy = parseInt(document.body.style.top || '0', 10) * -1;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, sy);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [isOpen]);

  return containerRef;
}
