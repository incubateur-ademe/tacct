import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '../queries/db';

export const AuthOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 1800, // 30 minutes in seconds
    updateAge: 1800 // force session update every 30min
  },
  pages: {
    signIn: '/statistiques-login'
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID
        ? process.env.GOOGLE_CLIENT_ID
        : '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
        ? process.env.GOOGLE_CLIENT_SECRET
        : ''
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        
        const user = await prisma.sandbox_users.findFirst({
          where: { username: credentials.username }
        });
        
        if (!user) {
          return null;
        }
            // deactivate rule 
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const bcrypt = require('bcryptjs');

        const passwordMatch = await bcrypt.compare(credentials.password, user.password);
        
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
export default AuthOptions;
