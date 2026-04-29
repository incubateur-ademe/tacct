'use client';

import NextError from 'next/error';

export default function GlobalError() {

  return (
    <html lang="fr" title="Erreur site TACCT">
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
