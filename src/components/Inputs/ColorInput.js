import React from "react";
import {BLOCK_INHERIT} from "../../constants/block";
function ColorInput ({
  className,
  value,
  onChange,
  placeholder,
  title
}) {
  return (
    <input
      type="color"
      className={className}
      value={value === BLOCK_INHERIT ? "#000000" : value}
      onChange={onChange}
      placeholder={placeholder}
      title={title}
    />
  );
}
export default ColorInput;
