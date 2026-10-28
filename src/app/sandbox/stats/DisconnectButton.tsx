"use client";
import { BoutonSecondaireClassic } from '@/design-system/base/Boutons';
import { signOut } from 'next-auth/react';

export default function DisconnectButton() {
  return (
    <BoutonSecondaireClassic
      text="Se déconnecter"
      size="md"
      onClick={() => signOut({ callbackUrl: '/' })}
    />
  );
}
