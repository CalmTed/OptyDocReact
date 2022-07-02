import React from "react";
function TextInput ({
  className,
  value,
  onChange,
  placeholder,
  title
}) {
  return (
    <textarea
      className={className}
      onChange={onChange}
      placeholder={placeholder}
      title={title}
      value={value}
    >
    </textarea>
  );
}
export default TextInput;