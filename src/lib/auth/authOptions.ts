import bcrypt from 'bcryptjs';
import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { statsSessionCookieName } from './statsSessionCookie';
import { prisma } from '../queries/db';

export const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: {
    strategy: 'jwt',
    maxAge: 1800, // 30 minutes
    updateAge: 1800 // force session update toutes les 30 minutes
  },
  cookies: {
    sessionToken: {
      name: statsSessionCookieName(),
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  pages: {
    signIn: '/statistiques-login'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await prisma.sandbox_users.findFirst({
          where: { username: credentials.username as string }
        });

        if (!user) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.pk.toString(),
          name: user.username,
          email: user.username
        };
      }
    })
  ]
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
