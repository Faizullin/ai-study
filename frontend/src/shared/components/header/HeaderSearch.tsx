import React from "react";
import "./header-search.scss";
import { useIntl } from "react-intl";

type IHeaderProps = {
  onChange: (value: string) => void;
  onSubmit: () => void;
  onFocus?: () => void;
  value: string;
};
export default function HeaderSearch({
  onChange,
  value,
  onSubmit,
  onFocus,
}: IHeaderProps) {
  const intl = useIntl();
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
    <div className="header-searchbar">
      <input
        id="searchQueryInput"
        className="header-searchbar-input"
        type="text"
        name="searchQueryInput"
        placeholder={intl.formatMessage({ id: "search" })}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
      />
      <button
        id="searchQuerySubmit"
        type="submit"
        name="searchQuerySubmit"
        onClick={handleSubmit}
      >
        <svg style={{ width: "24px", height: "24px" }} viewBox="0 0 24 24">
          <path
            fill="#666666"
            d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
          />
        </svg>
      </button>
    </div>
  );
}
