import React, { FC } from "react";
import "./select-tag-widget.scss";

interface ISelectedTagWidgetProps {
  title: string;
  active?: boolean;
  onClick: () => void;
  className?: string;
  variant: "orange" | "primary" | "success" | "secondary";
}

const SelectedTagWidget: FC<ISelectedTagWidgetProps> = ({
  title,
  active,
  onClick,
  className,
  variant,
}) => {
  const handleClick = (event: any) => {
    event?.preventDefault();
    onClick();
  };
  return (
    <a
      href="#"
      onClick={handleClick}
      className={`select-tag-widget ${active ? "active" : ""} ${
        className ? className : ""
      } type-${variant}`}
    >
      {title}
    </a>
  );
};

export default SelectedTagWidget;
