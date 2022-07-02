import React from "react";
function SizeInput ({
  className,
  value,
  onChange,
  placeholder,
  title
}) {
  return (
    <input 
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      title={title}
    />
  );
}
export default SizeInput;