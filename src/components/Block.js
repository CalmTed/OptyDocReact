import React from 'react'

function Block(props) {
    const stateNow = props.store.getState();  
    const getBlocks = ()=>{
        let ret = [];
        if(stateNow.template.children.length == 0){//no children
            //create inside template
            //for now show nothing
        }else{//if there`re some children
            //show them
            stateNow.template.children.forEach(childBlock => {
                ret.push(<Block key='' blockStyle={{}} blockText=''/>)
            });
        }
        return ret;
    }
    const getStyle = ()=>{
        let blockOutline = ''
        if(props.blockData.uuid == stateNow.app.blockSelected){
            blockOutline = '2px dashed var(--main-color)'
        }
        return {
            '--block-border':blockOutline,
            '--block-width':props.blockStyle.width,
            '--block-height':props.blockStyle.height,
        }
    }
    const getContent = ()=>{
        return props.blockText;
    }
    const handleClick = ()=>{
        //selectBlock
        props.store.dispatch({type:'stack/selectedBlockSet',payload:props.blockData.uuid})
    }
    return (
    <div className="Block" style={getStyle()} onClick={handleClick}>
        {getContent()}
        {/* {getBlocks()} */}
    </div>
    );
}

export default Block;
