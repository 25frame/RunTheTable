"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";

const SWIPE_ROUTES = ["/", "/join", "/live", "/standings", "/players"];

const MIN_SWIPE_DISTANCE = 55;
const MAX_VERTICAL_DRIFT = 80;

export function SwipeNavigator() {
  const router = useRouter();
  const pathname = usePathname();

  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  function getRouteIndex(path: string) {
    if (path === "/") return 0;

    const exactIndex = SWIPE_ROUTES.indexOf(path);
    if (exactIndex !== -1) return exactIndex;

    if (path.startsWith("/players")) return SWIPE_ROUTES.indexOf("/players");

    return -1;
  }

  function shouldIgnoreSwipe(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false;

    const tagName = target.tagName.toLowerCase();

    if (
      tagName === "input" ||
      tagName === "textarea" ||
      tagName === "select" ||
      tagName === "button" ||
      tagName === "a"
    ) {
      return true;
    }

    return Boolean(
      target.closest("input, textarea, select, button, a, [data-no-swipe]")
    );
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    if (shouldIgnoreSwipe(event.target)) return;

    const touch = event.touches[0];
    startX.current = touch.clientX;
    startY.current = touch.clientY;
    startTime.current = Date.now();
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (
      startX.current === null ||
      startY.current === null ||
      startTime.current === null
    ) {
      return;
    }

    if (shouldIgnoreSwipe(event.target)) {
      resetSwipe();
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - startX.current;
    const deltaY = touch.clientY - startY.current;
    const elapsed = Date.now() - startTime.current;

    resetSwipe();

    const isHorizontalSwipe =
      Math.abs(deltaX) >= MIN_SWIPE_DISTANCE &&
      Math.abs(deltaY) <= MAX_VERTICAL_DRIFT &&
      Math.abs(deltaX) > Math.abs(deltaY);

    if (!isHorizontalSwipe) return;
    if (elapsed > 900) return;

    const currentIndex = getRouteIndex(pathname);
    if (currentIndex === -1) return;

    if (deltaX < 0) {
      const nextIndex = Math.min(currentIndex + 1, SWIPE_ROUTES.length - 1);
      const nextRoute = SWIPE_ROUTES[nextIndex];

      if (nextRoute !== pathname) router.push(nextRoute);
      return;
    }

    if (deltaX > 0) {
      const previousIndex = Math.max(currentIndex - 1, 0);
      const previousRoute = SWIPE_ROUTES[previousIndex];

      if (previousRoute !== pathname) router.push(previousRoute);
    }
  }

  function resetSwipe() {
    startX.current = null;
    startY.current = null;
    startTime.current = null;
  }

  return (
    <div
      className="fixed inset-0 z-[1]"
      aria-hidden="true"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    />
  );
}