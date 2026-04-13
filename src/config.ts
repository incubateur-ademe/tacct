export const config = {
  host: process.env.NEXT_PUBLIC_SITE_URL!,
  name: "TACCT - adaptez votre territoire au changement climatique",
  tagline: '',
  env: (process.env.TACCT_ENV || 'dev') as 'dev' | 'prod' | 'staging',
  // appVersion: process.env.NEXT_PUBLIC_APP_VERSION!,
  // appVersionCommit: process.env.NEXT_PUBLIC_APP_VERSION_COMMIT!,
  repositoryUrl: process.env.NEXT_PUBLIC_REPOSITORY_URL!,
  formUrl: '',
  description:
    'Assurez une compréhension partagée du diagnostic de vulnérabilité de votre territoire avec TACCT et favoriser le dialogue sur des problématiques clairement identifiées.'
};
