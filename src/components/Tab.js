import React from 'react'

function Tab(props) {
    const state = props.store.getState();

    const getClasses = ()=>{
        let classes = 'Tab ';
        if(state.app.tabSelected == props.tabName){
            classes += 'active ';
        }
        if(state.app.tabSelected)
        return classes
    }
    const handleClick = ()=>{
        props.store.dispatch({type:"menu/tabSet",payload:props.tabName})
    }
    return (
    <div className={getClasses()} onClick={handleClick}>
        <span>{props.tabName}</span>
    </div>
    );
}

export default Tab;
