import React from 'react'
import Icon from './Icon';
import actionTypes from '../reducers/actionTypes';
function Topbutton(props) {
    var disabled = false;
    if(props.disabled){
        disabled = true;
    }
    switch(props.name){
        case 'removeBlock':
            if(! props.store.getState().app.blockSelected != ''){
                disabled = true;
            }
            break;
    }
    const isDisabled = ()=>{
        if(disabled){
            return 'disabled'
        }else{
            return ''
        }
    }
    const handleClick = ()=>{
        //TODO check if not disabled
        const _blockSelected = props.store.getState().app.blockSelected;
        switch(props.name){
            case 'settings':
                props.store.dispatch({type:actionTypes.COLORMODE_TOGGLE,payload:''});
                break;
            case 'newBlock':
                props.store.dispatch({type:actionTypes.TEMPLATE_NEW_BLOCK_ADD,payload:'',blockSelected:_blockSelected});
                break;
            case 'removeBlock':
                props.store.dispatch({type:actionTypes.SELECTEDBLOCK_SET,payload:''})
                props.store.dispatch({type:actionTypes.TEMPLATE_BLOCK_REMOVE,payload:'',blockSelected:_blockSelected});
                break;
        }
    }
    const handleKeyPress = (e)=>{
        e.key == 'Enter'?handleClick():0;
    }
    const getIcon = ()=>{
        if(props.name == 'settings'){
            if(props.store.getState().app.colorMode == 'light'){
                return <Icon image='darkMode' store={props.store}></Icon>;
            }else{
                return <Icon image='lightMode' store={props.store}></Icon>;
            }
        }else{
            return <Icon image={props.name} store={props.store}></Icon>;
        }
    }
    return (
    <div className={'Topbutton'+ ' tbtn-'+props.name + ' '+ isDisabled()} tabIndex={!disabled?'7':''} onClick={handleClick} onKeyPress={handleKeyPress} title={props.name}>
        {getIcon()}
    </div>
    );
}

export default Topbutton;
