import React from "react";
import { useAppDispatch, useAppSelector } from "@/core/hooks/redux";
import { registerUser } from "@/core/redux/store/reducers/authSlice";
import PasswordInput from "@/shared/components/form/auth/PasswordInput";
import { FormattedMessage, useIntl } from "react-intl";
import { Link, useLocation, useNavigate } from "react-router-dom";
import InputLabel from "@/shared/components/InputLabel";
import InputError from "@/shared/components/form/InputError";
import PrimaryButton from "@/shared/components/buttons/primary-button/PrimaryButton";
import TextInput from "@/shared/components/form/auth/TextInput";
import TitleHelment from "@/shared/components/title/TitleHelmet";

import "./auth.scss";

export default function Register() {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const intl = useIntl();
  const { errors, loading } = useAppSelector((state) => state.auth);

  const [data, setData] = React.useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    // roles: [],
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((state) => ({
      ...state,
      [name]: value,
    }));
  };
  const handleRolesInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setData((state) => ({
      ...state,
      [name]: [value],
    }));
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispath(registerUser(data)).then((response) => {
      if (response.type === registerUser.fulfilled.toString()) {
        navigate("/auth/login");
      }
    });
  };
  return (
    <div className="auth-form-container">
      <TitleHelment title={intl.formatMessage({ id: "Register" })} />
      <h3>
        <FormattedMessage id="register" />{" "}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12">
            <div className="form-group mb-2">
              <InputLabel
                htmlFor="username"
                value={intl.formatMessage({
                  id: "username",
                  defaultMessage: "Username",
                })}
              />
              <TextInput
                type="text"
                name="username"
                value={data.username}
                autoComplete="username"
                isFocused={true}
                onChange={handleInputChange}
              />
              <InputError message={errors.username} className="mt-2" />
            </div>
            <div className="form-group mb-2">
              <InputLabel
                htmlFor="email"
                value={intl.formatMessage({
                  id: "email",
                  defaultMessage: "Email",
                })}
              />
              <TextInput
                type="email"
                name="email"
                value={data.email}
                autoComplete="email"
                onChange={handleInputChange}
              />
              <InputError message={errors.email} className="mt-2" />
            </div>
            <div className="form-group mb-4">
              <InputLabel
                htmlFor="password"
                value={intl.formatMessage({
                  id: "password",
                })}
              />
              <PasswordInput
                name="password"
                value={data.password}
                onChange={handleInputChange}
              />
              <InputError message={errors.password} className="mt-2" />
            </div>

            <div className="form-group mb-4">
              <InputLabel
                htmlFor="password_confirmation"
                value={intl.formatMessage({
                  id: "register.password_confirmation",
                  defaultMessage: "Confirma Password",
                })}
              />
              <PasswordInput
                name="password_confirmation"
                value={data.password_confirmation}
                onChange={handleInputChange}
              />
              <InputError
                message={errors.password_confirmation}
                className="mt-2"
              />
            </div>
            {/* <div className="form-group mb-4">
              <InputLabel
                htmlFor="roles"
                value={intl.formatMessage({
                  id: "register.roles",
                  defaultMessage: "Roles",
                })}
              />
              <div className="form-check" onChange={handleRolesInputChange}>
                <input
                  type="radio"
                  id="roles-student"
                  className="form-check-input"
                  value="student"
                  name="roles"
                />
                <label className="form-check-label" htmlFor="roles-student">
                  <FormattedMessage id="student" defaultMessage="Student" />
                </label>
              </div>
              <div className="form-check" onChange={handleRolesInputChange}>
                <input
                  type="radio"
                  id="roles-staff"
                  className="form-check-input"
                  value="staff"
                  name="roles"
                />
                <label className="form-check-label" htmlFor="roles-staff">
                  <FormattedMessage
                    id="register.xsc241"
                    defaultMessage="Staff (admin / teacher)"
                  />
                </label>
              </div>
              <InputError message={errors.roles} className="mt-2" />
            </div> */}
            <InputError message={errors.detail} className="my-4" />
            <div className="form-group mb-2">
              <PrimaryButton
                type="submit"
                processing={loading.post}
                className="bg-green-normal-active text-capitalize"
              >
                <FormattedMessage
                  id="register.submit"
                  defaultMessage="Register"
                />
              </PrimaryButton>
            </div>
            <div className="d-flex justify-content-start flex-wrap">
              <FormattedMessage
                id="register.login.not_member"
                defaultMessage="Not member yet?"
              />
              <Link to="/auth/login">
                <FormattedMessage
                  id="register.already_registered"
                  defaultMessage="Already registered"
                />
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
