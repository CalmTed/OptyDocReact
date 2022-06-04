import React from 'react'
import Topbutton from './Topbutton'
import { TAB_NAMES } from '../constants/constants'

function Topmenu(props) {
  const getTabTools = ()=>{
    let ret = []
    if(props.store.getState().app.tabSelected == TAB_NAMES.edit){
        ret.push(<Topbutton key='1' name='newBlock' store={props.store}></Topbutton>)
        ret.push(<Topbutton key='2' name='removeBlock' store={props.store}></Topbutton>)
    }
    return ret;
  }
  const getTemplateTools = ()=>{
    let ret = [];
    const isExportDisabled = ()=>{
      return props.store.getState().template.dateEdited === '0'?{disabled:true}:{};
    }
    ret.push(<Topbutton key='importTemplateButton' name='importTemplate' store={props.store}></Topbutton>)
    ret.push(<Topbutton key='newTemplateButton' name='newTemplate' store={props.store}></Topbutton>)    
    ret.push(<Topbutton {...isExportDisabled()} key='exportTemplateButton' name='exportTemplate' store={props.store}></Topbutton>)
    return ret;
  }
  const getLangButton = ()=>{
    if(Object.keys(props.store.getState().app.languageWords).length > 0){
      return <Topbutton name='language' store={props.store}></Topbutton>
    }else{
      return <Topbutton disabled name='language' store={props.store}></Topbutton>
    }
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
          {getTemplateTools()}
          {getLangButton()}
          <Topbutton name='settings' store={props.store}></Topbutton>
        </div>
    </div>
  );
}

export default Topmenu;
