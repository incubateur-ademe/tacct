export function ProConnectSignIn() {
  return (
    <a
      href="/api/proconnect/login"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: '#003189',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '4px',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: 500
      }}
    >
      S&apos;identifier avec ProConnect
    </a>
  );
}
