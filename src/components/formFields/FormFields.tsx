import { InputTypes } from "y/constants/enums";
import TextField from "./TextField";
import PasswordField from "./PasswordField";
import Checkbox from "./Checkbox";
import { IFormField } from "y/types/app";

interface Props extends IFormField {
  errors: any;
  control: any;
}

const FormFields = (props: Props) => {
  const { type } = props;

  const renderField = (): React.ReactNode => {
    if (type === InputTypes.EMAIL || type === InputTypes.TEXT) {
      return <TextField {...props} />;
    }

    if (type === InputTypes.PASSWORD) {
      return <PasswordField {...props} />;
    }

    if (type === InputTypes.CHECKBOX) {
      return <Checkbox {...props} />;
    }

    return null;
  };

  return <>{renderField()}</>;
};

export default FormFields;
