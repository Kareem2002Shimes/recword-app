import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useFormFields from "y/hooks/useFormFields";
import useFormValidations from "y/hooks/useFormValidations";
import FormFields from "../formFields/FormFields";
import { IFormField } from "y/types/app";
import { api } from "y/utils/api";
import { useCallback } from "react";
import { User } from "@prisma/client";
import { IUpdateProfile } from "y/validation/auth";
import toast from "react-hot-toast";
import { Pages } from "y/constants/enums";

const Details = ({ loggedUser }: { loggedUser: User }) => {
  const { getFormFields } = useFormFields({ slug: "details" });
  const { getValidationSchema } = useFormValidations({
    slug: Pages.PROFILE_DETAILS,
  });

  const DEFAULT_VALUES: any = {};
  for (const field of getFormFields()) {
    DEFAULT_VALUES[field.name] = "";

    field.name === "email"
      ? (DEFAULT_VALUES[field.name] = loggedUser?.email)
      : "";
    field.name === "first_name" &&
      (DEFAULT_VALUES[field.name] = loggedUser?.firstName
        ? loggedUser?.firstName
        : "");
    field.name === "last_name" &&
      (DEFAULT_VALUES[field.name] = loggedUser?.lastName
        ? loggedUser?.lastName
        : "");
  }
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(getValidationSchema()),
    mode: "onChange",
    defaultValues: DEFAULT_VALUES,
  });
  const user = api.profile.updateProfile.useMutation();

  const onSubmit = useCallback(
    async (data: IUpdateProfile) => {
      try {
        const result = await user.mutateAsync({
          ...data,
        });
        if (result.status === 200) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      } catch (error: any) {
        toast.error(error);
      }
    },
    [user.mutateAsync]
  );
  return (
    <form className="py-10" onSubmit={handleSubmit(onSubmit)}>
      {getFormFields().map((field: IFormField) => (
        <div key={field.name} className="mb-3 grid grid-cols-1 sm:grid-cols-2">
          <FormFields {...field} control={control} errors={errors} />
        </div>
      ))}

      <button
        className={`submit-btn element-center mx-auto mt-10 flex w-[150px] max-w-full ${
          user.isLoading ? "bg-slate-400 dark:bg-slate-600" : ""
        }`}
        type="submit"
        disabled={user.isLoading}
      >
        {isSubmitting ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : (
          "Update"
        )}
      </button>
    </form>
  );
};

export default Details;
