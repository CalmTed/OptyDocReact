import React from 'react'
import Topbutton from './Topbutton'

function Topmenu(props) {
  const getTabTools = ()=>{
    let ret = []
    if(props.store.getState().app.tabSelected == 'edit'){
        ret.push(<Topbutton key='1' name='newBlock' store={props.store}></Topbutton>)
        ret.push(<Topbutton key='2' name='removeBlock' store={props.store}></Topbutton>)
    }
    return ret;
  }
  return (
    <div className='Topmenu'>
        <div className='templateTools'>
          <Topbutton disabled name='undo' store={props.store}></Topbutton>
          <Topbutton disabled name='redo' store={props.store}></Topbutton>
          {getTabTools()}
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
