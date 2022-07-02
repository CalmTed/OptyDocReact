import React from "react";
import Menuitem from "./Menuitem";
import t from "../../local.ts";
import {MI_INPUT_TYPES} from "../../constants/app";

function PrintMenuContent ({store}) {
  let ret = [];
  const stateNow = store.getState();
  if(stateNow.copies.rows.length && stateNow.copies.columns.length) {
    ret.push(<div className='spacer' key='spacerPrint' >{t("Print options")}</div>);
    ret.push(<Menuitem key='print' store={store} value="customAction.print" type={  MI_INPUT_TYPES.button } primary="true" title={t("Print")} icon="print"/>);
  }else{
    ret.push(<div className='spacer' key='spacerNothingToPrint' >{t("Create copy to print")}</div>);
  }
  return ret;
}
export default PrintMenuContent;