export function HeartIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 21s-7.2-4.7-9.7-8.9C.5 9.1 1.2 5.5 4.1 4c2.1-1.1 4.4-.5 5.9 1.2C11.5 3.5 13.8 2.9 15.9 4c2.9 1.5 3.6 5.1 1.8 8.1C19.2 16.3 12 21 12 21z" />
    </svg>
  );
}

export function InfoIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10.5V16" />
      <path d="M12 7.5h.01" />
    </svg>
  );
}

export function MailIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function CheckIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function GiftIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 10h16v10H4z" />
      <path d="M3 6h18v4H3z" />
      <path d="M12 6v14" />
      <path d="M12 6c-2.2 0-4-.9-4-2 0-.8.7-1.4 1.5-1.4C11.1 2.6 12 6 12 6z" />
      <path d="M12 6c2.2 0 4-.9 4-2 0-.8-.7-1.4-1.5-1.4C12.9 2.6 12 6 12 6z" />
    </svg>
  );
}

export function HandIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8.5 12.6 12 9.1a2 2 0 0 1 2.8 2.8l-2.1 2.1" />
      <path d="m12.7 14 4.2-4.2a2 2 0 0 1 2.8 2.8l-5.8 5.8a6 6 0 0 1-8.5 0L3 16" />
      <path d="m4 15 4-4" />
    </svg>
  );
}

export function MegaphoneIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 13.5h3.1l9.5 4.1V6.4l-9.5 4.1H4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2z" />
      <path d="M7.2 15.1 8.4 21h2.4l-1.4-5.2" />
      <path d="M19.2 9.6a4 4 0 0 1 0 6.8" />
    </svg>
  );
}

export function ArrowIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function WayIcon({ tone }) {
  if (tone === 'volunteer') {
    return <HandIcon className="h-7 w-7" />;
  }

  if (tone === 'share') {
    return <MegaphoneIcon className="h-7 w-7" />;
  }

  return <GiftIcon className="h-7 w-7" />;
}
