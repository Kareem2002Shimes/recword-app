import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";

import { api } from "y/utils/api";
import ErrorPage from "next/error";

import { Pages, Routes } from "y/constants/enums";
import { ssg } from "y/server/api/ssgHelper";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import FormFields from "y/components/formFields/FormFields";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useFormFields from "y/hooks/useFormFields";
import useFormValidations from "y/hooks/useFormValidations";
import { IFormField } from "y/types/app";
import Footer from "y/components/Footer";
import { IResetPassword, IResetPasswordType } from "y/validation/auth";

const CreatePasswordPage: NextPage = () => {
  const { getFormFields } = useFormFields({ slug: Pages.RESET_PASSWORD });
  const { getValidationSchema } = useFormValidations({
    slug: Pages.RESET_PASSWORD,
  });

  const userWithPassword = api.auth.createPassword.useMutation();

  const router = useRouter();

  const isSuccess = true;
  const DEFAULT_VALUES: any = {};
  for (const field of getFormFields()) {
    DEFAULT_VALUES[field.name] = "";
  }
  const {
    handleSubmit,
    control,
    formState: { errors , isSubmitting},
  } = useForm<any>({
    resolver: zodResolver(getValidationSchema()),
    mode: "onChange",
    defaultValues: DEFAULT_VALUES,
  });
  const onSubmit = useCallback(
    async (data: IResetPasswordType) => {
      const password = data.password;
      try {
        const result = await userWithPassword.mutateAsync({
          password,
        } as IResetPassword);
        if (result?.status === 201) {
          console.log(result.message);
          router.replace(`/${Routes.PROFILE}`);
        }
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    },
    [userWithPassword.mutateAsync, router]
  );

  return (
    <div className="element-center pt-20">
      {isSuccess ? (
        <div className="container">
          <Image
            src="/images/logo.svg"
            alt="logo-img"
            width={100}
            height={100}
            className="mx-auto mb-10 object-contain"
          />
          <h2 className="mb-10 text-center text-2xl font-semibold text-accent">
            Create your password to access your account in the future
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {getFormFields().map((field: IFormField) => (
              <div
                key={field.name}
                className="mx-auto mb-3 w-[400px] max-w-full"
              >
                <FormFields {...field} control={control} errors={errors} />
              </div>
            ))}
            <button
              className="submit-btn mx-auto mb-20 mt-10 block w-[200px] max-w-full"
              type="submit"
              disabled={isSubmitting}
            >
              Create Password
            </button>
          </form>
          <Footer />
        </div>
      ) : (
        <h1 className="text-3xl font-semibold text-accent md:text-5xl">
          Something went wrong
        </h1>
      )}
    </div>
  );
};

export default CreatePasswordPage;
