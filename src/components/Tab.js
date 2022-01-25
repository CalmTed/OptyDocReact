import React from 'react'
import actionTypes from '../reducers/actionTypes';
import t from '../local.ts'
function Tab(props) {
    const state = props.store.getState();

    const getClasses = ()=>{
        let classes = 'Tab ';
        if(state.app.tabSelected == props.tabValue){
            classes += 'active ';
        }
        return classes
    }
    const handleClick = ()=>{
        props.store.dispatch({type:actionTypes.TAB_SET,payload:props.tabValue})
    }
    const handleKeyPress = (e)=>{
        e.key == 'Enter'?handleClick():0;
    }
    return (
    <div className={getClasses()} onClick={handleClick} onKeyPress={handleKeyPress} tabIndex={props.tabIndex}>
        <span>{t(props.tabName)}</span>
    </div>
    );
}

export default Tab;
