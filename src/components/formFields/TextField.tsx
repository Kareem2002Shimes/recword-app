import { IFormField } from "y/types/app";
import { Controller } from "react-hook-form";
interface Props extends IFormField {
  errors: any;
  control: any;
}

const TextField = ({
  label,
  name,
  type,
  placeholder,
  disabled,
  autoFocus,
  control,
  errors,
}: Props) => {
  return (
    <>
      <label htmlFor={name} className="custom-label-filed">
        {label}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <input
            className={`custom-input-field  text-accent focus:ring-primary dark:focus:ring-primary ${
              errors[name]
                ? "hover:ring-red-400 focus:ring-red-500 dark:hover:ring-red-400 dark:focus:ring-red-500"
                : ""
            }`}
            type={type}
            {...field}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            name={name}
            id={name}
          />
        )}
      />
      <p
        className={`text-accent mt-4 text-center text-sm ${
          errors[name] ? "text-red-500" : ""
        }`}
      >
        {errors[name] && errors[name].message}
      </p>
    </>
  );
};

export default TextField;
