import useFormFields from "y/hooks/useFormFields";
import type {
  IFormField,
  IFormFieldsVariables,
  ProfileType,
} from "y/types/app";
import FormFields from "../formFields/FormFields";
import { Pages, Routes } from "y/constants/enums";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import AuthCode from "react-auth-code-input";
import { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "y/utils/api";
import useFormValidations from "y/hooks/useFormValidations";
import toast from "react-hot-toast";
import {
  IGenerateOTP,
  ILogin,
  IResetPasswordType,
  ISignUp,
} from "y/validation/auth";

type FormProps = IFormFieldsVariables & {
  profile?: ProfileType;
};
const Form: React.FC<FormProps> = ({ slug, profile }) => {
  const { getFormFields } = useFormFields({ slug });
  const [enteredOTP, setEnteredOTP] = useState<string>();

  const session = useSession();
  const renderButtonText = (): string | null => {
    switch (slug) {
      case Pages.LOGIN:
        return "Login";
      case Pages.SIGNUP:
        return "Create account";
      case Pages.FORGOT_PASSWORD:
        return "Continue";
      case Pages.VERIFY_ACCOUNT:
        return "Resend Verification Email";
      case Pages.RESET_PASSWORD:
        return "Change Password";
      case Pages.ENTER_OTP:
        return "Confirm";
      default:
        return null;
    }
  };
  const verifyOTP = api.auth.verifyOTP.useMutation();
  const handleOnChange = async (res: string) => {
    setEnteredOTP(res);
    try {
      const result = await verifyOTP.mutateAsync({
        code: res as string,
        userId: profile?.id as string,
      });
      if (result.status === 200) {
        toast.success(result.message);
        router.replace(
          `/${Routes.AUTH}/${Pages.RESET_PASSWORD}/${result.userId}`
        );
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const GoogleBtn = () => {
    return (
      <div className="element-center flex-col">
        <button
          type="button"
          onClick={() => signIn("google")}
          disabled={session.status === "loading"}
          className={`element-center  ${
            session.status === "loading" ? "bg-slate-400 dark:bg-slate-600" : ""
          } h-10 w-full gap-3 rounded-md shadow-sm ring-1 ring-slate-900/10 transition-colors duration-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700`}
        >
          {session.status === "loading" ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            <>
              <FcGoogle className="h-5 w-5" />
              Continue with Google
            </>
          )}
        </button>
        <div className="flex w-full items-center gap-6 px-1 py-6 font-medium text-accent">
          <span className="block h-[1px] w-full bg-slate-900/10 dark:bg-slate-300/10"></span>
          <span>or</span>
          <span className="block h-[1px] w-full bg-slate-900/10 dark:bg-slate-300/10"></span>
        </div>
      </div>
    );
  };
  const NavigateLink = ({
    slug,
    desc,
    linkText,
  }: {
    slug: string;
    desc: string;
    linkText: string;
  }) => {
    return (
      <div className="mt-6 flex items-center gap-2">
        <p className="text-sm font-medium text-accent">{desc}</p>
        <Link
          href={`/${Routes.AUTH}/${slug}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          {linkText}
        </Link>
      </div>
    );
  };
  const renderGoogleBtn = (): ReactNode | null => {
    switch (slug) {
      case Pages.LOGIN:
        return <GoogleBtn />;
      case Pages.SIGNUP:
        return <GoogleBtn />;
      default:
        return null;
    }
  };
  const renderNavigateLink = (): ReactNode | null => {
    switch (slug) {
      case Pages.LOGIN:
        return (
          <NavigateLink
            slug={Pages.SIGNUP}
            desc="Don’t have an account yet?"
            linkText="Sign up now"
          />
        );
      case Pages.SIGNUP:
        return (
          <NavigateLink
            slug={Pages.LOGIN}
            desc="Already have an account?"
            linkText="Login"
          />
        );
      default:
        return null;
    }
  };

  const router = useRouter();
  const { getValidationSchema } = useFormValidations({ slug });
  const DEFAULT_VALUES: any = {};
  for (const field of getFormFields()) {
    DEFAULT_VALUES[field.name] = "";
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(getValidationSchema()),
    mode: "onChange",
    defaultValues: DEFAULT_VALUES,
  });

  const user = api.auth.signup.useMutation();
  const resendVerification = api.auth.resendVerification.useMutation();
  const createGooglePassword =
    api.auth.sendPasswordForGoogleAccount.useMutation();
  const removeNotVerifiedUser = api.auth.removeNotVerifiedUser.useMutation();
  const sendOTP = api.auth.sendOTPVerification.useMutation();
  const resetPassword = api.auth.resetPassword.useMutation();

  const onSubmit = useCallback(
    async (data: any) => {
      switch (slug) {
        case Pages.LOGIN:
          try {
            const res = await signIn("credentials", {
              ...(data as ILogin),
              redirect: false,
            });
            if (res?.ok) {
              reset();
              router.replace(`${Routes.ROOT}`);
            } else {
              toast.error(res?.error as string);
            }
          } catch (error: any) {
            toast.error(error);
          }
          break;
        case Pages.SIGNUP:
          try {
            const result = await user.mutateAsync(data as ISignUp);
            if (result.status === 201) {
              reset();
              router.replace(
                `/${Routes.AUTH}/${Pages.VERIFY_ACCOUNT}/${result.id}`
              );
              toast.success(result.message);
            }
          } catch (error: any) {
            toast.error(error.message);
          }
          break;
        case Pages.VERIFY_ACCOUNT:
          if (!profile?.password) {
            try {
              const result = await createGooglePassword.mutateAsync({
                id: profile?.id as string,
              });
              if (result?.status === 200) {
                toast.success(result.message);
              }
            } catch (error: any) {
              toast.error(error.message);
            }
          } else {
            try {
              const result = await resendVerification.mutateAsync({
                id: profile?.id as string,
              });
              if (result?.status === 200) {
                toast.success(result.message);
              }
            } catch (error: any) {
              toast.error(error.message);
            }
          }

          break;
        case Pages.FORGOT_PASSWORD:
          try {
            const result = await sendOTP.mutateAsync({
              email: data.email,
            } as IGenerateOTP);
            if (result.status === 201) {
              toast.success(result.message);
              router.push(`/${Routes.AUTH}/${Pages.ENTER_OTP}/${result.id}`);
            }
          } catch (error: any) {
            toast.error(error.message);
          }
          break;
        case Pages.ENTER_OTP:
          try {
            const result = await verifyOTP.mutateAsync({
              code: enteredOTP as string,
              userId: profile?.id as string,
            });
            if (result.status === 200) {
              toast.success(result.message);
              router.replace(
                `/${Routes.AUTH}/${Pages.RESET_PASSWORD}/${result.userId}`
              );
            }
          } catch (error: any) {
            toast.error(error.message);
          }
          break;
        case Pages.RESET_PASSWORD:
          try {
            const result = await resetPassword.mutateAsync({
              userId: profile?.id,
              ...data,
            } as IResetPasswordType);
            if (result.status === 200) {
              toast.success(result.message);
              router.push(`${Routes.ROOT}`);
            }
          } catch (error: any) {
            toast.error(error.message);
          }
          break;

        default:
          break;
      }
    },
    [user.mutateAsync, router, enteredOTP]
  );

  return (
    <div>
      {renderGoogleBtn()}
      <form onSubmit={handleSubmit(onSubmit)}>
        {slug === Pages.ENTER_OTP && (
          <AuthCode
            length={4}
            containerClassName="grid grid-cols-4 gap-6 my-6 "
            inputClassName="outline-none border-b-[1px] border-accent  text-center bg-transparent text-accent font-[700] text-[32px] leading-[48px] h-[64px]"
            autoFocus={true}
            onChange={handleOnChange}
            allowedCharacters="numeric"
          />
        )}

        {getFormFields().map((field: IFormField) => (
          <div key={field.name} className="mb-3">
            <FormFields {...field} control={control} errors={errors} />
          </div>
        ))}

        {slug === Pages.LOGIN && (
          <div className="mb-2 mt-6 flex items-center justify-between">
            <FormFields
              type="checkbox"
              name="remember"
              aria-describedby="remember"
              id="remember"
              label="Remember me"
              control={control}
              errors={errors}
            />
            <Link
              href={`/${Routes.AUTH}/${Pages.FORGOT_PASSWORD}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        )}
        {renderButtonText() && (
          <button
            className={`submit-btn ${
              isSubmitting ? "bg-slate-400 dark:bg-slate-600" : ""
            }`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              renderButtonText()
            )}
          </button>
        )}

        {renderNavigateLink()}
      </form>
      {slug === `${Pages.VERIFY_ACCOUNT}` && (
        <button
          type="button"
          className="mx-auto mt-10 block h-10 w-fit rounded-md px-4 ring-1 ring-slate-900/10 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          onClick={async () => {
            await removeNotVerifiedUser.mutateAsync({
              id: profile?.id as string,
            });
            signOut({ callbackUrl: `/${Routes.AUTH}/${Pages.LOGIN}` });
          }}
        >
          Another email?
        </button>
      )}
    </div>
  );
};

export default Form;
