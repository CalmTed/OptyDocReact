import React from "react";
import Menuitem from "./Menuitem";
import t from "../../local.ts";
import actionTypes from "../../constants/actionTypes";
import {MI_INPUT_TYPES, templateSizes, templateOrientations, NO_BLOCK_SELECTED} from "../../constants/app";
import {BLOCK_STYLE_NAMES, BLOCK_CONTENT_TYPES, BLOCK_STYLE_SETTINGS, BLOCK_VALUE_TYPE_OPTIONS, BLOCK_NO_PARENT} from "../../constants/block";

const EditMenuContent = ({store}) => {
  const ret = [];
  const stateNow = store.getState();
  const selectBlock = e => {
    store.dispatch({type:actionTypes.SELECTEDBLOCK_SET,
      payload:e.target.id.replace("_link", "")});
  };
  const createBlockLink = (uuid, _title) => {
    return <span id={uuid + "_link"} className='blockLink' key={uuid} onClick={selectBlock}>{_title}</span>;
  };
  var blockSelectedChildrenList = [];
  var blockSelectedNeigborList = [];
  if(stateNow.app.blockSelected === NO_BLOCK_SELECTED || !stateNow.template.children.length) {
    //TEMPLATE SETINGS
    // const pageSizeOptions = 
    let getTemplateSizesOptions = (templateSizes) => {
      if(!templateSizes) { return undefined; }
      return Object.keys(templateSizes).map(size => {
        return [size,
          size];
      });
    };
    let getTemplateOrientationOptions = (templateOrientations) => {
      if(!templateOrientations) { return undefined; }
      return Object.values(templateOrientations).map(([title, value]) => {
        return [title, value];
      });
    };
    ret.push(<div className='spacer' key='spacerTemplate' >{t("Template")}</div>);
    ret.push(<Menuitem key='name' store={store} value="template.name" action={actionTypes.TEMPLATE_NAME_SET} type={ MI_INPUT_TYPES.text } placeholder="Template name" />);
    ret.push(<Menuitem key='pageSize' store={store} value="template.pageSize" action={actionTypes.TEMPLATE_PAGE_SIZE_SET} type={ MI_INPUT_TYPES.selector } options={ getTemplateSizesOptions(templateSizes) } />);
    ret.push(<Menuitem key='pageOrientation' store={store} value="template.pageOrientation" action={actionTypes.TEMPLATE_PAGE_ORIENATION_SET} type={ MI_INPUT_TYPES.selector } options={ getTemplateOrientationOptions(templateOrientations) } />);
    ret.push(<div className='spacer' key='spacerMargin' >{t("Margin")}</div>);
    ret.push(<Menuitem key='marginTop' store={store} value="template.marginTop" action={actionTypes.TEMPLATE_MARGIN_TOP_SET} type={ MI_INPUT_TYPES.size } placeholder="M top" />);
    ret.push(<Menuitem key='marginBottom' store={store} value="template.marginBottom" action={actionTypes.TEMPLATE_MARGIN_BOTTOM_SET} type={ MI_INPUT_TYPES.size } placeholder="M bottom" />);
    ret.push(<Menuitem key='marginLeft' store={store} value="template.marginLeft" action={actionTypes.TEMPLATE_MARGIN_LEFT_SET} type={ MI_INPUT_TYPES.size } placeholder="M left" />);
    ret.push(<Menuitem key='marginRight' store={store} value="template.marginRight" action={actionTypes.TEMPLATE_MARGIN_RIGHT_SET} type={ MI_INPUT_TYPES.size } placeholder="M right" />);
    
    stateNow.template.children.forEach(ch => {
      if(ch.parentID === BLOCK_NO_PARENT) {
        blockSelectedChildrenList.push(ch);
      }
    });
    if(blockSelectedChildrenList.length) {
      ret.push(<div className='blockNavigator' key='children'><div className='blockChildren'>{t("Children: ")}{blockSelectedChildrenList.map(chi => {
        let chilrderList = [];
        chilrderList.push(createBlockLink(chi.uuid, chi.humanfriendlyID));
        return chilrderList;
      })}</div></div>);
    }
  }else{
    //SELECTED BLOCK SETTINGS
    const blockSelectedObject = stateNow.template.children.filter(ch => { return Number(ch.uuid) === Number(stateNow.app.blockSelected); })[0];
    var blockSelectedParentObject = BLOCK_NO_PARENT;
    stateNow.template.children.forEach(ch => {
      if(Number(ch.parentID) === Number(blockSelectedObject.uuid)) { //get all children
        blockSelectedChildrenList.push(ch);
      }
      if(ch.parentID === blockSelectedObject.parentID && ch.uuid !== blockSelectedObject.uuid) { //get all with the same parent
        blockSelectedNeigborList.push(ch);
      }
      if(ch.uuid === Number(blockSelectedObject.parentID)) { //get all neigbors
        blockSelectedParentObject = ch;
      }
    });
    
    const getNavLinks = (blockSelectedObject, blockSelectedParentObject, blockSelectedNeigborList, blockSelectedChildrenList) => {    
      let navLinks = [];
      navLinks.push(<div key='name' className='blockName'>{t("Block: ")}{blockSelectedObject.humanfriendlyID}</div>);
  
      if(blockSelectedParentObject !== BLOCK_NO_PARENT) {
        navLinks.push(<div key='parent' className='blockParent'>{t("Parent: ")}{createBlockLink(blockSelectedParentObject.uuid, blockSelectedParentObject.humanfriendlyID)}</div>);
      }
      if(blockSelectedNeigborList.length) {
        navLinks.push(<div key='neigbor' className='blockNeigbor'>{t("Neigbors: ")}{blockSelectedNeigborList.map(nei => {
          let neigborList = [];
          neigborList.push(createBlockLink(nei.uuid, nei.humanfriendlyID));
          return neigborList;
        })}</div>);
      }
      if(blockSelectedChildrenList.length) {
        navLinks.push(<div key='children' className='blockChildren'>{t("Children: ")}{blockSelectedChildrenList.map(chi => {
          let childrenList = [];
          childrenList.push(createBlockLink(chi.uuid, chi.humanfriendlyID));
          return childrenList;
        })}</div>);
      }
      return navLinks;
    };
    ret.push(<div key='nav' className="blockNavigator" >{
      getNavLinks(blockSelectedObject, blockSelectedParentObject, blockSelectedNeigborList, blockSelectedChildrenList)
    }</div>);
    const genBlockMI = (miData) => {
      //miData: value,type,action
      let miPlaceholder = miData.value;
      let miOptions = typeof miData.options !== "undefined" ? miData.options : [];
      ret.push(<Menuitem 
        key={miData.value} 
        store={store} 
        value= {"selectedBlock." + miData.value} 
        type={miData.type} 
        action={miData.action} 
        dataList={miData.dataList}
        placeholder={miPlaceholder} 
        options={miOptions}
      />);
    };
    genBlockMI({value: BLOCK_STYLE_NAMES.width,
      type: MI_INPUT_TYPES.size,
      action:actionTypes.BLOCK_WIDTH_SET});
    genBlockMI({value: BLOCK_STYLE_NAMES.height,
      type: MI_INPUT_TYPES.size,
      action:actionTypes.BLOCK_HEGHT_SET});
    genBlockMI({value: BLOCK_STYLE_NAMES.displayType,
      type: MI_INPUT_TYPES.selector,
      action:actionTypes.BLOCK_DISPLAY_TYPE_SET,
      options: BLOCK_STYLE_SETTINGS[BLOCK_STYLE_NAMES.displayType].selectorOptions
    });
    genBlockMI({value:BLOCK_STYLE_NAMES.backgroundColor,
      type: MI_INPUT_TYPES.color,
      action:actionTypes.BLOCK_BACKGROUND_COLOR_SET});
    if(blockSelectedObject.style.displayType !== "inline") { // TODO change to constant
      ret.push(<div className='spacer' key='spacerAlign' >{t("Align")}</div>);
      genBlockMI({value: BLOCK_STYLE_NAMES.alignVertical,
        type: MI_INPUT_TYPES.selector,
        action:actionTypes.BLOCK_ALIGN_VERTICAL_SET,
        options: BLOCK_STYLE_SETTINGS[BLOCK_STYLE_NAMES.alignVertical].selectorOptions
      });
      genBlockMI({value: BLOCK_STYLE_NAMES.alignHorizontal,
        type: MI_INPUT_TYPES.selector,
        action:actionTypes.BLOCK_ALIGN_HORIZONTAL_SET,
        options: BLOCK_STYLE_SETTINGS[BLOCK_STYLE_NAMES.alignHorizontal].selectorOptions
      });
      ret.push(<div className='spacer' key='spacerMargin' >{t("Margin")}</div>);
      genBlockMI({value: BLOCK_STYLE_NAMES.marginTop,
        type: MI_INPUT_TYPES.size,
        action:actionTypes.BLOCK_MARGIN_TOP_SET});
      genBlockMI({value: BLOCK_STYLE_NAMES.marginBottom,
        type: MI_INPUT_TYPES.size,
        action:actionTypes.BLOCK_MARGIN_BOTTOM_SET});
      genBlockMI({value: BLOCK_STYLE_NAMES.marginLeft,
        type: MI_INPUT_TYPES.size,
        action:actionTypes.BLOCK_MARGIN_LEFT_SET});
      genBlockMI({value: BLOCK_STYLE_NAMES.marginRight,
        type: MI_INPUT_TYPES.size,
        action:actionTypes.BLOCK_MARGIN_RIGHT_SET});
    }
    ret.push(<div className='spacer' key='spacerText' >{t("Text")}</div>);
    genBlockMI({value: BLOCK_STYLE_NAMES.fontFamily,
      type: MI_INPUT_TYPES.selector,
      action:actionTypes.BLOCK_FONT_FAMILY_SET,
      options: BLOCK_STYLE_SETTINGS[BLOCK_STYLE_NAMES.fontFamily].selectorOptions
    });
    genBlockMI({value: BLOCK_STYLE_NAMES.fontSize,
      type: MI_INPUT_TYPES.size,
      action:actionTypes.BLOCK_FONT_SIZE_SET});
    genBlockMI({value: BLOCK_STYLE_NAMES.fontColor,
      type: MI_INPUT_TYPES.color,
      action:actionTypes.BLOCK_FONT_COLOR_SET});
    genBlockMI({value: BLOCK_STYLE_NAMES.fontBold,
      type: MI_INPUT_TYPES.selector,
      action:actionTypes.BLOCK_FONT_BOLD_SET,
      options: BLOCK_STYLE_SETTINGS[BLOCK_STYLE_NAMES.fontBold].selectorOptions
    });
    genBlockMI({value: BLOCK_STYLE_NAMES.fontItalic,
      type: MI_INPUT_TYPES.selector,
      action:actionTypes.BLOCK_FONT_ITALIC_SET,
      options: BLOCK_STYLE_SETTINGS[BLOCK_STYLE_NAMES.fontItalic].selectorOptions
    });
    genBlockMI({value: BLOCK_STYLE_NAMES.fontUnderline,
      type: MI_INPUT_TYPES.selector,
      action:actionTypes.BLOCK_FONT_UNDERLINE_SET,
      options: BLOCK_STYLE_SETTINGS[BLOCK_STYLE_NAMES.fontUnderline].selectorOptions
    });
    
    if(!blockSelectedChildrenList.length) {
      ret.push(<div className='spacer' key='spacerContent' >{t("Content")}</div>);
      genBlockMI({value: "valueType",
        type: MI_INPUT_TYPES.selector,
        action:actionTypes.BLOCK_VALUE_TYPE_SET,
        options:Object.values(BLOCK_VALUE_TYPE_OPTIONS)
      });
      if(blockSelectedObject.valueType !== BLOCK_CONTENT_TYPES.copied) { //if block is not copying from another
        if(blockSelectedObject.valueType !== BLOCK_CONTENT_TYPES.fixed) { //if value is variable

          genBlockMI({value:"variableTitle",
            type: MI_INPUT_TYPES.text,
            action:actionTypes.BLOCK_VARIABLE_TITLE_SET});
          genBlockMI({value:"innerText",
            type: MI_INPUT_TYPES.textarea,
            action:actionTypes.BLOCK_INNER_TEXT_SET});
        }else{
          genBlockMI({value:"innerText",
            type: MI_INPUT_TYPES.textarea,
            action:actionTypes.BLOCK_INNER_TEXT_SET});
        }
      }else{
        //TODO check which copy channels exists
        const getLinksOptions = (stateNow, blockSelectedObject) => {
          //loop though the children and find ones not copying
          return stateNow.template.children.filter(ch => {
            return ch.valueType !== BLOCK_CONTENT_TYPES.copied || (ch.uuid !== Number(blockSelectedObject.uuid)); 
          }).map(ch => {
            return ch.copyChannel;
          }).filter((value, index, self) => {
            return (self.indexOf(value) >= index && value.length > 0) || false; 
          }).map(ch => {
            return [ch];
          });
        };
        //show link if it is
        genBlockMI({
          value:"copyChannel",
          type: MI_INPUT_TYPES.text,
          action:actionTypes.BLOCK_COPY_CHANNEL_SET,
          dataList:getLinksOptions(stateNow, blockSelectedObject)
        });
      }
    }
    ret.push(<div className='spacer' key='spacerCustomCSS' >{t("Custom CSS")}</div>);
    genBlockMI({value:"customStyle",
      type: MI_INPUT_TYPES.textarea,
      action:actionTypes.BLOCK_CUSTOM_STYLE_SET});
  }
  return ret;
};

export default EditMenuContent;