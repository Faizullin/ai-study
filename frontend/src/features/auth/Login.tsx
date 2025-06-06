import React from "react";
import { useAppDispatch, useAppSelector } from "@/core/hooks/redux";
import {
  fetchUserData,
  fetchUserSubscribedCourses,
  loginUser,
} from "@/core/redux/store/reducers/authSlice";
import PasswordInput from "@/shared/components/form/auth/PasswordInput";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";
import InputLabel from "@/shared/components/InputLabel";
import InputError from "@/shared/components/form/InputError";
import PrimaryButton from "@/shared/components/buttons/primary-button/PrimaryButton";
import TextInput from "@/shared/components/form/auth/TextInput";
import useRedirectBack from "@/core/hooks/useRedirectBack";
import useEffectInitial from "@/core/hooks/useEffectInitial";
import TitleHelment from "@/shared/components/title/TitleHelmet";

// import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
// import Icon from "@mdi/react";
// import { mdiGoogle } from "@mdi/js";

import "./auth.scss";

export default function Login() {
  const dispath = useAppDispatch();
  const { redirect } = useRedirectBack();
  const { errors, loading, isAuthenticated, user, success } = useAppSelector(
    (state) => state.auth
  );
  const intl = useIntl();
  const [data, setData] = React.useState({
    email: "",
    password: "",
  });
  // const handleLoginViaGoogleSuccess = useGoogleLogin({
  //   onSuccess: (tokenResponse) => {
  //     console.log(tokenResponse);
  //   },
  //   onError: (errorResponse) => {},
  // });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((state) => ({
      ...state,
      [name]: value,
    }));
  };
  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispath(loginUser(data)).then((response) => {
      if (response.type === loginUser.fulfilled.toString()) {
        dispath(fetchUserData()).then((response) => {
          if (response.type === fetchUserData.fulfilled.toString()) {
            dispath(fetchUserSubscribedCourses())
            redirect();
          }
        });
      }
    });
  };
  const handleLoginViaGoogle = (event: any) => {
    event?.preventDefault();
    // handleLoginViaGoogle();
  };
  useEffectInitial(() => {
    if (isAuthenticated && user) {
      redirect();
    }
  }, [isAuthenticated]);

  return (
    <div className="auth-form-container">
      <TitleHelment title={intl.formatMessage({ id: "login" })} />
      <h3>
        <FormattedMessage id="login" defaultMessage="Login" />
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12 col-sm-8 col-xl-6">
            {/* <div className="d-flex justify-content-center">
              <a href="#" onClick={handleLoginViaGoogle}>
                <Icon path={mdiGoogle} size={1} />
              </a>
            </div> */}
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
                isFocused={true}
                onChange={handleInputChange}
              />
              <InputError message={errors.email} className="mt-2" />
            </div>
            <div className="form-group mb-4">
              <InputLabel
                htmlFor="password"
                value={intl.formatMessage({
                  id: "password",
                  defaultMessage: "Password",
                })}
              />
              <PasswordInput
                value={data.password}
                onChange={handleInputChange}
                name="password"
              />
              <InputError message={errors.password} className="mt-2" />
            </div>
            <div className="form-group mb-2">
              <PrimaryButton
                type="submit"
                processing={loading.post}
                className="bg-green-normal-active text-capitalize"
              >
                <FormattedMessage id="Zb4Zyi" defaultMessage="Click to login" />
              </PrimaryButton>
            </div>
            <InputError message={errors.detail} className="my-4" />
            <div className="form-group">
              <div className="d-flex justify-content-between flex-wrap">
                <Link
                  to="/auth/forgot_password"
                  className="text-color-green-dark"
                >
                  <FormattedMessage
                    id="cyRU1N"
                    defaultMessage="Forgot your password?"
                  />
                </Link>
              </div>
            </div>
            <div className="mt-3">
              <div className="d-flex justify-content-between flex-wrap">
                <FormattedMessage
                  id="QusafT"
                  defaultMessage="Not a member yet?"
                />
                <Link to="/auth/register">
                  <FormattedMessage
                    id="9B6Q74"
                    defaultMessage="Create your Account"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
