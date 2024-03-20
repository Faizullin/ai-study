import React from "react";
import { ConstTitles } from "@/core/constants/names";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

interface ILinkItem {
  href?: string;
  to?: string;
  label: string;
  active?: boolean;
}

export default function Footer() {
  const navigate = useNavigate();
  const intl = useIntl();
  const links1: ILinkItem[] = [
    {
      label: intl.formatMessage({
        id: "home",
        defaultMessage: "Home",
      }),
      to: "/",
      active: true,
    },
    {
      label: intl.formatMessage({
        id: "documents",
        defaultMessage: "Documents",
      }),
      to: "/documents",
    },
    {
      label: intl.formatMessage({
        id: "courses",
        defaultMessage: "Courses",
      }),
      to: "/courses",
    },
  ];
  const links2: ILinkItem[] = [
    {
      label: intl.formatMessage({
        id: "login",
        defaultMessage: "Login",
      }),
      to: "/auth/login",
      active: true,
    },
    {
      label: intl.formatMessage({
        id: "register",
        defaultMessage: "Register",
      }),
      to: "/auth/register",
    },
  ];
  const handleOpenPage = (event: any, to: string) => {
    event?.preventDefault();
    navigate(to);
  };

  return (
    <footer className="footer border-top bg-f9">
      <div className="container">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5 my-5 ">
          {" "}
          <div className="col mb-3">
            {/* <a
              href="/"
              className="d-flex align-items-center mb-3 link-dark text-decoration-none"
            >
              <svg className="bi me-2" width="40" height="32">
                <use xlink:href="#bootstrap"></use>
              </svg>
            </a>
            <p className="text-muted">© 2024</p> */}
          </div>
          <div className="col mb-3"></div>
          <div className="col mb-3">
            <h5>Pages</h5>
            <ul className="nav flex-column">
              {links1.map((item, index) => (
                <li key={index} className="nav-item mb-2">
                  <a
                    href="#"
                    className="nav-link p-0 text-muted"
                    onClick={(e) => handleOpenPage(e, item.to)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col mb-3">
            <h5>Auth</h5>
            <ul className="nav flex-column">
              {links2.map((item, index) => (
                <li key={index} className="nav-item mb-2">
                  <a
                    href="#"
                    className="nav-link p-0 text-muted"
                    onClick={(e) => handleOpenPage(e, item.to)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
