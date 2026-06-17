import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Thin top loading bar that animates on every route change (nprogress-style):
 * jumps in, creeps toward ~90%, then snaps to 100% and fades out.
 */
export function RouteProgress() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timers = useRef<number[]>([]);
  const first = useRef(true);

  useEffect(() => {
    // Skip the very first render so the bar only shows on actual navigation.
    if (first.current) {
      first.current = false;
      return;
    }

    timers.current.forEach(clearTimeout);
    timers.current = [];

    setVisible(true);
    setProgress(8);

    timers.current.push(window.setTimeout(() => setProgress(45), 60));
    timers.current.push(window.setTimeout(() => setProgress(82), 220));
    timers.current.push(window.setTimeout(() => setProgress(100), 450));
    timers.current.push(window.setTimeout(() => setVisible(false), 750));
    timers.current.push(window.setTimeout(() => setProgress(0), 950));

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [location.pathname]);

  return (
    <div className="route-progress" aria-hidden="true">
      <div
        className="route-progress-bar"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}
