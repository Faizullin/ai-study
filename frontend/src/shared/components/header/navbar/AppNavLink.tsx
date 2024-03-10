import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function AppNavLink({
  children,
  link,
  onClick,
}: {
  children: React.ReactNode;
  link: any;
  onClick: (event?: any) => void;
}) {
  return (
    <>
      {link.href ? (
        <a
          onClick={onClick}
          href={link.href}
          className={`${link.href ? "scrollto" : ""} ${
            link.active ? "active" : ""
          } h-100`}
        >
          {children ? children : link.label}
        </a>
      ) : (
        <NavLink
          onClick={onClick}
          className={({ isActive }) =>
            `${isActive ? "active" : ""} ${
              link.href ? "scrollto" : ""
            } h-100`
          }
          to={link.to}
        >
          {children ? children : link.label}
        </NavLink>
      )}
    </>
  );
}
