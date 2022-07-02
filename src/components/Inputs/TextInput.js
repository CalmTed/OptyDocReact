import React from "react";
function TextInput ({
  target,
  className,
  value,
  onChange,
  placeholder,
  title,
  dataList
}) {
  const getDataListOptions = (dataList = [], value = "") => {
    const dataListOptions = dataList.filter(option => option !== value).map(option => <option key={`${option}_option`} value={option}></option>);
    return dataListOptions;
  };
  return (
    <div>
      <input key={target + "TextInput"} className={className} list={target + "TextInputList"} value={value} onChange={onChange} placeholder={placeholder} title={title}/>
      <datalist key= {target + "TextInputListKey"} id={target + "TextInputList"}>{getDataListOptions(dataList, value)}</datalist>
    </div>
  );
}
export default TextInput;