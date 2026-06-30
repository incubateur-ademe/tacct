import ShareIcon from '@/assets/icons/share_icon_white.svg';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export const CopyLinkClipboard = ({
  anchor
}: {
  anchor: string;
}) => {

  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const buttonWrapperRef = useRef<HTMLDivElement>(null);
  const [buttonMinWidth, setButtonMinWidth] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (buttonWrapperRef.current) {
      setButtonMinWidth(buttonWrapperRef.current.offsetWidth);
    }
  }, []);

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    const url = new URL(window.location.href);
    url.hash = `#${anchor}`;
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    e.currentTarget.blur();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setTimeout(() => setCopied(false), 100); // allow fade out
    }, 700);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      <div ref={buttonWrapperRef} style={{ display: 'inline-flex' }}>
        <BoutonPrimaireClassic
          onClick={handleCopy}
          icone={copied ? null : ShareIcon}
          size='sm'
          text={copied ? 'Lien copié' : 'Partager'}
          disabled={copied}
          style={{ minWidth: buttonMinWidth }}
        />
      </div>
      {/* {copied && typeof window !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#FFF',
            color: "var(--principales-vert)",
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            opacity: show ? 1 : 0,
            transition: 'opacity 1s',
            pointerEvents: 'none',
            zIndex: 9999,
            boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
            border: '1px solid var(--gris-medium)',
          }}
        >
          Lien copié
        </div>,
        document.body
      )} */}
    </>
  );
}
