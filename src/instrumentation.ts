// Exécuté une fois au démarrage du serveur Next : vérifications de configuration
// qui doivent faire échouer le démarrage plutôt que la première requête.
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { verifierCleChiffrement } = await import('@/lib/crypto/user-crypto');
  verifierCleChiffrement();
}
