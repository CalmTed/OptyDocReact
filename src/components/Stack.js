import React from "react";
import Block from "./Block";
import t from "../local.ts";
import actionTypes from "../constants/actionTypes";
import {templateSizes, TAB_NAMES, NO_BLOCK_SELECTED, NO_COPY_SELECTED, TAB_INDEXES} from "../constants/app";
import {BLOCK_NO_PARENT} from "../constants/block";

function Stack ({store}) {
  const stateNow = store.getState();
  const zoom = stateNow.template.zoom;
  const fitsOnPage = stateNow.template.fitsH * stateNow.template.fitsW;
  const pagesNeeded = stateNow.copies.rows.length / fitsOnPage;
  const getBlocks = () => {
    let ret = [];
    if(!stateNow.template.children.length) { //no children
      //create inside template
      //for now show nothing
    }else{ //if there`re some children
      //show them
      stateNow.template.children.filter(ch => { return ch.parentID === BLOCK_NO_PARENT; }).forEach(childBlock => {
        ret.push(<Block key={childBlock.uuid} blockData={childBlock} store={store}/>);
      });
    }
    return ret;
  };
  const getCopies = (startFrom = 0, perPage = Infinity) => {
    let ret = [];
    stateNow.copies.rows.forEach((row, ci) => {
      if(ci >= startFrom && ci < startFrom + perPage) {
        stateNow.template.children.filter(ch => { return ch.parentID === BLOCK_NO_PARENT; }).forEach(childBlock => {
          ret.push(<Block key={`${childBlock.uuid}_${ci}`} blockData={childBlock} store={store} copyIndex={ci}/>);
        });
      }
    });
    return ret;
  };
  const generatePages = () => {
    //SHOWiNG
    //if there is no blocks create empty page
    //if there is blocks create page
    //if blocks height larher than page try to split blocks to the next page
    //block can't be heighter then a page
        
    //SELECTING
    //if there is no blocks select page
    //on creating select block
    //create block inside selected object(template or another block)
    //to swap blocks ??? you give it new order_id
    let ret = [];
    switch(stateNow.app.tabSelected) {
    case TAB_NAMES.edit:
      ret.push(<div key='1' className='PageWrapper'><div className='PageInner'>{getBlocks()}</div></div>);
      break;
    case TAB_NAMES.copy:
    case TAB_NAMES.print:
      if(stateNow.copies.rows.length !== 0 && stateNow.copies.columns.length !== 0) {
        //get copies rows length / copies per page
        if(fitsOnPage > 0 && pagesNeeded > 1) {
          for(let copyPageIndex = 0; copyPageIndex < pagesNeeded; copyPageIndex++) {
            ret.push(<div key={"copyPage" + copyPageIndex} className='PageWrapper'><div className='PageInner'>{getCopies(fitsOnPage * copyPageIndex, fitsOnPage)}</div></div>);
          }
        }else{
          ret.push(<div key='1' className='PageWrapper'><div className='PageInner'>{getCopies()}</div></div>);
        }
      }else{
        ret.push(<h1 key='placeholder' className='stackPlaceholder'>{t("No copy to show")}</h1>);
      }
      break;
    default:
      ret.push(<h1 key='placeholder'   className='stackPlaceholder'>{t("Nothing to show")}</h1>);
      break;
    }
        
    return ret;
  };
  const handleClick = (e) => {
    // unselect Block
    if(e.target.classList.contains("Stack")) {
      if(stateNow.app.tabSelected === TAB_NAMES.edit) {
        store.dispatch({type:actionTypes.SELECTEDBLOCK_SET,
          payload:NO_BLOCK_SELECTED});
      }else if(stateNow.app.tabSelected === TAB_NAMES.copy) {
        store.dispatch({type:actionTypes.SELECTEDCOPY_SET,
          payload:NO_COPY_SELECTED});
      }
    }
        
  };
  const getStyle = (templateSizes, stateNow) => {
    let sizes = templateSizes;
    let pageWidth = sizes[stateNow.template.pageSize][(stateNow.template.pageOrientation === "landscape") * 1];
    let pageHeight = sizes[stateNow.template.pageSize][(stateNow.template.pageOrientation !== "landscape") * 1];
    const checkForZoom = (sizeValue) => {
      sizeValue += "";
      if(sizeValue) {
        if(sizeValue.substr(-1, 1) === "%") {
          return `${sizeValue}`;
        }else{
          return `calc( ${sizeValue} * var(--zoom) )`;
        }
      }else{
        return "";
      }
    };
    let styleList = {
      "--zoom":zoom / 100,
      "--page-wrapper-height":checkForZoom(pageHeight),
      "--page-wrapper-width":checkForZoom(pageWidth),
      "--page-margin-top":checkForZoom(stateNow.template.marginTop),
      "--page-margin-bottom":checkForZoom(stateNow.template.marginBottom),
      "--page-margin-left":checkForZoom(stateNow.template.marginLeft),
      "--page-margin-right":checkForZoom(stateNow.template.marginRight)
      // '--stack-height':`calc(${pagesNeeded} * ${pageHeight})`
    };
    if(stateNow.app.tabSelected === TAB_NAMES.print) {
      styleList["--stack-height"] = `calc(${pagesNeeded} * ${pageHeight})`;
      styleList["--text-color"] = "rgb(26, 26, 26)";
      styleList["--menu-backcolor"] = "rgb(254,254,254)";
      styleList["--paper-backcolor"] = "var(--menu-backcolor)";
    }
    return styleList;
  };
  return (
    <div className="Stack" onClick={handleClick} onKeyPress={(e) => { e.key === "Enter" ? handleClick(e) : 0; }} tabIndex={TAB_INDEXES.stack} style={getStyle(templateSizes, stateNow)}>
      {generatePages()}
    </div>
  );
}

export default Stack;
