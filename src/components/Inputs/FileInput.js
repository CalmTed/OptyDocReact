import React from "react";
function FileInput ({
  target,
  onChange,
  accept,
  icon,
  title
}) {
  const getTitle = (title) => {
    let inputTitle = [];
    title ? inputTitle.push(<span key='title'>{title}</span>) :  false;
    return inputTitle;
  };
  return (
    <label 
      className="fileinput"
      key={target + "Label"}
      title={target}
    >
      {icon}
      {getTitle(title)}
      <input
        key={target + "hiddenInput"}
        type="file"
        style={{"display":"none"}}
        onChange={onChange}
        accept={accept}
      />
    </label>
  );
}
export default FileInput;
