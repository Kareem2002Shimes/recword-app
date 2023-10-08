import {
  signUpSchema,
  generateOTP,
  verifyOTP,
  ResetPasswordSchema,
} from "y/validation/auth";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { User } from "y/types/app";
import optGenerator from "otp-generator";

const EMAIL_SECRET = process.env.NEXTAUTH_SECRET as string;

const sendVerification = (user: User) => {
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
          to: user.email,
          subject: "RecWord - Activate Account",
          html: `
          <h3>Hello ${user.name || user.firstName}</h3>
          <p>Thank you for registering into our application. Just one more step...</p>
          <p>To activate your account please follow this link: <a target="_" href="${
            process.env.NEXTAUTH_URL
          }/activate/${emailToken}">Activate Link</a></p>
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
const sendPassword = (user: User) => {
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
const sendOTP = (user: User, generatedOTP: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_USER,
      pass: process.env.GOOGLE_PASSWORD,
    },
  });
  transporter.sendMail(
    {
      from: process.env.GOOGLE_USER,
      to: user.email,
      subject: "RecWord - Reset Your Password",
      html: `
      <h3>Hello ${user.name || user.firstName}</h3>
      <p>To reset your password please enter ${generatedOTP} code in the app</p>
      <p>This code expires in 15 minutes</p>
      <p>Cheers,</p>
      <p>RecWord Team</p>
    `,
    },
    (err, info) => {
      if (err) console.log(err);
      console.log(info);
    }
  );
};

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(signUpSchema)
    .mutation(
      async ({ input: { email, password, first_name, last_name }, ctx }) => {
        const exists = await ctx.prisma.user.findUnique({
          where: { email },
        });
        if (exists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "User already exists.",
          });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await ctx.prisma.user.create({
          data: {
            firstName: first_name,
            lastName: last_name,
            email,
            password: hashedPassword,
            name: `${first_name} ${last_name}`,
          },
          select: {
            email: true,
            firstName: true,
            lastName: true,
            id: true,
            name: true,
          },
        });
        sendVerification(user);

        return {
          status: 201,
          message: "Account created successfully",
          id: user.id,
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        };
      }
    ),

  verifyAccount: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      try {
        const { userId }: any = jwt.verify(id, EMAIL_SECRET);

        const user = await ctx.prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        if (!user) return new Error("Invaild Token");
        await ctx.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            active: true,
          },
        });
        return user;
      } catch (error) {
        return new Error("Invalid Token");
      }
    }),

  createPassword: publicProcedure
    .input(
      z.object({
        password: z
          .string()
          .min(8, { message: "Password must be at least 8 characters" })
          .max(40),
      })
    )
    .mutation(async ({ ctx, input: { password } }) => {
      const userId = ctx.session?.user.id;
      const user = await ctx.prisma.user.findFirst({
        where: {
          id: userId,
          active: false,
        },
      });
      const hashedPassword = await bcrypt.hash(password, 10);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User does not exists.",
        });
      }
      await ctx.prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          password: hashedPassword,
          active: true,
        },
      });

      return {
        status: 201,
        message: "Password created successfully",
      };
    }),
  resendVerification: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User does not exists.",
        });
      }
      sendVerification(user);
      return {
        status: 200,
        message: "Verification email has been sent",
      };
    }),
  sendPasswordForGoogleAccount: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User does not exists.",
        });
      }
      sendPassword(user);
      return {
        status: 200,
        message: "Verification email has been sent",
      };
    }),
  removeNotVerifiedUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          id,
          active: false,
        },
      });
      if (!user) return;
      await ctx.prisma.user.delete({
        where: {
          id,
        },
      });
    }),
  sendOTPVerification: publicProcedure
    .input(generateOTP)
    .mutation(async ({ ctx, input: { email } }) => {
      const generatedOTP = optGenerator.generate(4, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      const user = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User does not exists.",
        });
      }
      sendOTP(user, generatedOTP);
      const hashedOTP = await bcrypt.hash(generatedOTP, 10);
      const otp = await ctx.prisma.otpVerification.findUnique({
        where: {
          userId: user.id,
        },
      });
      if (!otp) {
        await ctx.prisma.otpVerification.create({
          data: {
            otp: hashedOTP,
            userId: user.id,
            expiresAt: new Date().getMinutes() + 15,
          },
        });
      } else {
        await ctx.prisma.otpVerification.update({
          where: {
            userId: user.id,
          },
          data: {
            otp: hashedOTP,
            expiresAt: new Date().getMinutes() + 15,
          },
        });
      }

      return {
        status: 201,
        message: "Check your email to reset password",
        id: user.id,
      };
    }),

  verifyOTP: publicProcedure
    .input(verifyOTP)
    .mutation(async ({ ctx, input: { code, userId } }) => {
      const OTP = await ctx.prisma.otpVerification.findUnique({
        where: {
          userId,
        },
      });
      if (!OTP) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid OTP Code",
        });
      }
      if ((OTP.expiresAt as number) < new Date().getMinutes()) {
        throw new TRPCError({
          code: "TIMEOUT",
          message: "Code has expired. Please request again.",
        });
      }
      const isVaildOTP = await bcrypt.compare(code, OTP.otp);

      if (!isVaildOTP) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid code passed.Please Check your inbox again.",
        });
      }
      return {
        status: 200,
        userId: OTP.userId,
        message: "Verify Successfully",
      };
    }),
  resetPassword: publicProcedure
    .input(ResetPasswordSchema)
    .mutation(async ({ ctx, input: { password, userId } }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User does not exists.",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
        },
      });
      return {
        status: 200,
        message: "Password reset successfully",
      };
    }),
});
