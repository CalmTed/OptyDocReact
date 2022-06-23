import React from "react";
import Tab from "./Tab";
import Menuitem from "./Menuitem";
import actionTypes from "../constants/actionTypes";
import t from "../local.ts";
import {TAB_NAMES, tabOptions, MI_INPUT_TYPES, templateSizes, templateOrientations} from "../constants/app";
import {BLOCK_STYLE_NAMES, BLOCK_STYLE_SETTINGS, BLOCK_VALUE_TYPE_OPTIONS} from "../constants/block";

function Sidemenu ({store}) {
  const stateNow = store.getState();
  const getEditMenuContent = () => {
    let ret = [];
    const selectBlock = e => {
      store.dispatch({type:actionTypes.SELECTEDBLOCK_SET,
        payload:e.target.id.replace("_link", "")});
    };
    const createBlockLink = (uuid, _title) => {
      return <span id={uuid + "_link"} className='blockLink' key={uuid} onClick={selectBlock}>{_title}</span>;
    };
    var blockSelectedChildrenList = [];
    var blockSelectedNeigborList = [];
    if(stateNow.app.blockSelected === "" || !stateNow.template.children.length) {
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
        if(ch.parentID === "") {
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
      var blockSelectedParentObject = "";
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
    
        if(blockSelectedParentObject !== "") {
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
      if(blockSelectedObject.style.displayType !== "inline") {
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
        if(blockSelectedObject.valueType !== "copied") { //if block is not copying from another
          if(blockSelectedObject.valueType !== "fixed") { //if value is variable

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
            return stateNow.template.children.filter(ch => { return ch.valueType !== "copied" || (ch.uuid === Number(blockSelectedObject.uuid)); }).map(ch => { return [ch.copyChannel,
              ch.copyChannel]; });
          };
          //show link if it is
          genBlockMI({value:"copyChannel",
            type: MI_INPUT_TYPES.text,
            action:actionTypes.BLOCK_COPY_CHANNEL_SET,
            options:getLinksOptions(stateNow, blockSelectedObject)});
        }
      }
      ret.push(<div className='spacer' key='spacerCustomCSS' >{t("Custom CSS")}</div>);
      genBlockMI({value:"customStyle",
        type: MI_INPUT_TYPES.textarea,
        action:actionTypes.BLOCK_CUSTOM_STYLE_SET});
    }
    return ret;
  };
  const getCopyMenuContent = () => {
    let ret = [];
    if(!stateNow.copies.columns.length) {
      ret.push(<div className='spacer' key='spacerCopyInfo' >{t("Create variable block to add copy")}</div>);
    }else{
      ret.push(<div className='spacer' key='spacerCopyData' >{t("Data to copy")}</div>);
      ret.push(<Menuitem key='selectCSV' store={store} value="customAction.uploadCSV" type={ MI_INPUT_TYPES.file } fileType='csv' primary="true" title={t("Select CSV")} icon="hash"/>);
      ret.push(<Menuitem key='downloadCSV' store={store} value="customAction.downloadCSV" type={ MI_INPUT_TYPES.button }  title="" icon="download"/>);
      if(!stateNow.copies.rows.length) {
        ret.push(<Menuitem key='addCopyRow' store={store} value="customAction.addCopyRow" action='' type={ MI_INPUT_TYPES.button }  title={t("Add copy")} icon="add"/>);    
      }else{
        ret.push(<div className='spacer' key='spacerCopyList' >{t("Copy")}</div>);
        const copyOptions = () => {
          let copyOptions = [["Unselected",
            ""]];
          copyOptions = copyOptions.concat(stateNow.copies.rows.map((r, i) => {
            return [t("Copy") + " " + i,
              i];
          }));
          return copyOptions;
        };
        ret.push(<Menuitem key='copySelector' store={store} value="app.copySelected" action={actionTypes.SELECTEDCOPY_SET} type={ MI_INPUT_TYPES.selector } fileType='csv' primary="true" title={t("Select CSV")} options={copyOptions()}/>);
        ret.push(<Menuitem key='addCopyRow' store={store} value="customAction.addCopyRow"  type={ MI_INPUT_TYPES.button }  title="" icon="add"/>);   
        if(stateNow.app.copySelected + "" !== "") {
          ret.push(<Menuitem key='removeCopyRow' store={store} value="customAction.removeCopyRow"  type={ MI_INPUT_TYPES.button }  title="" icon="remove"/>);    
        }
        if(stateNow.app.copySelected + "" !== "" && typeof stateNow.copies.rows[stateNow.app.copySelected] !== "undefined") {
          stateNow.copies.columns.forEach((col) => {
            const getMiType  = (colType) => {
              switch(colType) {
              case BLOCK_VALUE_TYPE_OPTIONS.variable[1]:
                return MI_INPUT_TYPES.text;
              case BLOCK_VALUE_TYPE_OPTIONS.selector[1]:
                return MI_INPUT_TYPES.selector;
              default:
                return MI_INPUT_TYPES.text;
              }
            };
            const getOptions = (colOptions) => {
              let miOptions = colOptions.map(o => { return [o,
                o]; });
              return miOptions;
            };
            const getDataList = () => {
              const colId = stateNow.copies.columns.indexOf(stateNow.copies.columns.find(c => Number(c.target) === Number(col.target)));
              let datalist = [];
              datalist = stateNow.copies.rows.map(row => row[colId]).filter((value, index, self) => { return (self.indexOf(value) === index && value?.length > 0) || false; });
              return datalist;
            };
            ret.push(<div className='spacer' key={"spacerInput" + col.target} >{col.title}</div>);
            ret.push(<Menuitem key={col.target + "CopyInput"} store={store} value={"selectedCopy." + col.target} action={actionTypes.COPIES_ROW_SET} columnSelected={col.target} type={getMiType(col.type)} options={getOptions(col.options)} dataList={getDataList()}/>);
          });
        }
      }
    }

    return ret;
  };
  const getPrintMenuContent = () => {
    let ret = [];
    if(stateNow.copies.rows.length && stateNow.copies.columns.length) {
      ret.push(<div className='spacer' key='spacerPrint' >{t("Print options")}</div>);
      ret.push(<Menuitem key='print' store={store} value="customAction.print" type={  MI_INPUT_TYPES.button } primary="true" title={t("Print")} icon="print"/>);
    }else{
      ret.push(<div className='spacer' key='spacerNothingToPrint' >{t("Create copy to print")}</div>);
    }
    return ret;
  };
  const getSitemenuContent = () => {
    let ret = [];
    switch (stateNow.app.tabSelected) {
    case TAB_NAMES.edit:
      ret = [...getEditMenuContent()];
      break;
    case TAB_NAMES.copy:
      ret = [...getCopyMenuContent()];
      break;
    case TAB_NAMES.print:
      ret = [...getPrintMenuContent()];
      break;
    default:
      ret.push(<div className='spacer' key='spacerNoTabSelected' >{t("No tab selected")}</div>);
      break;
    }
    return ret;
  };
  return (
    <div className='Sidemenu'>
      <div className='tabs'>
        {tabOptions.map(([tabTitle,
          tabValue], i) => {
          return <Tab tabIndex={i + 1} key={tabValue} store={store} tabName={tabTitle} tabValue={tabValue}/>;
        })}
      </div>
      <div className='menuitems'>
        {getSitemenuContent()}
      </div>
    </div>
  );
}

export default Sidemenu;
