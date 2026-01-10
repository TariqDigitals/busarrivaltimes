import { useEffect, useRef, useState } from 'react';

export function usePullToRefresh(onRefresh: () => void | Promise<void>, threshold = 80) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    let isRefreshing = false;

    function handleTouchStart(e: TouchEvent) {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    }

    function handleTouchMove(e: TouchEvent) {
      if (!isPulling || isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const distance = currentY.current - startY.current;

      if (distance > 0 && window.scrollY === 0) {
        e.preventDefault();
        setPullDistance(Math.min(distance, threshold * 1.5));
      }
    }

    async function handleTouchEnd() {
      if (!isPulling || isRefreshing) return;

      if (pullDistance >= threshold) {
        isRefreshing = true;
        try {
          await onRefresh();
        } finally {
          isRefreshing = false;
        }
      }

      setIsPulling(false);
      setPullDistance(0);
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, pullDistance, threshold, onRefresh]);

  return {
    isPulling,
    pullDistance,
    isTriggered: pullDistance >= threshold,
  };
}
