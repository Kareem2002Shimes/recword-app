import type { IFormFieldsVariables } from "../types/app";
import * as z from "zod";
import { Pages } from "../constants/enums";
import {
  ResetPasswordSchema,
  generateOTP,
  loginSchema,
  signUpSchema,
  updateProfile,
} from "y/validation/auth";

const useFormValidations = (props: IFormFieldsVariables) => {
  const { slug } = props;

  const getValidationSchema = () => {
    switch (slug) {
      case Pages.LOGIN:
        return loginSchema;
      case Pages.SIGNUP:
        return signUpSchema;
      case Pages.RESET_PASSWORD:
        return ResetPasswordSchema;
      case Pages.PROFILE_DETAILS:
        return updateProfile;
      case Pages.FORGOT_PASSWORD:
        return generateOTP;

      default:
        return z.object({});
    }
  };

  return { getValidationSchema };
};

export default useFormValidations;
