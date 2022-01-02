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
    return (
    <div className={'Topbutton'+ ' tbtn-'+props.name + ' '+ isDisabled()}>
        <Icon image={props.name} store={props.store}></Icon>
    </div>
    );
}

export default Topbutton;
