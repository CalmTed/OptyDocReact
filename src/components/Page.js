import React from "react";
import Sidemenu from "./Sidemenu";
import Topmenu from "./Topmenu";
import Stack from "./Stack";

function Page ({store}) {
  const getColorMode = (store) => {
    return store.getState().app.colorMode;
  };
  return (
    <div className={"Page " + getColorMode(store)}>
      <Sidemenu store={store}/>
      <Topmenu store={store}/>
      <Stack store={store}/>
    </div>
  );
}

export default Page;