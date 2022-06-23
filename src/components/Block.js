import React from "react";
import actionTypes from "../constants/actionTypes";
import {TAB_NAMES, TAB_INDEXES} from "../constants/app";
import {BLOCK_INHERIT, BLOCK_CONTENT_TYPES, BLOCK_NO_PARENT} from "../constants/block";

function Block ({store, blockData, copyIndex}) {
  const stateNow = store.getState();
  const copyChannel = blockData.copyChannel;
  const tabSelected = stateNow.app.tabSelected;
  const getBlocks = (store, blockData, copyIndex) => {
    let ret = [];
    const hisChildern = stateNow.template.children.filter(ch => { return ch.parentID === blockData.uuid; });
    //no children content
    if(!hisChildern.length) {
      //multiline support
      const formatInnerText = (innerText) => {
        let formatedInnerText = [];
        if(typeof innerText === "undefined") {
          return formatedInnerText;
        }
        if(!innerText.includes("\n")) {
          formatedInnerText.push(innerText);
        }else{
          const getPostfix = (copyIndex) => {
            return typeof copyIndex !== "undefined" ? "_" + copyIndex : "_p";
          };
          if(blockData.valueType === BLOCK_CONTENT_TYPES.selector) {
            formatedInnerText.push(<p key={blockData.uuid} id={blockData.uuid + getPostfix(copyIndex)}>{innerText.split("\n")[0]}</p>);
          }else{
            innerText.split("\n").forEach((_line, i) => {
              formatedInnerText.push(<p key={i} id={blockData.uuid + getPostfix(copyIndex)}>{_line}</p>);
            });
          }
        }
        return formatedInnerText;
      };
      const getTextFromCopyRows = (stateNow, blockUUID, blockCopyIndex) => { //aka. column and row
        //if there is no column or no row we return ''
        //if there is a value we return string
        let copyRowsText = "";
        stateNow.copies.columns.forEach((col, ci) => {
          if(blockUUID + "" === col.target + "") { //looking for right col
            if(typeof stateNow.copies.rows[blockCopyIndex][ci] !== "undefined" && stateNow.copies.rows[blockCopyIndex][ci] !== null) { //looking for right row
              copyRowsText = stateNow.copies.rows[blockCopyIndex][ci];
                            
            }else{
              copyRowsText = stateNow.template.children.filter(ch => { return ch.uuid + "" === blockUUID + ""; })[0].innerText;
            }
          }
        });
        return copyRowsText;
      };
      let getReferenceObject = (stateNow, copyChannel) => {
        let referenceObject = stateNow.template.children.filter(ch => {
          return (ch.valueType !== BLOCK_CONTENT_TYPES.copied) && (ch.copyChannel + "" === copyChannel + "");
        })[0];//if there would be more then one origin object -> select first one
        return referenceObject;
      };
      //if block is copying from another channel
      let isCopyLinked = blockData.valueType === BLOCK_CONTENT_TYPES.copied;
      //if block is a copy of template
      let isCopyIndexed = typeof copyIndex !== "undefined";
      //                    Edit tab           Copy tab
      //not copiLinked    1.innerText        2.getFromCopyRows
      //copyLinked        3.textFromOrigin   4.getOrigin > getFromCopyRows
      if(isCopyLinked) {
        let referenceObject = getReferenceObject(stateNow, copyChannel);
        //if block copies it self
        if(typeof referenceObject === "undefined") {
          referenceObject = blockData;
        }
        if(isCopyIndexed) { //4
                    
          if(referenceObject.valueType !== BLOCK_CONTENT_TYPES.fixed) {
            ret = [...formatInnerText(getTextFromCopyRows(stateNow, referenceObject.uuid, copyIndex))];
          }else{
            ret = [...formatInnerText(referenceObject.innerText)];
          }
        }else{ //3
          ret = [...formatInnerText(referenceObject.innerText)]; 
        }
      }else{
        if(isCopyIndexed) {
          //2
          //TODO is static or variable?
          //add selector if just have options
          //add input(?) if text
          if(blockData.valueType !== BLOCK_CONTENT_TYPES.fixed) {
            ret = [...formatInnerText(getTextFromCopyRows(stateNow, blockData.uuid, copyIndex))];
          }else{
            ret = [...formatInnerText(blockData.innerText)];
          }
        }else{
          //1
          ret = [...formatInnerText(blockData.innerText)];
        }
      }
    }else{
      //if there`re some children, show them
      hisChildern.forEach(childBlock => {
        if(typeof copyIndex !== "undefined") {
          ret.push(<Block key={`${childBlock.uuid}_${copyIndex}`} blockData={childBlock} store={store} copyIndex={copyIndex}/>);
        }else{
          ret.push(<Block key={childBlock.uuid} blockData={childBlock} store={store}/>);
        }
      });
    }
    return ret;
  };
  const getStyle = (blockData, appState, copyIndex, TAB_NAMES) => {
    //TO DO what if the block is too small to select
    let blockStyle = blockData.style;
    let blockOutline = "";
    //showing selected block
    if(blockData.blockUUID === appState.blockSelected && appState.tabSelected === TAB_NAMES.edit) {
      blockOutline = "var(--selected-border)";
    }
    //showing selected copy
    if(blockData.parentID === BLOCK_NO_PARENT && copyIndex + "" === appState.copySelected + "" && appState.tabSelected === TAB_NAMES.copy) {
      blockOutline = "var(--selected-border)";
    }
    const checkForZoom = (_val) => {
      if(_val) {
        //not scaling percentage
        if(_val.substr(-1, 1) === "%") {
          return `${_val}`;
        }else{
          return `calc( ${_val} * var(--zoom) )`;
        }
      }else{
        return "";
      }
    };
    //TODO oplimize this less characters
    let constructedStyle = {};
    constructedStyle = {...constructedStyle,
      ...{
        "--block-border":blockOutline,
        "--block-display":blockStyle.displayType,
        "--block-height":checkForZoom(blockStyle.height),
        "--block-width":checkForZoom(blockStyle.width),
        "--block-marginTop":checkForZoom(blockStyle.marginTop),
        "--block-marginBottom":checkForZoom(blockStyle.marginBottom),
        "--block-marginLeft":checkForZoom(blockStyle.marginLeft),
        "--block-marginRight":checkForZoom(blockStyle.marginRight)
      }};
    const stylesToCheck = {     
      "--block-fontFamily":blockStyle.fontFamily,
      "--block-fontSize":checkForZoom(blockStyle.fontSize),
      "--block-fontColor":blockStyle.fontColor,
      "--block-fontBold":blockStyle.fontBold,
      "--block-fontItalic":blockStyle.fontItalic,
      "--block-fontUnderline":blockStyle.fontUnderline,  
      "--block-backgroundColor":blockStyle.backgroundColor,

      "--block-align":blockStyle.alignVertical,
      "--block-justify":blockStyle.alignHorizontal
    };
    Object.entries(stylesToCheck).forEach(s => {      
      //no need to call all if there is inherit or indeclared
      if(![BLOCK_INHERIT,
        "calc( auto * var(--zoom) )",
        "calc( 0mm * var(--zoom) )"].includes(s[1])) {
        constructedStyle = {...constructedStyle,
          [s[0]]:[s[1]]};
      }
    });
    //custom styles
    blockStyle.customStyle.split("\n").forEach(s => {
      const customStyleArray = s.split(":");      
      if(/^(\w|-){2,20}$/.test(customStyleArray[0]) && !/[[\]{};:]|\d/.test(customStyleArray[0]) && !/[[\]{};:]/.test(customStyleArray[1])) {
        //convering style-case to camelCase
        if(customStyleArray[0].includes("-")) {
          customStyleArray[0] = customStyleArray[0].split("-").map((part, i) => { return i > 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part; }).join("");
        }
        constructedStyle = {...constructedStyle,
          [customStyleArray[0]]:[customStyleArray[1]]};
      }
    });
        
    return constructedStyle;
  };
  const handleClick = (e) => {
    //selectBlock
    //TO DO if it is not a parent
    if((blockData.uuid === Number(e.target.id) || blockData.uuid + "_p" === e.target.id) && stateNow.app.tabSelected === TAB_NAMES.edit) {
      const clickedBlockId = e.target.id.replace("_p", "");
      const clickedBlock = stateNow.template.children.filter(ch => { return ch.uuid === Number(clickedBlockId); })[0];
      store.dispatch({type:actionTypes.SELECTEDBLOCK_SET,
        payload:clickedBlock.uuid});
    }else if(blockData.uuid + "_" + copyIndex === e.target.id && stateNow.app.tabSelected === TAB_NAMES.copy) {
      store.dispatch({type:actionTypes.SELECTEDCOPY_SET,
        payload:copyIndex});            
    }
  };
  const handleKeyPress = (e) => {
    e.key === "Enter" ? handleClick(e) : false;
  };
  const getKey = (copyIndex, blockUUID) => {
    if(typeof copyIndex !== "undefined") {
      return `${blockUUID}_${copyIndex}`;
    }
    return blockUUID;
  };
  const getTitle = (tabSelected, TAB_NAMES, copyIndex, humanfriendlyID) => {
    if(tabSelected === TAB_NAMES.copy) {
      return `Copy ${copyIndex}`;
    }
    return humanfriendlyID;
  };
  return (
    <div 
      id={getKey(copyIndex, blockData.uuid)}
      key={getKey(copyIndex, blockData.uuid)}
      className="Block"
      style={getStyle(blockData, stateNow.app, copyIndex, TAB_NAMES)}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={TAB_INDEXES.block}
      title={getTitle(tabSelected, TAB_NAMES, copyIndex, blockData.humanfriendlyID)}
    >
      {getBlocks(store, blockData, copyIndex)}
    </div>
  );
}

export default Block;
