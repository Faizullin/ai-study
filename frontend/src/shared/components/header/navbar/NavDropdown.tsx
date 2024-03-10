import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";
import { ReactNode, useState } from "react";

function NavDropdown({
  className,
  titleComponent,
  children,
  mobile,
}: {
  className?: string;
  titleComponent: ReactNode;
  mobile: boolean;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggleDropdown = (event: any) => {
    event?.preventDefault();
    if (mobile) {
      setIsOpen((state) => !state);
    }
  };
  return (
    <li className={`dropdown ${className ? className : ""}`}>
      <a href="#" onClick={handleToggleDropdown}>
        {titleComponent}
        {mobile ? (
          isOpen ? (
            <Icon path={mdiChevronUp} size={1} />
          ) : (
            <Icon path={mdiChevronDown} size={1} />
          )
        ) : (
          ""
        )}
      </a>
      <ul className={`${isOpen && mobile ? "dropdown-active" : ""}`}>
        {children}
      </ul>
    </li>
  );
}

export default NavDropdown;
