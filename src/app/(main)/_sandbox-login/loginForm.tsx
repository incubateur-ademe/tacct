"use client";
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });
    if (res?.error) {
      setError('Mot de passe incorrect');
    } else {
      window.location.href = '/sandbox/' + username;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label>
        Nom d'utilisateur
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </label>
      <label>
        Mot de passe
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </label>
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">Se connecter</button>
    </form>
  );
}
