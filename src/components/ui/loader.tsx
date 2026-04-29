"use client";
import { useEffect, useRef, useState } from "react";
import styles from "../components.module.scss";

export const Loader = ({ height }: { height?: string }) => {
  return (
    <div role="status" aria-label="Chargement en cours" className="flex flex-col justify-center" style={{ height: height || "80dvh", position: 'relative' }}>
      <div className={styles.loader}></div>
    </div>
  );
}

export const LoaderText = ({ text, height }: { text: string; height?: string }) => {
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [first, setFirst] = useState(true);
  const [dotCount, setDotCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeRef = useRef<NodeJS.Timeout | null>(null);
  const appearRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setShow(true);
      setVisible(true);
      setFirst(true);
    }, 500);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!show) return;
    if (visible) {
      // Fade out after 3s
      fadeRef.current = setTimeout(() => {
        setVisible(false);
        setFirst(false);
      }, 3000);
    } else {
      appearRef.current = setTimeout(() => {
        setVisible(true);
      }, 800);
    }
    return () => {
      if (fadeRef.current) clearTimeout(fadeRef.current);
      if (appearRef.current) clearTimeout(appearRef.current);
    };
  }, [show, visible]);

  // Animate dots
  useEffect(() => {
    if (!visible) {
      setDotCount(0);
      return;
    }
    const dotInterval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 400);
    return () => clearInterval(dotInterval);
  }, [visible]);

  return (
    <div
      role="status"
      aria-label={text}
      className="flex flex-col items-center justify-center"
      style={{ height: height || "80dvh", position: 'relative' }}>
      <div className={styles.loader}></div>
      <div
        style={{
          position: 'absolute',
          top: 'calc(50% + 70px)',
          left: '50%',
          transform: 'translate(-50%, 0)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          width: "500px"
        }}
      >
        <div
          style={{
            position: 'relative',
            left: show && first && visible ? 0 : (show && first ? '-350px' : 0),
            fontSize: '0.8em',
            color: '#909090',
            fontWeight: 400,
            opacity: visible ? 1 : 0,
            transition:
              show && first
                ? 'left 1s cubic-bezier(0.4,0,0.2,1), opacity 1s'
                : 'opacity 0.5s',
            whiteSpace: 'pre',
            textAlign: 'center',
            width: '100%',
          }}
        >
          {show ? `${text}${'.'.repeat(dotCount)}${' '.repeat(3 - dotCount)}` : ''}
        </div>
      </div>
    </div>
  );
};
