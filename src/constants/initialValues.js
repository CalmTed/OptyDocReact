
import {colorModes, NO_BLOCK_SELECTED, NO_COPY_SELECTED, TAB_NAMES} from "../constants/app"; 

export const initialValuesApp = {
  colorMode:colorModes[0] || "light",
  tabSelected:TAB_NAMES.edit,
  name:"OptyDoc",
  version:"0.0.1",
  languageCode:"en",
  blockSelected:NO_BLOCK_SELECTED,
  copySelected:NO_COPY_SELECTED
};

export const initialValuesTemplate = {
  creator:"man",
  pageSize: "A4",
  name:"New template",
  pageOrientation:"portrait",
  marginLeft:"0mm",
  marginRight:"0mm",
  marginTop:"0mm",
  marginBottom:"0mm",
  zoom:100  
};

export const initialValuesBlock = {
  variableTitle:"",
  valueType:"fixed",
  style:{
    width:"auto",
    height:"auto",
    alignVertical:"inherit",
    alignHorizontal:"inherit",
    displayType:"inherit",
    marginTop:"0mm",
    marginBottom:"0mm",
    marginLeft:"0mm",
    marginRight:"0mm",
    fontFamily:"inherit",
    fontSize:"inherit",
    fontColor:"inherit",
    backgroundColor:"inherit",
    fontBold:"inherit",
    fontItalic:"inherit",
    fontUnderline:"inherit",
    customStyle:""
  }
};