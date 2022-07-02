import React from "react";
import Tab from "../Tab";
import t from "../../local.ts";
import {TAB_NAMES, tabOptions, TAB_INDEXES} from "../../constants/app";
import EditMenuContent from "./EditMenuContent";
import CopyMenuContent from "./CopyMenuContent";
import PrintMenuContent from "./PrintMenuContent";

function Sidemenu ({store}) {
  const stateNow = store.getState();
  const getSitemenuContent = (tabSelected) => {
    switch (tabSelected) {
    case TAB_NAMES.edit:
      return <EditMenuContent store={store} />;
    case TAB_NAMES.copy:
      return <CopyMenuContent store={store} />;
    case TAB_NAMES.print:
      return <PrintMenuContent store={store} />;
    default:
      return <div className='spacer' key='spacerNoTabSelected' >{t("No tab selected")}</div>;
    }
  };
  return (
    <div className='Sidemenu'>
      <div className='tabs'>
        {tabOptions.map(([tabTitle,
          tabValue], i) => {
          return <Tab tabIndex={i + TAB_INDEXES.tabs} key={tabValue} store={store} tabName={tabTitle} tabValue={tabValue}/>;
        })}
      </div>
      <div className='menuitems'>
        {getSitemenuContent(stateNow.app.tabSelected)}
      </div>
    </div>
  );
}

export default Sidemenu;
