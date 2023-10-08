import type { IFormField, IFormFieldsVariables } from "y/types/app";
import { Pages, Routes } from "../constants/enums";

const useFormFields = ({ slug }: IFormFieldsVariables) => {
  const loginFields = (): IFormField[] => [
    {
      label: "email",
      name: "email",
      type: "email",
      placeholder: "Enter your email",
      autoFocus: true,
    },
    {
      label: "password",
      name: "password",
      placeholder: "••••••••",
      type: "password",
    },
  ];

  const signupFields = (): IFormField[] => [
    {
      label: "First Name",
      name: "first_name",
      type: "text",
      placeholder: "Enter your First Name",
      autoFocus: true,
    },
    {
      label: "Last Name",
      name: "last_name",
      type: "text",
      placeholder: "Enter your Last Name",
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      placeholder: "Enter your email",
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "••••••••",
    },
    {
      label: "Confirm Password",
      name: "confirm_password",
      type: "password",
      placeholder: "••••••••",
    },
  ];

  const forgotFields = (): IFormField[] => [
    {
      label: "Email",
      name: "email",
      type: "text",
      autoFocus: true,
    },
  ];

  const resetFields = (): IFormField[] => [
    {
      label: "Password",
      name: "password",
      type: "password",
      autoFocus: true,
    },
    {
      label: "Confirm Password",
      name: "confirm_password",
      type: "password",
    },
  ];

  const getFormFields = (): IFormField[] => {
    switch (slug) {
      case Pages.LOGIN:
        return loginFields();
      case Pages.SIGNUP:
        return signupFields();
      case Pages.FORGOT_PASSWORD:
        return forgotFields();
      case Pages.RESET_PASSWORD:
        return resetFields();

      case Pages.PROFILE_DETAILS:
        return signupFields();

      default:
        return [];
    }
  };

  return {
    getFormFields,
  };
};

export default useFormFields;
