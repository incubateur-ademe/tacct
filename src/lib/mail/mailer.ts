import 'server-only';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import nodemailer, { type Transporter } from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import { LOGOS_MAIL } from './gabarit';

const DOSSIER_LOGOS = path.join(process.cwd(), 'public', 'mail');

let transporteur: Transporter | null | undefined;

const getTransporteur = (): Transporter | null => {
  if (transporteur !== undefined) return transporteur;

  if (process.env.MAILER_DSN) {
    transporteur = nodemailer.createTransport(process.env.MAILER_DSN);
  } else if (process.env.MAILER_HOST) {
    const port = Number(process.env.MAILER_PORT ?? 587);
    const user = process.env.MAILER_USER;
    const pass = process.env.MAILER_PASSWORD;
    transporteur = nodemailer.createTransport({
      host: process.env.MAILER_HOST,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined
    });
  } else {
    transporteur = null;
  }
  return transporteur;
};

const piecesJointesLogos = (): Mail.Attachment[] =>
  LOGOS_MAIL.flatMap((logo) => {
    try {
      return [
        {
          cid: logo.cid,
          filename: logo.fichier,
          content: readFileSync(path.join(DOSSIER_LOGOS, logo.fichier))
        }
      ];
    } catch (error) {
      console.warn(`[mail] logo introuvable : ${logo.fichier}`, error);
      return [];
    }
  });

/**
 * N'échoue jamais : un envoi raté est loggé sans remettre en cause l'action appelante.
 */
export const envoyerMail = async (options: {
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> => {
  const transport = getTransporteur();
  if (!transport) {
    console.warn(`[mail] MAILER non configuré — email non envoyé : "${options.subject}"`);
    return false;
  }
  try {
    await transport.sendMail({
      // Doit être un expéditeur vérifié chez Brevo.
      from: { name: 'TACCT', address: process.env.ADMIN_MAIL ?? 'noreply@ademe.fr' },
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: piecesJointesLogos()
    });
    return true;
  } catch (error) {
    console.error(`[mail] Échec d'envoi "${options.subject}"`, error);
    return false;
  }
};
