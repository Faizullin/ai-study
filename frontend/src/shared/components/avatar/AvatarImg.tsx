import React, { FC } from "react";
import "./avatar-img.scss";

interface IAvatarImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  onClick?: () => void;
}
const no_user_url =
  "https://www.jamf.com/jamf-nation/img/default-avatars/generic-user-purple.png";
const AvatarImg: FC<IAvatarImgProps> = ({ src, className, onClick }) => {
  const path = src || no_user_url;
  const handleClick = (event: any) => {
    event?.preventDefault();
    if (onClick) {
      onClick();
    }
  };
  return (
    <a
      href="#"
      className={`avatar-img d-block ${className ? className : ""}`}
      onClick={handleClick}
    >
      <img src={path} alt={path} className="w-100 h-100 object-fit-cover" />
    </a>
  );
};

export default AvatarImg;
