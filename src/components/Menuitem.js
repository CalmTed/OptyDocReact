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
                let selectedBlock = store.template.children.filter((b)=>{return b.uuid == selectedBlockID})[0]
                if(selectedBlock[target[1]]){
                    ret = selectedBlock[target[1]];
                }else if(selectedBlock.style[target[1]]){
                    ret = selectedBlock.style[target[1]];
                }else{  }
                // ret = selectedBlock[target[1]];
            }
            if(store[target[0]]){
                ret =  store[target[0]][target[1]];
            }
            return ret;
        }
        switch(props.type){
            case 'text':
                ret.push(<input key={target[1]} value={inputValue()} onChange={handleMIchange} placeholder={props.placeholder}/>);
                break;
            case 'size':
                ret.push(<input key={target[1]} className='size' value={inputValue()} onChange={handleMIchange} placeholder={props.placeholder}/>);
                break;
            case 'selector':
                let options = props.options.map(([title,optionValue],index)=>{
                    return <option key={index} value={optionValue} >{title}</option>    
                })
                ret.push(<select key={target[1]} onChange={handleMIchange} value={store[target[0]][target[1]]}>{options}</select>);
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
