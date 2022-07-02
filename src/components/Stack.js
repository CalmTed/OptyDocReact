import React from "react";
import t from "../local.ts";
import actionTypes from "../constants/actionTypes";
import {templateSizes, templateOrientations, TAB_NAMES, NO_BLOCK_SELECTED, NO_COPY_SELECTED, TAB_INDEXES} from "../constants/app";
import EditStack from "./EditStack";
import CopyStack from "./CopyStack";

function Stack ({store}) {
  const stateNow = store.getState();
  const zoom = stateNow.template.zoom;
  const fitsOnPage = stateNow.template.fitsH * stateNow.template.fitsW;
  const pagesNeeded = stateNow.copies.rows.length / fitsOnPage;
  const landscape = templateOrientations["landscape"][1];
  const generatePages = () => {
    let ret = [];
    switch(stateNow.app.tabSelected) {
    case TAB_NAMES.edit:
      return <EditStack store={store} />;
    case TAB_NAMES.copy:
    case TAB_NAMES.print:
      if(stateNow.copies.rows.length !== 0 && stateNow.copies.columns.length !== 0) {
        return<CopyStack store={store}/>;
      }else{
        ret.push(<h1 key="placeholder" className="stackPlaceholder">{t("No copy to show")}</h1>);
      }
      break;
    default:
      ret.push(<h1 key="placeholder"   className="stackPlaceholder">{t("Nothing to show")}</h1>);
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
    let pageWidth = sizes[stateNow.template.pageSize][(stateNow.template.pageOrientation === landscape) * 1];
    let pageHeight = sizes[stateNow.template.pageSize][(stateNow.template.pageOrientation !== landscape) * 1];
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
