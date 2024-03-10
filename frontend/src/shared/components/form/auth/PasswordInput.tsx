import { mdiEye, mdiEyeOff } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useState } from "react";

interface IPasswordInputProps extends React.HTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  name: string;
  value: string | number | readonly string[];
  message?: string;
  messages?: string[];
}

export default function PasswordInput(props: IPasswordInputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  //   const input = useRef<HTMLInputElement | null>(null);

  const handleTogglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="input-group">
      <input
        type={passwordVisible ? "text" : "password"}
        id={props.id || `input-id-${props.name}`}
        name={props.name}
        value={props.value}
        placeholder={props.placeholder}
        className={`form-control ${props.className ? props.className : ""}`}
        onChange={(e) => props.onChange(e)}
      />
      <div className="input-group-append">
        <a
          className="btn bg-transparent"
          type="button"
          onClick={handleTogglePassword}
        >
          {passwordVisible ? (
            <Icon path={mdiEyeOff} size={1} />
          ) : (
            <Icon path={mdiEye} size={1} />
          )}
        </a>
      </div>
    </div>
  );
}
