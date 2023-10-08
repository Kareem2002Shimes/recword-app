import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";

import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { env } from "y/env.mjs";
import { prisma } from "y/server/db";
import { loginSchema } from "y/validation/auth";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { User, UserRole } from "@prisma/client";
import { Pages, Routes } from "y/constants/enums";
import { AdapterUser } from "next-auth/adapters";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    active: boolean;
    firstName: string;
    lastName: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
const EMAIL_SECRET = process.env.NEXTAUTH_SECRET as string;

const sendPassword = (user: AdapterUser | User) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_USER,
      pass: process.env.GOOGLE_PASSWORD,
    },
  });

  jwt.sign(
    {
      userId: user.id,
    },
    EMAIL_SECRET,
    {
      expiresIn: "1d",
    },
    async (err, emailToken) => {
      transporter.sendMail(
        {
          from: process.env.GOOGLE_USER,
          to: user.email as string,
          subject: "RecWord - Create Password & Verify your account",
          html: `
            <h3>Hello ${user.name}</h3>
            <p>Thank you for registering into our application. Just one more step...</p>
            <p>To create your password please follow this link: <a target="_" href="${process.env.NEXTAUTH_URL}/create/password/${emailToken}">Create Password</a></p>
            <p>Cheers,</p>
            <p>RecWord Team</p>
          `,
        },
        (err, info) => {
          if (err) console.log(err);
          console.log(info);
        }
      );
    }
  );
};

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.active = token.active;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
      }
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          active: token.active,
          firstName: token.firstName,
          lastName: token.lastName,
        },
      };
    },
    async signIn({ user, account }) {
      if (user && account) {
        if (account.provider === "google") {
          const userWithNoPassword = await prisma.user.findFirst({
            where: {
              id: user.id,
              active: false,
            },
          });

          if (userWithNoPassword) {
            sendPassword(user as AdapterUser | User);
            throw new Error("Please confirm your email to login");
          }

          const existedUser = await prisma.user.findFirst({
            where: {
              email: user.email as string,
              active: true,
            },
          });
          if (existedUser) return true;
          sendPassword(user as AdapterUser | User);
        }

        return true;
      }
      return false;
    },
    jwt: async ({ token, user }): Promise<any> => {
      const dbUser = await prisma.user.findUnique({
        where: {
          email: token?.email as string,
        },
      });
      if (!dbUser) {
        return {
          ...token,
          id: user.id,
        };
      }
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        active: dbUser.active,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
      };
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",

  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<any> => {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials);

          const user = await prisma.user.findUnique({
            where: { email },
          });
          if (!user) {
            throw new Error("User does not exist");
          }
          if (!user.active) {
            sendPassword(user);
            throw new Error("Please confirm your email to login");
          }
          const isValidPassword = await bcrypt.compare(
            password,
            user.password as string
          );
          if (!isValidPassword) {
            throw new Error("Wrong Password");
          }
          return {
            id: user.id,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
          };
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: `/${Routes.AUTH}/${Pages.LOGIN}`,
    signOut: `/${Routes.AUTH}/${Pages.LOGOUT}`,
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
