import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useAppDispatch, useAppSelector } from "@/core/hooks/redux";
import { forgotUserPassword } from "@/core/redux/store/reducers/authSlice";
import InputLabel from "@/shared/components/InputLabel";
import TextInput from "@/shared/components/form/auth/TextInput";
import InputError from "@/shared/components/form/InputError";
import PrimaryButton from "@/shared/components/buttons/primary-button/PrimaryButton";
import TitleHelment from "@/shared/components/title/TitleHelmet";

interface IForgotPasswordProps {
  status?: string;
}

export default function ForgotPassword({ status }: IForgotPasswordProps) {
  const dispath = useAppDispatch();
  const intl = useIntl();
  const { loading, errors } = useAppSelector((state) => state.auth);
  const [data, setData] = React.useState({
    email: "",
  });
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispath(forgotUserPassword(data));
  };
  return (
    <div className="form-container">
      <TitleHelment title={"Password reset"} />
      <h3>Forgot Password ? </h3>
      <form className="form-group" onSubmit={handleSubmit}>
        <div className="form-group mb-2">
          <InputLabel
            htmlFor="email"
            value={intl.formatMessage({
              id: "email",
            })}
          />
          <TextInput
            type="email"
            name="email"
            value={data.email}
            className="form-control"
            autoComplete="email"
            isFocused={true}
            onChange={handleInputChange}
          />
          <InputError message={errors.email} className="mt-2" />
        </div>
        <div className="form-group mb-2">
          <PrimaryButton
            type="submit"
            processing={loading.post}
            className="bg-green-normal-active text-capitalize"
          >
            <FormattedMessage id="submit" />
          </PrimaryButton>
        </div>
        <InputError message={errors.detail} className="my-4" />
      </form>
    </div>
  );
}
