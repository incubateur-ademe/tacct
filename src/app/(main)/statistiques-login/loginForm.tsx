"use client";
import { ChampTexte } from '@/components/questionnaire-de-connexion/ChampTexte';
import { COULEURS } from '@/components/questionnaire-de-connexion/couleurs';
import { LoaderText } from '@/components/ui/loader';
import { BoutonPrimaireClassic } from '@/design-system/base/Boutons';
import { Body } from '@/design-system/base/Textes';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });
    if (res?.error) {
      setError('Identifiant ou mot de passe incorrect');
      setLoading(false);
    } else {
      window.location.href = '/sandbox/stats';
    }
  };

  if (loading) return <LoaderText text='Connexion en cours' height='280px' />;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <ChampTexte
        label="Identifiant"
        value={username}
        onChange={setUsername}
        autoComplete="username"
        autoFocus
      />
      <ChampTexte
        label="Mot de passe"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
      />
      {error && (
        <div role="alert">
          <Body size="sm" color={COULEURS.texteErreur}>{error}</Body>
        </div>
      )}
      <BoutonPrimaireClassic
        type="submit"
        text="Se connecter"
        size="lg"
        disabled={!username || !password}
        style={{ width: '100%', justifyContent: 'center' }}
      />
    </form>
  );
}
