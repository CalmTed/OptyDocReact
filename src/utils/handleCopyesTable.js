export const recreateCopiesTitles = (store, actionTypes) => {
  const findVariableChildren = (children, parentID, returnList = []) => {
    children.forEach(rootChild => {
      if (rootChild.parentID === parentID) {
        const isVariable = (["variable", "selector"].includes(rootChild.valueType));
        const hasChildren = typeof children.find(child => child.parentID === rootChild.uuid) !== "undefined";
        if (!hasChildren && isVariable) {
          returnList.push(rootChild);
        }else{
          returnList = findVariableChildren(children, rootChild.uuid, returnList);
        }
      }
    });
    return returnList;
  };
  const variablesListObjects = findVariableChildren(store.getState().template.children, "");
  const columnsObject = (variablesListObjects) => {
    let ret = [];
    variablesListObjects.forEach(obj => {
      let type = "variable";
      let options = [""];
      if(obj.valueType === "selector") {
        type = obj.valueType;
        options = obj.innerText.split("\n");
      }
      console.log(obj.valueType, type);
      ret.push({
        target:obj.uuid + "",
        title:obj.variableTitle,
        type:type,
        options:options
      });
    });
            
    return ret;
  };
  store.dispatch({type:actionTypes.COPIES_COLUMNS_SET,
    payload:columnsObject(variablesListObjects)});
};
