import React from "react";
import Icon from "../Icon";
import t from "../../local.ts";
import actionTypes from "../../constants/actionTypes";
import {TAB_NAMES, MI_INPUT_TYPES, NO_BLOCK_SELECTED} from "../../constants/app";
import {BLOCK_INHERIT, BLOCK_CONTENT_TYPES, BLOCK_NO_PARENT} from "../../constants/block";
import {exportCSVFile, importCSVFile} from "../../utils/handleCSVFile";
import {recreateCopiesTitles} from "../../utils/handleCopyesTable";
import TextInput from "../Inputs/TextInput";
import TextareaInput from "../Inputs/TextareaInput";
import SizeInput from "../Inputs/SizeInput";
import ColorInput from "../Inputs/ColorInput";
import SelectInput from "../Inputs/SelectInput";
import ButtonInput from "../Inputs/ButtonInput";
import FileInput from "../Inputs/FileInput";

function Menuitem ({store, value, type, action, placeholder, fileType, columnSelected, icon, primary, title, options, dataList}) {
  const stateNow = store.getState();
  const valueMI = value.split(".");
  const getClasses = () => {
    let ret = "";
    switch(type) {
    case MI_INPUT_TYPES.text:
      ret += "text";
      break;
    case MI_INPUT_TYPES.textarea:
      ret += "textarea";
      break;
    case MI_INPUT_TYPES.selector:
      ret += "selector";
      break;
    case MI_INPUT_TYPES.file:
      ret += "file";
      break;
    default:
      ret += type;
      break;
    }
    return ret;
  };
  const handleMIchange = async (e) => {
    if(valueMI[0] === "customAction") {
      switch(valueMI[1]) {
      case "uploadCSV":
        importCSVFile(e, fileType, stateNow.copies.columns, (formatedTableData) => {
          store.dispatch({type:actionTypes.COPIES_DATA_SET,
            payload:formatedTableData});
        });
        break;
      case "downloadCSV":
        exportCSVFile(
          stateNow.copies.columns.map(col => {
            return col.title;
          }),
          (stateNow.copies.rows.length ? stateNow.copies.rows : [""]),
          stateNow.template.name
        );
        break;
      case "addCopyRow":
        let newRowToAdd = () => {
          return stateNow.copies.columns.map((col) => {
            if(col.type === BLOCK_CONTENT_TYPES.selector) {
              return col.options[0];
            }else if (col.type === BLOCK_CONTENT_TYPES.variable) {
              return stateNow.template.children.filter(ch => { return ch.uuid === Number(col.target); })[0].innerText;
            }else{
              return col.title;
            }
          });
        };
        store.dispatch({type:actionTypes.COPIES_ROW_ADD,
          payload:newRowToAdd(),
          copySelected:stateNow.app.copySelected});
        break;
      case "removeCopyRow":
        store.dispatch({type:actionTypes.COPIES_ROW_REMOVE,
          payload:stateNow.app.copySelected});
        break;
      case "print":
        window.print();
        break;
      default:break;
      }
    }else{
      //manual action handling
      if(action) {
        if(stateNow.app.tabSelected === TAB_NAMES.edit) {
          await store.dispatch({
            type:action,
            payload:e.target.value,
            blockSelected:stateNow.app.blockSelected});
        }else if(stateNow.app.tabSelected === TAB_NAMES.copy) {
          await store.dispatch({
            type:action,
            payload:e.target.value,
            copySelected:stateNow.app.copySelected,
            columnSelected:columnSelected});
        }
        //changing selectedBlock
        if(stateNow.app.blockSelected !== NO_BLOCK_SELECTED) {
          //editing copies columns table
          if(
            ((action === actionTypes.BLOCK_INNER_TEXT_SET) || (action === actionTypes.BLOCK_VALUE_TYPE_SET) || (action === actionTypes.BLOCK_VARIABLE_TITLE_SET))
          ) {
            recreateCopiesTitles(store, actionTypes);
          }
        }
        //calculate how much there might be blocks
        if([actionTypes.BLOCK_WIDTH_SET,
          actionTypes.BLOCK_HEGHT_SET,
          actionTypes.BLOCK_DISPLAY_TYPE_SET,
          actionTypes.BLOCK_MARGIN_TOP_SET,
          actionTypes.BLOCK_MARGIN_BOTTOM_SET,
          actionTypes.BLOCK_MARGIN_LEFT_SET,
          actionTypes.BLOCK_MARGIN_RIGHT_SET].includes(action)) {
                    
          //TODO remove this timeout
          //VERY BAD IMPLEMENTATION
          //but cant access rendered block size b.c. it is not rendered yet 
          setTimeout(() => {
            let farthestHeight = 0;
            let farthestWidth = 0;
            stateNow.template.children.filter(ch => { return ch.parentID === BLOCK_NO_PARENT; }).forEach(rootChild => {
              let childDomObj = document.getElementById(rootChild.uuid);
              // console.log(childDomObj,childDomObj.clientWidth,childDomObj.offsetLeft,childDomObj.clientWidth+childDomObj.offsetLeft)
              // console.log(childDomObj,childDomObj.clientHeight,childDomObj.offsetTop,childDomObj.clientHeight+childDomObj.offsetTop)
              childDomObj.clientWidth + childDomObj.offsetLeft > farthestWidth ? farthestWidth = childDomObj.clientWidth + childDomObj.offsetLeft : false;
              childDomObj.clientHeight + childDomObj.offsetTop > farthestHeight ? farthestHeight = childDomObj.clientHeight + childDomObj.offsetTop : false;
            });
            let pageDomObj = document.querySelector(".PageInner");
            let pageDomObjStyle = getComputedStyle(document.querySelector(".PageInner"));
            let pageDomObjStylePadingWidth = parseInt(pageDomObjStyle.paddingLeft) + parseInt(pageDomObjStyle.paddingRight) + 1;
            let pageDomObjStylePadingHeight = parseInt(pageDomObjStyle.paddingTop) + parseInt(pageDomObjStyle.paddingBottom) + 1;
            let pageInnerWidth = (pageDomObj.clientWidth - pageDomObjStylePadingWidth);
            let pageInnerHeight = (pageDomObj.clientHeight - pageDomObjStylePadingHeight);

            let blockOuterWidth = farthestWidth - parseInt(pageDomObjStyle.paddingLeft) - pageDomObj.offsetLeft + 1;
            let blockOuterHeight = farthestHeight - parseInt(pageDomObjStyle.paddingTop) - pageDomObj.offsetTop + 1;
            // console.log('name','width','height')
            // console.log('page',pageInnerWidth,pageInnerHeight)
            // console.log('block',blockOuterWidth,blockOuterHeight)
            // console.log('diff',pageInnerWidth/blockOuterWidth,pageInnerHeight/blockOuterHeight)
            let fitW = Math.floor(pageInnerWidth / blockOuterWidth);
            let fitH = Math.floor(pageInnerHeight / blockOuterHeight);
            if(fitW === 0 && Math.abs(pageInnerWidth - blockOuterWidth) < 5) { //some error is ok for flex
              fitW = 1;
            }
            if(fitH === 0 && Math.abs(pageInnerHeight - blockOuterHeight) < 5) { //some error is ok for flex
              fitH = 1;
            }
            // console.log(fitH,fitW)
            // console.log('-----')
            store.dispatch({type:actionTypes.TEMPLATE_FITS_W_SET,
              payload:fitW});
            store.dispatch({type:actionTypes.TEMPLATE_FITS_H_SET,
              payload:fitH});
          }, 500);
        }
      }else{
        console.warn("No action specify");
      }
    }
  };
  const getContent = () => {
    let ret = [];
    let getInputValue = () => {
      let ret = "";
      let isInherited = false;
      if(valueMI[0] === "selectedBlock") {
        //search for needed block
        let selectedBlockID = stateNow.app.blockSelected;
        let selectedBlockObject = stateNow.template.children.filter((b) => { return b.uuid === Number(selectedBlockID); })[0];
        if(selectedBlockObject[valueMI[1]]) {
          ret = selectedBlockObject[valueMI[1]];
        }else if(selectedBlockObject.style[valueMI[1]]) {
          ret = selectedBlockObject.style[valueMI[1]];
        }
        const lookForInheritValue = (uuid, property) => {
          let parentObject = stateNow.template.children.find((b) => { return b.uuid === Number(uuid); });
          if(!parentObject) {
            return false;
          }
          if(parentObject.style[property] === BLOCK_INHERIT) {
            if(parentObject.parentID !== BLOCK_NO_PARENT) {
              return lookForInheritValue(parentObject.parentID, property);
            }else{
              return false;
            }
          }else{
            return parentObject.style[property];
          }
        };
        if (ret === BLOCK_INHERIT) {
          const nearestParent = lookForInheritValue(selectedBlockObject.parentID, valueMI[1]);
          isInherited = !!nearestParent;
          ret = nearestParent ? nearestParent : ret;
        }
      }
      if(valueMI[0] === "selectedCopy") {
        let selectedColumnID = 0;
        stateNow.copies.columns.forEach((c, i) => {
          if(c.target === columnSelected) {
            selectedColumnID = i;
          }
        });
        if(typeof stateNow.copies.rows[stateNow.app.copySelected] !== "undefined" && typeof stateNow.copies.rows[stateNow.app.copySelected][selectedColumnID] !== "undefined") {
          ret = stateNow.copies.rows[stateNow.app.copySelected][selectedColumnID];
        }else{
          isInherited = true;
          ret = stateNow.template.children.find((b) => { return Number(b.uuid) === Number(columnSelected); }).innerText;
        }
      }
      if(stateNow[valueMI[0]]) {
        ret =  stateNow[valueMI[0]][valueMI[1]];
      }
      return {
        value: ret,
        isInherited
      };
    };
    const inputValue = getInputValue() || [];
    switch(type) {
    case MI_INPUT_TYPES.text:
      ret.push(<TextInput 
        target={valueMI[1]}
        key={valueMI[1] + "textInputWrapper"}
        className={inputValue.isInherited ? "inherited" : ""}
        value={inputValue.value || ""}
        onChange={handleMIchange}
        placeholder={placeholder}
        title={t(valueMI[1])}
        dataList={dataList}
      />);
      break;
    case MI_INPUT_TYPES.textarea:
      ret.push(<TextareaInput 
        key={valueMI[1] + "TextareaInput"}
        className={`textarea${inputValue.isInherited ? " inherited" : ""}`}
        value={inputValue.value}
        onChange={handleMIchange}
        placeholder={placeholder}
        title={t(valueMI[1])}
      />);
      break;
    case MI_INPUT_TYPES.size:
      ret.push(<SizeInput
        key={valueMI[1] + "SizeInput"}
        className={`size${inputValue.isInherited ? " inherited" : ""}`}
        value={inputValue.value}
        onChange={handleMIchange}
        placeholder={placeholder}
        title={t(valueMI[1])}
      />);
      break;
    case MI_INPUT_TYPES.color:
      ret.push(<ColorInput 
        key={valueMI[1] + "ColorInput"}
        className={`color${inputValue.isInherited ? " inherited" : ""}`}
        value={inputValue.value}
        onChange={handleMIchange}
        placeholder={placeholder}
        title={t(valueMI[1])}
      />);
      break;
    case MI_INPUT_TYPES.selector:
      ret.push(<SelectInput
        key={`${valueMI[1]} SelectorInput`}
        target={valueMI[1]}
        className={inputValue.isInherited ? "inherited" : ""}
        onChange={handleMIchange}
        value={inputValue.value}
        title={valueMI[1]}
        options={options}
      />);
      break;
    case MI_INPUT_TYPES.button:
      ret.push(<ButtonInput
        key={valueMI[1]}
        primary={primary}
        onClick={handleMIchange}
        title={title}
        icon={<Icon image={icon} store={store}/>}
      />);
      break;
    case MI_INPUT_TYPES.file:
      ret.push(<FileInput
        key={value[1]}
        target={valueMI[1]}
        onChange={handleMIchange}
        accept=".csv"
        icon={<Icon image={icon} store={store}/>}
        title={title}
      />);
      break;
    }
    return ret;
  };
  return (
    <div className={`Menuitem ${getClasses()}`}>
      {getContent()}
    </div>
  );
}

export default Menuitem;
