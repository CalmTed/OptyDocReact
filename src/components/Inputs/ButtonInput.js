import React from "react";
function ButtonInput ({
  primary,
  onClick,
  icon,
  title
}) {
  const getButtonClass = (primary) => {
    let buttonClass = "";
    primary ? buttonClass += "primary" : buttonClass += "";
    return buttonClass;
  };
  const getButtonTitle = (title) => {
    let buttonTitle = [];
    title ? buttonTitle.push(<span key='buttonTitle'>{title}</span>) :  false;
    return buttonTitle;
  };
  return (
    <button
      className={getButtonClass(primary)}
      onClick={onClick}
      title={title}
    >
      {icon}
      {getButtonTitle(title)}
    </button>
  );
}
export default ButtonInput;
