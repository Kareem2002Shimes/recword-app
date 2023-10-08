import { useState } from "react";
import { IFormField } from "y/types/app";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Controller } from "react-hook-form";

interface Props extends IFormField {
  errors: any;
  control: any;
}
interface IState {
  showPassword: boolean;
}

const INITIAL_STATE: IState = { showPassword: false };

const PasswordField = ({
  label,
  name,
  placeholder,
  disabled,
  autoFocus,
  control,
  errors,
}: Props) => {
  const [state, setState] = useState(INITIAL_STATE);
  const { showPassword } = state;
  const handleClickShowPassword = () =>
    setState((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <label htmlFor={name} className="custom-label-filed">
        {label}
      </label>
      <div className="relative flex items-center">
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <input
              type={showPassword ? "text" : "password"}
              {...field}
              placeholder={placeholder}
              disabled={disabled}
              autoFocus={autoFocus}
              autoComplete="off"
              name={name}
              id={name}
              className={`custom-input-field  text-accent focus:ring-primary dark:focus:ring-primary ${
                errors[name]
                  ? "hover:ring-red-400 focus:ring-red-500 dark:hover:ring-red-400 dark:focus:ring-red-500"
                  : ""
              }`}
            />
          )}
        />

        <button
          type="button"
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
          className="element-center text-accent absolute right-4 h-7 w-7 rounded-full transition-colors duration-200 hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          {showPassword ? (
            <AiFillEyeInvisible className="h-4 w-4" />
          ) : (
            <AiFillEye className="h-4 w-4" />
          )}
        </button>
      </div>
      <p
        className={`mt-4 text-center text-sm ${
          errors[name] ? "text-red-500" : ""
        }`}
      >
        {errors[name] && errors[name].message}
      </p>
    </>
  );
};

export default PasswordField;
