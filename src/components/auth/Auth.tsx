import Image from "next/image";
import Link from "next/link";
import { Pages, Routes } from "y/constants/enums";
import Form from "./Form";
import type { IFormFieldsVariables, ProfileType } from "y/types/app";
import { useEffect, useState } from "react";
import { api } from "y/utils/api";
import { IGenerateOTP } from "y/validation/auth";
import toast from "react-hot-toast";

type AuthProps = IFormFieldsVariables & {
  profile?: ProfileType;
};

const Auth: React.FC<AuthProps> = ({ slug, profile }) => {
  const [resend, setResend] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      resend > 0 && setResend((prev) => prev - 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [resend]);
  const renderTitle = (): string | null => {
    switch (slug) {
      case Pages.LOGIN:
        return "Welcome back";
      case Pages.SIGNUP:
        return "Create an account";
      case Pages.FORGOT_PASSWORD:
        return "Forgot your password?";
      case Pages.VERIFY_ACCOUNT:
        return "Please Verify your email";
      case Pages.RESET_PASSWORD:
        return "Reset Password";
      case Pages.ENTER_OTP:
        return "Enter verification code";
      default:
        return null;
    }
  };
  const renderDesc = (): string | null => {
    switch (slug) {
      case Pages.FORGOT_PASSWORD:
        return "Please enter your email here to reset password";
      case Pages.VERIFY_ACCOUNT:
        return "You're almost there! We sent an email to";
      case Pages.RESET_PASSWORD:
        return "Enter 4 digit OTP sent to your email address";
      case Pages.ENTER_OTP:
        return "OTP code was sent to";
      default:
        return null;
    }
  };
  const resendOTP = api.auth.sendOTPVerification.useMutation();

  const handleResendOTP = async () => {
    try {
      const result = await resendOTP.mutateAsync({
        email: profile?.email,
      } as IGenerateOTP);
      toast.success(result.message);
      console.log(result);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div className="flex min-h-screen ">
      <div className="w-full p-4 md:w-auto md:p-10 ">
        <Link href={Routes.ROOT} className="flex items-center gap-[15px]">
          <Image
            src="/images/logo.svg"
            alt="logo-img"
            width={40}
            height={40}
            className="object-contain"
          />
          <strong className="text-slate-800 dark:text-slate-200">
            RecWord
          </strong>
        </Link>
        <div className="flex h-full w-full flex-col pt-20 md:w-[300px] lg:w-[350px]">
          <h3 className="mb-6 text-3xl font-semibold tracking-tight text-slate-900 dark:border-slate-200/5 dark:text-white sm:text-4xl">
            {renderTitle()}
          </h3>
          {slug === Pages.VERIFY_ACCOUNT && (
            <>
              <p className="text-info mb-4 text-base font-normal">
                {renderDesc()}{" "}
                {slug === Pages.VERIFY_ACCOUNT && (
                  <span className="text-primary">{profile?.email}</span>
                )}
              </p>
              <p className="text-info text-base font-normal">
                Just click on the link in that email to complete your signup. If
                you don't find it.
              </p>
            </>
          )}
          {slug === Pages.ENTER_OTP && (
            <>
              <p className="text-info  mb-2 text-base font-normal">
                {renderDesc()}{" "}
                {slug === Pages.ENTER_OTP && (
                  <span className="text-primary">{profile?.email}</span>
                )}
              </p>

              {resend ? (
                <p className="text-info text-sm font-normal">
                  Resend in 00:{resend < 10 ? `0${resend}` : resend}
                </p>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-info text-sm font-normal">
                    Didn't receive the verification OTP?
                  </p>
                  <button
                    className={`element-center text-primary text-sm font-normal hover:underline ${
                      resendOTP.isLoading
                        ? "bg-slate-400 dark:bg-slate-600"
                        : ""
                    }`}
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendOTP.isLoading}
                  >
                    Resend again
                  </button>
                </div>
              )}
            </>
          )}
          <Form slug={slug} profile={profile} />
        </div>
      </div>
      <div className="relative hidden w-full after:absolute after:left-0 after:top-0 after:h-full after:w-full after:bg-black/10 after:content-[''] dark:after:bg-black/10 md:block">
        <Image
          src="/images/landingImg.jpg"
          alt="auth-img"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default Auth;
