export interface IOption {
  label: string;
  value: string;
}
export interface IFormField {
  name: string;
  label?: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "time"
    | "datetime-local"
    | "checkbox"
    | "radio"
    | "select"
    | "hidden"
    | "textarea";
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  options?: IOption;
  id?: string;
}
export interface IFormFieldsVariables {
  slug: string;
}
export type ProfileType = {
  status: number;
  email: string;
  name: string | null;
  lastName: string | null;
  firstName: string | null;
  id: string;
  password: boolean | null;
};

export type User = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  image?: string | null;
};
