import { type Metadata } from 'next';

const description =
  'Assurez une compréhension partagée du diagnostic de vulnérabilité de votre territoire avec TACCT et favoriser le dialogue sur des problématiques clairement identifiées.';

const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';

export const sharedMetadata: Metadata = {
  description,
  title: 'TACCT',
  robots: isProduction
    ? undefined
    : {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false
        }
      },
  openGraph: {
    description,
    type: 'website',
    locale: 'fr_FR',
    countryName: 'France',
    siteName: "TACCT - Réussir la démarche d'adaptation de votre territoire"
    // images: [
    //   {
    //     url: new URL(``, config.host),
    //     alt: "",
    //   },
    // ],
  }
};
