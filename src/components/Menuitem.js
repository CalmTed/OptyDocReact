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
        props.store.dispatch({type:target.join('/')+'Set',payload:e.target.value})
    }
    const getContent = ()=>{
        let ret = [];
        switch(props.type){
            case 'text':
                ret.push(<input key={target[1]} value={store[target[0]][target[1]]} onChange={handleMIchange}/>);
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
