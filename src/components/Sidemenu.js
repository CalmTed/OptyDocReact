import React from 'react'
import Tab from './Tab';

function Sidemenu(props) {
  return (
    <div className='Sidemenu'>
        <div className='tabs'>
          <Tab store={props.store} tabName='edit'/>
          <Tab store={props.store} tabName='copy'/>
          <Tab store={props.store} tabName='print'/>
        </div>
    </div>
  );
}

export default Sidemenu;
