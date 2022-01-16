import React from 'react'
// import Icon from './Icon';

function Menuitem(props) {
    const store = props.store.getState();
    const target = props.value.split('.');
    const getClasses = ()=>{
        let ret = '';
        switch(props.type){
            case 'text':
                ret +='text'
                break;
            case 'textarea':
                ret +='textarea'
                break;
            case 'selector':
                ret +='selector'
                break;
        }
        return ret;
    }
    const handleMIchange = (e)=>{
        props.store.dispatch({type:target.join('/')+'Set',payload:e.target.value,blockSelected:store.app.blockSelected})
    }
    const getContent = ()=>{
        let ret = [];

        let inputValue = ()=>{
            let ret = ''
            if(target[0] == 'selectedBlock'){
                //search for needed block
                let selectedBlockID = store.app.blockSelected;
                let selectedBlockObject = store.template.children.filter((b)=>{return b.uuid == selectedBlockID})[0]
                if(selectedBlockObject[target[1]]){
                    ret = selectedBlockObject[target[1]];
                }else if(selectedBlockObject.style[target[1]]){
                    ret = selectedBlockObject.style[target[1]];
                }else{  }
            }
            if(store[target[0]]){
                ret =  store[target[0]][target[1]];
            }
            return ret;
        }
        switch(props.type){
            case 'text':
                ret.push(<input key={target[1]} value={inputValue()} onChange={handleMIchange} placeholder={props.placeholder} title={target[1]}/>);
                // ret.push(<textarea key={target[1]} className='text' onChange={handleMIchange} placeholder={props.placeholder} title={target[1]}>{inputValue()}</textarea>);
                break;
            case 'textarea':
                // ret.push(<input key={target[1]} value={inputValue()} onChange={handleMIchange} placeholder={props.placeholder} title={target[1]}/>);
                ret.push(<textarea key={target[1]} className='textarea' value={inputValue()} onChange={handleMIchange} placeholder={props.placeholder} title={target[1]}></textarea>);
                break;
            case 'size':
                ret.push(<input key={target[1]} className='size' value={inputValue()} onChange={handleMIchange} placeholder={props.placeholder}  title={target[1]}/>);
                break;
            case 'color':
                ret.push(<input key={target[1]} className='color' type='color' value={inputValue()} onChange={handleMIchange} placeholder={props.placeholder}  title={target[1]}/>);
                break;
            case 'selector':
                let _options = [['','']];
                if(typeof props.options == 'string'){
                    let selectedBlockID = store.app.blockSelected;
                    let selectedBlockObject = store.template.children.filter((b)=>{return b.uuid == selectedBlockID})[0]
                    if(selectedBlockObject[props.options]){
                        _options = selectedBlockObject[props.options];
                    }else if(selectedBlockObject.style[props.options]){
                        _options = selectedBlockObject.style[props.options];
                    }
                }else if(typeof props.options == 'object'){
                    _options = props.options;
                }
                let options = _options.map(([title,optionValue],index)=>{
                    return <option key={index} value={optionValue} >{title}</option>
                })
                ret.push(<select key={target[1]} onChange={handleMIchange} value={inputValue()} title={target[1]} >{options}</select>);
                break;
        }
        return ret;
    }
    return (
        <div className={'Menuitem '+ getClasses()}>
            {getContent()}
        </div>
    );
}

export default Menuitem;
