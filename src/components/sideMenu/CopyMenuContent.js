import React from "react";
import Menuitem from "./Menuitem";
import t from "../../local.ts";
import actionTypes from "../../constants/actionTypes";
import {MI_INPUT_TYPES, NO_COPY_SELECTED} from "../../constants/app";
import {BLOCK_VALUE_TYPE_OPTIONS} from "../../constants/block";

function CopyMenuContent ({store}) {
  let ret = [];
  const stateNow = store.getState();
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
          NO_COPY_SELECTED]];
        copyOptions = copyOptions.concat(stateNow.copies.rows.map((r, i) => {
          return [`${t("Copy")} ${i}`,
            i];
        }));
        return copyOptions;
      };
      ret.push(<Menuitem key='copySelector' store={store} value="app.copySelected" action={actionTypes.SELECTEDCOPY_SET} type={ MI_INPUT_TYPES.selector } fileType='csv' primary="true" title={t("Select CSV")} options={copyOptions()}/>);
      ret.push(<Menuitem key='addCopyRow' store={store} value="customAction.addCopyRow"  type={ MI_INPUT_TYPES.button }  title="" icon="add"/>);   
      if(stateNow.app.copySelected !== NO_COPY_SELECTED) {
        ret.push(<Menuitem key='removeCopyRow' store={store} value="customAction.removeCopyRow"  type={ MI_INPUT_TYPES.button }  title="" icon="remove"/>);    
      }
      if(stateNow.app.copySelected !== NO_COPY_SELECTED && typeof stateNow.copies.rows[stateNow.app.copySelected] !== "undefined") {
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
            datalist = stateNow.copies.rows.map(row => {
              return row[colId];
            }).filter((value, index, self) => {
              return (self.indexOf(value) >= index && value?.length > 0) || false;
            });
            return datalist;
          };
          ret.push(<div className='spacer' key={"spacerInput" + col.target} >{col.title}</div>);
          ret.push(<Menuitem key={col.target + "CopyInput"} store={store} value={"selectedCopy." + col.target} action={actionTypes.COPIES_ROW_SET} columnSelected={col.target} type={getMiType(col.type)} options={getOptions(col.options)} dataList={getDataList()}/>);
        });
      }
    }
  }
  return ret;
}
export default CopyMenuContent;