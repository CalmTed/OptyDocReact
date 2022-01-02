import React from 'react'
import Sidemenu from './Sidemenu';
import Topmenu from './Topmenu';
import Stack from './Stack';

function Page(props) {
  return (
    <div className="Page">
       <Sidemenu store={props.store}/>
       <Topmenu store={props.store}/>
       <Stack store={props.store}/>
    </div>
  );
}

export default Page;