import React, { FC } from "react";
import Icon from "@mdi/react";
import { mdiStar, mdiStarHalfFull, mdiStarOutline } from "@mdi/js";

interface IRatingFieldProps {
  value: number;
  onClick: (value: number) => void;
  processing?: boolean;
}

const Images = {
  0: mdiStarOutline,
  0.5: mdiStarHalfFull,
  1: mdiStar,
};

const RatingField: FC<IRatingFieldProps> = ({ value, onClick, processing }) => {
  const stars_count = 5;
  const [arr, setArr] = React.useState<number[]>(Array(stars_count).fill(0));

  const handleClick = (event: any, index: number) => {
    event.preventDefault();
    if (!processing) {
      onClick(index + 1);
    }
  };
  React.useEffect(() => {
    let rounded_value = Math.round(value);
    const tmp_arr = [...arr];
    if (rounded_value > stars_count) {
      rounded_value = stars_count;
    }
    for (let index = 0; index < rounded_value; index++) {
      tmp_arr[index] = 1;
    }
    for (let index = rounded_value; index < stars_count; index++) {
      tmp_arr[index] = 0;
    }
    setArr(tmp_arr);
  }, [value]);
  return (
    <div className="d-flex">
      {arr.map((item, index) => (
        <a
          key={index}
          href="#"
          onClick={(event) => handleClick(event, index)}
          className="text-warning"
        >
          <Icon size={1} path={Images[item]} />
        </a>
      ))}
    </div>
  );
};

export default RatingField;
