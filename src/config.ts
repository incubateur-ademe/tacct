export const config = {
  host: process.env.NEXT_PUBLIC_SITE_URL!,
  name: "TACCT - Réussir la démarche d'adaptation de votre territoire",
  tagline: '',
  env: (process.env.TACCT_ENV || 'dev') as 'dev' | 'prod' | 'staging',
  repositoryUrl: process.env.NEXT_PUBLIC_REPOSITORY_URL!,
  formUrl: '',
  description:
    'Assurez une compréhension partagée du diagnostic de vulnérabilité de votre territoire avec TACCT et favoriser le dialogue sur des problématiques clairement identifiées.'
};
