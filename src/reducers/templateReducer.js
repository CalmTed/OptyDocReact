import actionTypes from "./actionTypes";
import {templateSizes} from "../constants/constants";

const genUUID = () => {
  return Math.round(Math.random() * 10000000);
};
const getinitialState = (newTemp = false) => {
  //SHORTCUT HERE for it to not to store localy
  let getTemplateSizesOptions = (templateSizes) => {
    if(!templateSizes) { return undefined; }
    return templateSizes.map(size => {
      return [size,
        size];
    });
  };
  if(!window.localStorage.getItem("ODStore") || newTemp) {
    return  {
      uuid:genUUID(),
      name:"New template",
      dateCreated:new Date().getTime(),
      dateEdited:"0",
      creator:"man",
      pageSize: typeof templateSizes !== "undefined" ? Object.keys(templateSizes)[0] : "A4",
      pageSizeOptions: typeof templateSizes !== "undefined" ? getTemplateSizesOptions(Object.keys(templateSizes)) : [["A4",
        "A4"]],
      pageOrientation:"portrait",
      pageOrientationOptions:[["Portrait",
        "portrait"],
      ["Landscape",
        "landscape"]],
      marginLeft:"0mm",
      marginRight:"0mm",
      marginTop:"0mm",
      marginBottom:"0mm",
      zoom:100,
      fitsW:0,
      fitsH:0,
      children:[]
    };  
  }else{
    console.debug("Getting app data from localstorage");
    return JSON.parse(window.localStorage.getItem("ODStore")).template;
  } 
};

const templateReducer = (state = getinitialState(), action) => {
  const getNewChildrenList = (property) => {
    let children = new Array(state.children)[0];
    if(!["newBlockAdd",
      "blockRemove"].includes(property)) {
      //just changing children property
      children.map((ch) => {
        if(Number(ch.uuid) === Number(action.blockSelected)) {
          if(typeof ch[property] !== "undefined") {
            ch[property] = action.payload;
          }else{
            ch.style[property] = action.payload;
          }      
        }
      });
    }else{
      //custom comands
      switch(property) {
      case "newBlockAdd":
        const uuid = genUUID();
        const localId = children.length;
        const HFId = "b" + (localId + 1);
        const parentID = action.blockSelected;
        //default new block here
        children.push({
          uuid:uuid,
          localID:localId,
          parentID:parentID, //selected block
          humanfriendlyID:HFId,
          valueType:"fixed",
          valueTypeOptions:[
            ["Fixed",
              "fixed"],
            ["Variable",
              "variable"],
            ["Selector",
              "selector"],
            ["Copy from",
              "copied"]
          ],
          innerText:"b" + localId,
          variableTitle:"",
          copyChannel:HFId,
          style:{
            width:"auto", 
            height:"auto",
            alignVertical:"inherit",
            alignVerticalOptions:[
              ["Inherit",
                "inherit"],
              ["Top",
                "start"],
              ["Center",
                "center"],
              ["Bottom",
                "end"],
              ["Space around",
                "space-around"],
              ["Space between",
                "space-between"],
              ["Space evenly",
                "space-evenly"],
              ["Space evenly",
                "space-evenly"]
            ],
            alignHorizontal:"inherit",
            alignHorizontalOptions:[
              ["Inherit",
                "inherit"],
              ["Left",
                "start"],
              ["Center",
                "center"],
              ["Right",
                "end"],
              ["Space around",
                "space-around"],
              ["Space between",
                "space-between"],
              ["Space evenly",
                "space-evenly"]
            ],
            displayType:"inherit",
            displayTypeOptions:[
              ["Inline",
                "inline"],
              ["Block",
                "block"],
              ["Flex",
                "flex"],
              ["Inherit",
                "inherit"]
            ],
                           
            marginTop:"0mm",
            marginBottom:"0mm",
            marginLeft:"0mm",
            marginRight:"0mm",

            fontFamily:"inherit",
            fontFamilyOptions:[
              ["Arial",
                "Arial"],
              ["Times New Roman",
                "Times New Roman"],
              ["Calibri",
                "Calibri"],
              ["Roboto",
                "Roboto"],
              ["Inherit",
                "inherit"]
            ],
            fontSize:"inherit",
            fontColor:"inherit",
            backgroundColor:"inherit",
            fontBold:"inherit",
            fontBoldOptions:[
              ["Thin",
                "100"],
              ["Normal",
                "400"],
              ["Bold",
                "600"],
              ["Bolder",
                "900"],
              ["Inherit",
                "inherit"]
            ],
            fontItalic:"inherit",
            fontItalicOptions:[
              ["Not italic",
                "none"],
              ["Italic",
                "italic"],
              ["Inherit",
                "inherit"]
            ],
            fontUnderline:"inherit",
            fontUnderlineOptions:[
              ["Non underline",
                "none"],
              ["Underline",
                "underline"],
              ["Inherit",
                "inherit"]
            ],
            customStyle:""
          }
        }); break;
      case "blockRemove":
        const getParentList = (children, parID, parList) => {
          parList.push(parID * 1);//need to convert to number
          children.forEach((ch) => {
            if(ch.parentID === parID) {
              parList = [...getParentList(children, ch.uuid, parList)];
            }
          });
          return parList;
        };
        const getNewChildrenList = (children, parList) => {
          let childrenLess = [];
          children.forEach((ch) => {
            if(parList.indexOf(ch.uuid) > -1) {
              return;
            }else{
              //resorting indexes
              ch.localID = childrenLess.length;
              childrenLess.push(ch);
            }
          });
          return childrenLess;
        };
        const newParList = getParentList(children, action.blockSelected, []);
        children = getNewChildrenList(children, newParList);
      }
    }
    return children;
  };
  const isValidSize = (_value) => {
    //units: mm,cm,in,pt,%
    return /^(\d{0,4})([a-z]{0,7}|%)$/.test(_value);
  };
  const isValidOption = (parameter, payload) => {
    if(typeof state[parameter + "Options"] !== "undefined") {
      return state[parameter + "Options"].map((o) => { return o[1]; }).includes(payload);
    }else {
      let selectedBlock = state.children.filter(ch => ch.uuid + "" === action.blockSelected + "")[0];
      if(typeof selectedBlock[parameter + "Options"] !== "undefined") {
        return selectedBlock[parameter + "Options"].map((o) => { return o[1]; }).includes(payload);
      }else if(typeof selectedBlock.style[parameter + "Options"] !== "undefined") {
        return selectedBlock.style[parameter + "Options"].map((o) => { return o[1]; }).includes(payload);
      }else{
        return false;
      }
    }

  };
  const isValidText = (value) => {
    return !/[<>/{}|]/g.test(value) && value.length < 500;
  };
  const returnMiddleware = (newState) => {
    newState = {...newState,
      dateEdited:new Date().getTime()};
    return newState;
  };
  switch(action.type) {
  case actionTypes.TEMPLATE_OPEN_TEMPLATE:
    let ret = {...getinitialState()};
    Object.keys(action.payload).forEach(k => {
      ret[k] = action.payload[k];
    });
    return returnMiddleware(ret);
  case actionTypes.TEMPLATE_NEW_TEMPLATE:
    return getinitialState(true);
  case actionTypes.TEMPLATE_NEW_BLOCK_ADD:
    return returnMiddleware({...state,
      children:getNewChildrenList("newBlockAdd")});
  case actionTypes.TEMPLATE_BLOCK_REMOVE:
    return returnMiddleware({...state,
      children:getNewChildrenList("blockRemove")});
  case actionTypes.ZOOM_SET:
    //TODO make if functional for scroll
    if(action.payload >= 500) {
      action.payload = 500;
    }
    if(action.payload <= 1) {
      action.payload = 1;
    }
    return {...state,
      zoom:action.payload};
  case actionTypes.TEMPLATE_NAME_SET:    
    if(isValidText(action.payload) && action.payload.length < 40) {
      return returnMiddleware({...state,
        name:action.payload});
    }else{
      return state;
    }
  case actionTypes.TEMPLATE_PAGE_SIZE_SET:
    if(isValidOption("pageSize", action.payload)) {
      return returnMiddleware({...state,
        pageSize:action.payload});
    }else{
      return state;            
    }
  case actionTypes.TEMPLATE_PAGE_ORIENATION_SET:
    if(isValidOption("pageOrientation", action.payload)) {
      return returnMiddleware({...state,
        pageOrientation:action.payload});
    }else{
      return state;
    }
  case actionTypes.TEMPLATE_MARGIN_TOP_SET:
    if(isValidSize(action.payload)) {
      return returnMiddleware({...state,
        marginTop:action.payload});
    }else{
      return state;
    }
  case actionTypes.TEMPLATE_MARGIN_BOTTOM_SET:
    if(isValidSize(action.payload)) {
      return returnMiddleware({...state,
        marginBottom:action.payload});
    }else{
      return state;
    }
  case actionTypes.TEMPLATE_MARGIN_LEFT_SET:
    if(isValidSize(action.payload)) {
      return returnMiddleware({...state,
        marginLeft:action.payload});
    }else{
      return state;
    }
  case actionTypes.TEMPLATE_MARGIN_RIGHT_SET:
    if(isValidSize(action.payload)) {
      return returnMiddleware({...state,
        marginRight:action.payload});
    }else{
      return state;
    }
    //SELECTED BLOCK
  case actionTypes.BLOCK_INNER_TEXT_SET:
    if(isValidText(action.payload)) {
      return returnMiddleware({...state,
        children:getNewChildrenList("innerText")});
    }else{
      return state;
    }
  case actionTypes.BLOCK_WIDTH_SET:
    if(isValidSize(action.payload)) {
      return returnMiddleware({...state,
        children:getNewChildrenList("width")});
    }else{
      return state;
    }
  case actionTypes.BLOCK_HEGHT_SET:
    if(isValidSize(action.payload)) {
      return returnMiddleware({...state,
        children:getNewChildrenList("height")});
    }else{
      return state;
    }
  case actionTypes.BLOCK_ALIGN_VERTICAL_SET:
    if(isValidOption("alignVertical", action.payload)) {
      return returnMiddleware({...state,
        children:getNewChildrenList("alignVertical")});
    }else{
      return state;
    }
  case actionTypes.BLOCK_ALIGN_HORIZONTAL_SET:
    if(isValidOption("alignHorizontal", action.payload)) {
      return returnMiddleware({...state,
        children:getNewChildrenList("alignHorizontal")});
    }else{
      return state;
    }
  case actionTypes.BLOCK_DISPLAY_TYPE_SET:
    if(isValidOption("displayType", action.payload)) {
      return returnMiddleware({...state,
        children:getNewChildrenList("displayType")});
    }else{
      return state;
    }
  case actionTypes.BLOCK_MARGIN_TOP_SET:
    if(isValidSize(action.payload)) {
      return returnMiddleware({...state,
        children:getNewChildrenList("marginTop")});
    }else{
      return state;
    }
  case actionTypes.BLOCK_MARGIN_BOTTOM_SET:
    if(isValidSize(action.payload)) {
      return returnMiddleware({...state,
        children:getNewChildrenList("marginBottom")});
    }else{
      return state;
    }
  case actionTypes.BLOCK_MARGIN_LEFT_SET:
    if(isValidSize(action.payload)) {
      return returnMiddleware({...state,
        children:getNewChildrenList("marginLeft")});
    }else{
      return state;
    }
  case actionTypes.BLOCK_MARGIN_RIGHT_SET:
    if(isValidSize(action.payload)) {
      return returnMiddleware({...state,
        children:getNewChildrenList("marginRight")});
    }else{
      return state;
    }
  case actionTypes.BLOCK_FONT_FAMILY_SET:
    if(isValidOption("fontFamily", action.payload)) {
      return returnMiddleware({...state,
        children:getNewChildrenList("fontFamily")});
    }else{
      return state;
    }
  case actionTypes.BLOCK_FONT_SIZE_SET:
    //TODO validate payload
    if(isValidSize(action.payload)) {
      return returnMiddleware({...state,
        children:getNewChildrenList("fontSize")});
    }else{
      return state;
    }
  case actionTypes.BLOCK_FONT_COLOR_SET:
    if(/#[0-9a-f]{6}/.test(action.payload)) {
      return returnMiddleware({...state,
        children:getNewChildrenList("fontColor")});
    }else{
      return state;
    }
  case actionTypes.BLOCK_BACKGROUND_COLOR_SET:
    if(/#[0-9a-f]{6}/.test(action.payload)) {
      return returnMiddleware({...state,
        children:getNewChildrenList("backgroundColor")});
    }else{
      return state;
    }
  case actionTypes.BLOCK_FONT_BOLD_SET:
    if(isValidOption("fontBold", action.payload)) {
      return returnMiddleware({...state,
        children:getNewChildrenList("fontBold")});
    }else{
      return state;
    }
  case actionTypes.BLOCK_FONT_ITALIC_SET:
    if(isValidOption("fontItalic", action.payload)) {
      return returnMiddleware({...state,
        children:getNewChildrenList("fontItalic")});
    }else{
      return state;
    }
  case actionTypes.BLOCK_FONT_UNDERLINE_SET:
    if(isValidOption("fontUnderline", action.payload)) {
      return returnMiddleware({...state,
        children:getNewChildrenList("fontUnderline")});
    }else{
      return state;
    } 
  case actionTypes.BLOCK_COPY_CHANNEL_SET:
    if(isValidText(action.payload) && action.payload.length < 10) {
      return returnMiddleware({...state,
        children:getNewChildrenList("copyChannel")});
    }else{
      return state;
    }
  case actionTypes.BLOCK_VALUE_TYPE_SET:
    if(isValidOption("valueType", action.payload)) {
      return returnMiddleware({...state,
        children:getNewChildrenList("valueType")});
    }else{
      return state;
    }
  case actionTypes.BLOCK_VARIABLE_TITLE_SET:
    if(action.payload.length < 50) {
      return returnMiddleware({...state,
        children:getNewChildrenList("variableTitle")});
    }else{
      return state;
    }
  case actionTypes.BLOCK_CUSTOM_STYLE_SET:
    if(!/[{}*/\\<>^?@&$~`|]/g.test(action.payload) && action.payload.length < 500) {
      return returnMiddleware({...state,
        children:getNewChildrenList("customStyle")});
    }else{
      return state;
    }
  case actionTypes.TEMPLATE_FITS_H_SET:
    if(/^[\d]{1,10}$/.test(action.payload)) {
      return returnMiddleware({...state,
        fitsH:action.payload});
    }else{
      return state;
    }
  case actionTypes.TEMPLATE_FITS_W_SET:
    if(/^[\d]{1,10}$/.test(action.payload)) {
      return returnMiddleware({...state,
        fitsW:action.payload});
    }else{
      return state;
    }
  default:
    return state;
  }
};

export default templateReducer;