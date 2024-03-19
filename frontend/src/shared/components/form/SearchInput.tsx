import React, { FC } from "react";
import Icon from "@mdi/react";
import { mdiSearchWeb } from "@mdi/js";
import "./search-input.scss";

interface ISearchInputProps {
  onChange: (value: string) => void;
  onSubmit: () => void;
  onFocus?: () => void;
  value: string;
}

const SearchInput: FC<ISearchInputProps> = ({
  onChange,
  value,
  onSubmit,
  onFocus,
}) => {
  const handleChange = (event: any) => {
    onChange(event.target.value);
  };
  const handleFocus = () => {
    if (onFocus !== undefined) {
      onFocus();
    }
  };
  const handleSubmit = (event: any) => {
    event?.preventDefault();
    onSubmit();
  };
  return (
    <div className="search-input d-flex justify-content-start align-items-center">
      <a href="#" onClick={handleSubmit} className="search-input__submit">
        <Icon path={mdiSearchWeb} size={1} />
      </a>
      <input
        className="search-input__field flex-grow-1"
        type="text"
        placeholder="Search"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
      />
    </div>
  );
};

export default SearchInput;
