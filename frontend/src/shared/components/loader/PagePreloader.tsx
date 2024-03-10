import React from "react";
import "./loader.scss";

export default function PagePreloaderLoader({ active }: { active: boolean }) {
  return <div className={`preloader ${active ? "" : "d-none"}`}></div>;
}
