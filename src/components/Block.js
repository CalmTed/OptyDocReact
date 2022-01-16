import React from 'react'

function Block(props) {
    const stateNow = props.store.getState();  
    const blockData = props.blockData;
    const blockStyle = blockData.style;
    const getBlocks = (_props)=>{
        let ret = [];
        const hisChildern = _props.store.getState().template.children.filter(ch=>{return ch.parentID == _props.blockData.uuid})
        if(hisChildern.length == 0 ){
            //entering just text
            const formatInnerText = (_innerText)=>{
                let _ret = []
                if(_innerText.indexOf('\n')==-1){
                    _ret.push(_innerText);
                }else{
                    if(_props.blockData.valueType == 'selector'){
                        _ret.push(<p key={_props.blockData.uuid} id={_props.blockData.uuid}>{_innerText.split('\n')[0]}</p>)
                    }else{
                        _innerText.split('\n').forEach((_line,i)=>{
                            _ret.push(<p key={i} id={_props.blockData.uuid}>{_line}</p>)
                        })
                    }
                }
                return _ret;
            }
            if(_props.blockData.copyChannel == _props.blockData.humanfriendlyID){
                ret = [...formatInnerText(_props.blockData.innerText)];
            }else{//get inner text from different block
                const blockToCopyFrom = ()=>{
                    let __ret = _props.store.getState().template.children.filter(ch=>{return ch.humanfriendlyID == _props.blockData.copyChannel});
                    if(__ret.length){
                        return __ret[0] 
                    }else{
                        return _props.blockData;
                    }
                }
                ret = [...formatInnerText(blockToCopyFrom().innerText)];
            }
            
        }else{
            //if there`re some children, show them
            hisChildern.forEach(childBlock => {
                ret.push(<Block key={childBlock.uuid} blockData={childBlock} store={_props.store}/>)
            });
        }
        return ret;
    }
    const getStyle = ()=>{
        //TO DO what if the block is too small to select
        let blockOutline = ''
        if(blockData.uuid == stateNow.app.blockSelected){
            blockOutline = 'var(--selected-border)'
        }
        const checkForZoom = (_val)=>{
            if(_val){
                //not scaling percentage
                if(_val.substr(-1,1) == '%'){
                    return `${_val}`
                }else{
                    return `calc( ${_val} * var(--zoom) )`
                }
            }else{
                return '';
            }
        }
        //TODO oplimize this less characters
        let constructedStyle = {}
        constructedStyle = {...constructedStyle,...{
            '--block-border':blockOutline,
            '--block-display':blockStyle.displayType,
            '--block-height':checkForZoom(blockStyle.height),
            '--block-width':checkForZoom(blockStyle.width),
            '--block-marginTop':checkForZoom(blockStyle.marginTop),
            '--block-marginBottom':checkForZoom(blockStyle.marginBottom),
            '--block-marginLeft':checkForZoom(blockStyle.marginLeft),
            '--block-marginRight':checkForZoom(blockStyle.marginRight),
        }}
        const stylesToCheck = {
            
            '--block-fontFamily':blockStyle.fontFamily,
            '--block-fontSize':checkForZoom(blockStyle.fontSize),
            '--block-fontColor':blockStyle.fontColor,
            '--block-fontBold':blockStyle.fontBold,
            '--block-fontItalic':blockStyle.fontItalic,
            '--block-fontUnderline':blockStyle.fontUnderline,  
            '--block-backgroundColor':blockStyle.backgroundColor,

            '--block-align':blockStyle.alignVertical,
            '--block-justify':blockStyle.alignHorizontal
        }
        Object.entries(stylesToCheck).forEach(s=>{        
            //no need to call all if there is inherit or indeclared
            if(['inherit','calc( auto * var(--zoom) )','calc( 0mm * var(--zoom) )'].indexOf(s[1]) == -1){
                constructedStyle = {...constructedStyle,[s[0]]:[s[1]]}
            }
        })
        //custom styles
        blockStyle.customStyle.split('\n').forEach(s=>{
            const _s = s.split(':');        
            if(/^(\w|-){2,20}$/.test(_s[0]) && !/[\[\]{};:]|\d/.test(_s[0]) && !/[\[\]{};:]/.test(_s[1])){
                //convering to camelCase
                if(_s[0].indexOf('-') >-1){
                    _s[0] = _s[0].split('-').map((part,i)=>{return i>0? part.charAt(0).toUpperCase()+part.slice(1) : part }).join('')
                }
                constructedStyle = {...constructedStyle,[_s[0]]:[_s[1]]}
            }
        })
        
        return constructedStyle;
    }
    const handleClick = (e)=>{
        //selectBlock
        //TO DO if it is not a parent
        if(blockData.uuid == e.target.id){
            const clickedBlockId = e.target.id;
            const clickedBlock = stateNow.template.children.filter(ch=>{return ch.uuid == clickedBlockId})[0]
            // const selectedBlock = stateNow.template.children.filter(ch=>{return ch.uuid == stateNow.app.blockSelected})[0]
            props.store.dispatch({type:'stack/selectedBlockSet',payload:clickedBlock.uuid})
        }
    }
    return (
    <div id={blockData.uuid} key={blockData.uuid} className="Block" style={getStyle()} onClick={handleClick} title={blockData.humanfriendlyID}>
        
        {getBlocks(props)}
    </div>
    );
}

export default Block;
