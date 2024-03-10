import React, { ReactNode, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppNavLink from "./navbar/AppNavLink";
import { useAppDispatch, useAppSelector } from "@/core/hooks/redux";
import { logout } from "@/core/redux/store/reducers/authSlice";
import { INotification } from "@/core/models/INotification";
import { FormattedMessage, useIntl } from "react-intl";
import Icon from "@mdi/react";
import { mdiClose, mdiMenu } from "@mdi/js";
import LangConfig, { ILangOption, TLang } from "@/lang/LangConfig";
import NavDropdown from "./navbar/NavDropdown";
import useIsMobile from "@/core/hooks/useIsMobile";
import HeaderSearch from "./HeaderSearch";
import { useDebounced } from "@/core/hooks/useDebounced";
import useEffectInitial from "@/core/hooks/useEffectInitial";

import "./header.scss";
import {
  fetchDocumentList,
  openHeaderSearchbar,
} from "@/core/redux/store/reducers/searchSidebarSlice";
import AvatarImg from "../avatar/AvatarImg";

const LanguageOptions: ILangOption[] = [
  {
    code: "en",
    name: "English",
  },
  {
    code: "kk",
    name: "Kazakh",
  },
  {
    code: "ru",
    name: "Russian",
  },
];

type IHeaderProps = {
  children?: ReactNode;
};
interface ILinkItem {
  href?: string;
  to?: string;
  label: string;
  active?: boolean;
}

const user_default_ava =
  "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp";

export default function Header({ children }: IHeaderProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const intl = useIntl();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { notifications_list, loaded: notification_loaded } = useAppSelector(
    (state) => state.notification
  );
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const isMobile = useIsMobile();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounced(searchTerm, 500);
  const { isHeaderSearchBarOpen } = useAppSelector(
    (state) => state.searchSidebar
  );

  const handleSearchbarChange = (value: string) => {
    setSearchTerm(value);
    if (!isHeaderSearchBarOpen) {
      dispatch(openHeaderSearchbar());
    }
  };
  const handleSearchbarSubmit = () => {
    console.log("SHumbit");
  };

  const links: ILinkItem[] = [
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

  const handleToggleMobileNav = () => {
    setIsMobileNavOpen((isMobileNavOpen) => !isMobileNavOpen);
  };
  const handleMobileDropdownChnage = (data: any) => {};
  const handleLogout = () => {
    dispatch(logout());
  };
  const handleLangChang = (lang: TLang) => {
    LangConfig.setLang(lang);
    window.location.reload();
  };

  const handleRedirect = (event: any, to: string) => {
    event?.preventDefault();
    if (isMobile) {
      if (isMobileNavOpen) {
        setIsMobileNavOpen((state) => !state);
        navigate(to);
      }
    } else {
      navigate(to);
    }
  };

  const unread_notifications = React.useMemo(() => {
    return notifications_list.filter(
      (item: INotification) => item.unread === true
    );
  }, [notification_loaded]);

  // useEffect(() => {
  //   if (!notification_loaded && isAuthenticated) {
  //     dispatch(fetchNotificationList());
  //   }
  // }, [notification_loaded, isAuthenticated]);

  useEffectInitial(() => {
    dispatch(
      fetchDocumentList({
        search: searchTerm,
        page_size: 10,
      })
    );
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileNavOpen]);

  return (
    <header id="header" className="header shadow-md">
      <div className="container h-100 d-flex align-items-center justify-content-between">
        <div className="header-searchbar-wrapper flex-grow-1 me-md-3">
          <HeaderSearch
            value={searchTerm}
            onChange={handleSearchbarChange}
            onSubmit={handleSearchbarSubmit}
            onFocus={() => {
              dispatch(openHeaderSearchbar());
            }}
          />
        </div>
        {isMobileNavOpen && (
          <div
            className="d-md-none m-0 p-0"
            style={{
              width: 71.2,
            }}
          ></div>
        )}
        <nav
          id="navbar"
          className={`navbar h-100 order-last order-md-0 mobile-nav ${
            isMobileNavOpen ? "navbar-mobile" : ""
          }`}
        >
          <ul>
            {links.map((link, index) => (
              <li key={index}>
                <AppNavLink
                  link={link}
                  onClick={(e) => handleRedirect(e, link.href || link.to)}
                >
                  {link.label}
                </AppNavLink>
              </li>
            ))}
            <NavDropdown
              mobile={isMobile}
              titleComponent={<span>{intl.locale}</span>}
            >
              {LanguageOptions.map((lang, index) => (
                <li key={index}>
                  <a
                    onClick={() => handleLangChang(lang.code)}
                    className={`${lang.code === intl.locale ? "active" : ""}`}
                  >
                    {lang.name}
                  </a>
                </li>
              ))}
            </NavDropdown>
            {isAuthenticated ? (
              <NavDropdown
                className="position-relative dropdown-menu-end "
                mobile={isMobile}
                titleComponent={
                  <div>
                    {/* <img
                      src={user_default_ava}
                      alt=""
                      className="border avatar"
                    /> */}
                    <AvatarImg
                      src={user?.profile?.url || user_default_ava}
                      className="border avatar p-0 m-0"
                    />
                    <div
                      className={`notification-point ${
                        unread_notifications.length > 0 ? "" : "d-none"
                      }`}
                    ></div>
                  </div>
                }
              >
                <>
                  {/* <li className="dropdown">
                    <Link to="/dashboard">
                      <span>
                        <FormattedMessage
                          id="notifications"
                          defaultMessage="Notifications"
                        />
                      </span>
                    </Link>
                    <ul>
                      {unread_notifications.map((item: INotification) => (
                        <li key={item.id}>
                          <Link to={`/dashboard`}>
                            {item.description.length > 9
                              ? item.description.substring(0, 9) + "..."
                              : item.description}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li> */}
                  <li>
                    <Link to={"/dashboard/profile"}>
                      <FormattedMessage id="profile" defaultMessage="Profile" />
                    </Link>
                  </li>
                  <li>
                    <Link to={"/dashboard"}>
                      <FormattedMessage
                        id="dashboard"
                        defaultMessage="Dashboard"
                      />
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        event.preventDefault();
                        handleLogout();
                      }}
                    >
                      <FormattedMessage id="logout" defaultMessage="Logout" />
                    </a>
                  </li>
                </>
              </NavDropdown>
            ) : (
              <li>
                <AppNavLink
                  link={{
                    to: "/auth/login",
                  }}
                  onClick={(e) => handleRedirect(e, "/auth/login")}
                >
                  <FormattedMessage id="login" defaultMessage="Login" />
                </AppNavLink>
              </li>
            )}
          </ul>
          <a
            className="mobile-nav-toggle bg-transparent d-md-none"
            onClick={handleToggleMobileNav}
          >
            <Icon
              path={isMobileNavOpen ? mdiClose : mdiMenu}
              size={1.3}
              className={`${
                isMobileNavOpen
                  ? "text-color-orange-f2"
                  : "text-color-green-normal"
              }`}
            />
          </a>
        </nav>
      </div>
    </header>
  );
}
