import React from 'react'
import Topbutton from './Topbutton'

function Topmenu(props) {
  return (
    <div className='Topmenu'>
        <div className='templateTools'>
          <Topbutton disabled name='undo' store={props.store}></Topbutton>
          <Topbutton disabled name='redo' store={props.store}></Topbutton>
          <Topbutton name='newBlock' store={props.store}></Topbutton>
          <Topbutton disabled name='ellipse' store={props.store}></Topbutton>
          <Topbutton disabled name='ellipse' store={props.store}></Topbutton>
          <Topbutton disabled name='ellipse' store={props.store}></Topbutton>
        </div>
        <div className='appTools'>
          <Topbutton disabled name='importTemplate' store={props.store}></Topbutton>
          <Topbutton name='newTemplate' store={props.store}></Topbutton>
          <Topbutton disabled name='exportTemplate' store={props.store}></Topbutton>
          <Topbutton disabled name='language' store={props.store}></Topbutton>
          <Topbutton name='settings' store={props.store}></Topbutton>
        </div>
    </div>
  );
}

export default Topmenu;
