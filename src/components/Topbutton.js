import React from 'react'
import Icon from './Icon';

function Topbutton(props) {
    const isDisabled = ()=>{
        if(props.disabled){
            return 'disabled'
        }else{
            return ''
        }
    }
    const handleClick = ()=>{
        switch(props.name){
            case 'settings':
                props.store.dispatch({type:'colorMode/colormodeToggle',payload:''})
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
