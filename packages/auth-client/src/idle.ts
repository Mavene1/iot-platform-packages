import { useState, useEffect, useCallback, useRef } from "react";
import { useIdleTimer } from "react-idle-timer";
import type { UseIdleTimeoutOptions, UseIdleTimeoutResult } from "./types";

const DEFAULT_TIMEOUT_MS = 15 * 60 * 1000;
const DEFAULT_WARNING_BEFORE_MS = 2 * 60 * 1000;

/**
 * Detects user inactivity and drives the session-expiry warning flow.
 *
 * Cross-tab sync is enabled via react-idle-timer's BroadcastChannel —
 * activity in any open tab (shell or child app) resets every tab's timer.
 * All apps must use the same timer name ("iot-platform-idle") for this to work.
 */
export function useIdleTimeout({
  timeoutMs = DEFAULT_TIMEOUT_MS,
  warningBeforeMs = DEFAULT_WARNING_BEFORE_MS,
  enabled = true,
  onExpire,
}: UseIdleTimeoutOptions): UseIdleTimeoutResult {
  const [isWarning, setIsWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(
    Math.floor(warningBeforeMs / 1000),
  );

  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const handlePrompt = useCallback(() => {
    setIsWarning(true);
    setSecondsRemaining(Math.floor(warningBeforeMs / 1000));
  }, [warningBeforeMs]);

  const handleIdle = useCallback(() => {
    onExpireRef.current();
  }, []);

  const handleActive = useCallback(() => {
    setIsWarning(false);
    setSecondsRemaining(Math.floor(warningBeforeMs / 1000));
  }, [warningBeforeMs]);

  const { activate, getRemainingTime } = useIdleTimer({
    timeout: timeoutMs,
    promptBeforeIdle: warningBeforeMs,
    onPrompt: handlePrompt,
    onIdle: handleIdle,
    onActive: handleActive,
    disabled: !enabled,
    crossTab: true,
    name: "iot-platform-idle",
    eventsThrottle: 1000,
  });

  useEffect(() => {
    if (!isWarning) return;
    const id = setInterval(() => {
      setSecondsRemaining(Math.max(0, Math.round(getRemainingTime() / 1000)));
    }, 1_000);
    return () => clearInterval(id);
  }, [isWarning, getRemainingTime]);

  const extendSession = useCallback(() => {
    activate();
    setIsWarning(false);
    setSecondsRemaining(Math.floor(warningBeforeMs / 1000));
  }, [activate, warningBeforeMs]);

  return { isWarning, secondsRemaining, extendSession };
}
