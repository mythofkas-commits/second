import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { type NextAuthOptions, getServerSession } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { env, adminEmails } from './env';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database',
  },
  pages: {
    signIn: '/auth/sign-in',
  },
  events: {
    async signIn({ user }) {
      if (!user?.email) return;
      const email = user.email.toLowerCase();
      const role = adminEmails.includes(email) ? 'ADMIN' : 'USER';
      await prisma.user.update({
        where: { id: user.id },
        data: { role },
      }).catch(() => undefined);
    },
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
  providers: [
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(env.GITHUB_ID && env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: env.GITHUB_ID,
            clientSecret: env.GITHUB_SECRET,
          }),
        ]
      : []),
  ],
  secret: env.NEXTAUTH_SECRET,
};

export type SessionUser = {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !session.user.id || !session.user.role) {
    return null;
  }
  return {
    id: session.user.id,
    email: session.user.email,
    role: session.user.role as SessionUser['role'],
  };
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 });
  }
  if (user.role !== 'ADMIN') {
    throw Object.assign(new Error('Forbidden'), { status: 403 });
  }
  return user;
}
