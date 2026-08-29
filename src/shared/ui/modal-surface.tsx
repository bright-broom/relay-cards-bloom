"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ModalSurfaceProps = {
  children: ReactNode;
  className: string;
  label: string;
  onClose: () => void;
  overlayClassName?: string;
};

const focusableSelector =
  'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

export function ModalSurface({ children, className, label, onClose, overlayClassName = "overlay" }: ModalSurfaceProps) {
  const surfaceRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const surface = surfaceRef.current;
    const firstFocusable = surface?.querySelector<HTMLElement>(focusableSelector);
    firstFocusable?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !surface) return;
      const focusable = Array.from(surface.querySelectorAll<HTMLElement>(focusableSelector));
      const first = focusable.at(0);
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div className={overlayClassName} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section
        aria-label={label}
        aria-modal="true"
        className={className}
        ref={surfaceRef}
        role="dialog"
      >
        {children}
      </section>
    </div>
  );
}
