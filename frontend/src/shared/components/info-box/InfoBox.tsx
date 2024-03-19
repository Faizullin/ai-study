import React, { FC, ReactNode } from "react";
import "./info-box.scss";

interface IInfoBoxProps {
  title: string | ReactNode;
  content: string | ReactNode;
  className?: string;
}

const InfoBox: FC<IInfoBoxProps> = ({ title, content, className }) => {
  return (
    <div className={`info-box ${className ? className : ""}`}>
      <div className="info-box-header">{title}</div>
      <div className="info-box-content">{content}</div>
    </div>
  );
};

export default InfoBox;
