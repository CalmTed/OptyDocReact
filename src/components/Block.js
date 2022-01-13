import React from 'react'

function Block(props) {
    const stateNow = props.store.getState();  
    const getBlocks = (_props)=>{
        let ret = [];
        const hisChildern = _props.store.getState().template.children.filter(ch=>{return ch.parentID == _props.blockData.uuid})
        if(hisChildern.length == 0 ){
            //no children
            ret.push(_props.blockText);
        }else{
            //if there`re some children, show them
            hisChildern.forEach(childBlock => {
                ret.push(<Block key={childBlock.uuid} blockStyle={childBlock.style} blockText={childBlock.innerText} blockData={childBlock} store={props.store}/>)
            });
        }
        return ret;
    }
    const getStyle = ()=>{
        //TO DO what if the block is too small to select
        let blockOutline = ''
        if(props.blockData.uuid == stateNow.app.blockSelected){
            blockOutline = 'var(--selected-border)'
        }
        const checkForZoom = (_val)=>{
            if(_val.substr(-1,1) == '%'){
                return `${_val}`
            }else{
                return `calc( ${_val} * var(--zoom) )`
            }
        }
        return {
            '--block-border':blockOutline,
            '--block-width':checkForZoom(props.blockStyle.width),
            '--block-height':checkForZoom(props.blockStyle.height),

            '--block-align':props.blockStyle.alignVertical,
            '--block-justify':props.blockStyle.alignHorizontal,
            '--block-display':props.blockStyle.displayType,
            
            
            '--block-marginTop':props.blockStyle.marginTop,
            '--block-marginBottom':props.blockStyle.marginBottom,
            '--block-marginLeft':props.blockStyle.marginLeft,
            '--block-marginRight':props.blockStyle.marginRight,
            
            '--block-fontFamily':props.blockStyle.fontFamily,
            '--block-fontSize':props.blockStyle.fontSize,
            '--block-fontColor':props.blockStyle.fontColor,
            '--block-fontBold':props.blockStyle.fontBold,
            '--block-fontItalic':props.blockStyle.fontItalic,


        }
    }
    const handleClick = (e)=>{
        //selectBlock
        //TO DO if it is not a parent
        if(props.blockData.uuid == e.target.id){
            const clickedBlockId = e.target.id;
            const clickedBlock = stateNow.template.children.filter(ch=>{return ch.uuid == clickedBlockId})[0]
            // const selectedBlock = stateNow.template.children.filter(ch=>{return ch.uuid == stateNow.app.blockSelected})[0]
            props.store.dispatch({type:'stack/selectedBlockSet',payload:clickedBlock.uuid})
        }
    }
    return (
    <div id={props.blockData.uuid} key={props.blockData.uuid} className="Block" style={getStyle()} onClick={handleClick} title={props.blockData.humanfriendlyID}>
        
        {getBlocks(props)}
    </div>
    );
}

export default Block;
