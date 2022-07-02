import React from "react";
import t from "../../local.ts";
function SelectInput ({
  target,
  className,
  value,
  onChange,
  title,
  options
}) {
  const selectorOptions = options || ["", ""];
  const selectorOptionsHTML = selectorOptions.map(([title,
    optionValue], index) => {
    //check if we need to translate
    if(target === "selectedCopy") {
      return <option key={index} value={optionValue}>{title}</option>;
    }else{
      return <option key={index} value={optionValue}>{t(title)}</option>;
    }
  });
  return (
    <select
      className={className}
      onChange={onChange}
      value={value}
      title={title}
    >
      {selectorOptionsHTML}
    </select>
  );
}
export default SelectInput;