jest.mock('server-only', () => ({}), { virtual: true });

import { blindIndex, decryptField, encryptField } from '@/lib/crypto/user-crypto';

// Vecteurs d'interop : ces valeurs DOIVENT être assertées à l'identique dans le
// test équivalent de l'app TACCT (tacct-legacy-nextjs). Tant qu'elles concordent
// des deux côtés, ce que Facili-TACCT chiffre, TACCT le relit (et inversement).
const KEY_B64 = 'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE=';
const BIDX_INPUT = 'sub-test-vector';
const BIDX_EXPECTED = 'j+1LEjatCCf1WdA/faPk5Q5dVDtOmSkT+Q909kiyt7Q=';
const FIXED_BLOB =
  'enc:v1:AgICAgICAgICAgICsDUsKnQBdsPjI/sXq+t9eQhJCT191vI7ONsdjiJSQ0v3e6EQFlDecvUFzg==';
const FIXED_BLOB_PLAINTEXT = 'jean.dupont@example.gouv.fr';

beforeAll(() => {
  process.env.USER_ENCRYPTION_KEY = KEY_B64;
});

describe('user-crypto', () => {
  it('round-trip encrypt → decrypt', () => {
    for (const value of ['Jean', 'éàü ç', 'jean.dupont@example.gouv.fr', '']) {
      expect(decryptField(encryptField(value))).toBe(value);
    }
  });

  it('decryptField laisse passer une valeur non chiffrée', () => {
    expect(decryptField('valeur-en-clair')).toBe('valeur-en-clair');
  });

  it('encryptField produit un IV aléatoire (chiffrés distincts, même clair)', () => {
    const a = encryptField('même clair');
    const b = encryptField('même clair');
    expect(a).not.toBe(b);
    expect(a.startsWith('enc:v1:')).toBe(true);
    expect(decryptField(a)).toBe(decryptField(b));
  });

  it('blindIndex est déterministe et conforme au vecteur partagé', () => {
    expect(blindIndex(BIDX_INPUT)).toBe(BIDX_EXPECTED);
    expect(blindIndex(BIDX_INPUT)).toBe(blindIndex(BIDX_INPUT));
  });

  it('déchiffre un blob produit hors de cette app (format inter-app)', () => {
    expect(decryptField(FIXED_BLOB)).toBe(FIXED_BLOB_PLAINTEXT);
  });
});
