import React from 'react'
import Icon from './Icon';

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
        switch(props.name){
            case 'settings':
                props.store.dispatch({type:'colorMode/colormodeToggle',payload:''});
                break;
            case 'newBlock':
                props.store.dispatch({type:'template/newBlockAdd',payload:''});
                break;
            case 'removeBlock':
                let _uuidToDelete = props.store.getState().app.blockSelected;
                props.store.dispatch({type:'stack/selectedBlockSet',payload:''})
                props.store.dispatch({type:'template/blockRemove',payload:'',blockSelected:_uuidToDelete});
                break;
        }
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
    <div className={'Topbutton'+ ' tbtn-'+props.name + ' '+ isDisabled()} onClick={handleClick}>
        {getIcon()}
    </div>
    );
}

export default Topbutton;
