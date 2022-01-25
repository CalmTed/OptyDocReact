import React from 'react'
import actionTypes from '../reducers/actionTypes';
function Block(props) {
    const stateNow = props.store.getState();  
    const blockData = props.blockData;
    const blockStyle = blockData.style;
    const getBlocks = (_props)=>{
        let ret = [];
        const hisChildern = _props.store.getState().template.children.filter(ch=>{return ch.parentID == _props.blockData.uuid})
        //no children content
        if(hisChildern.length == 0 ){
            //multiline support
            const formatInnerText = (_innerText)=>{
                let _ret = []
                if(typeof _innerText == 'undefined'){
                    return _ret;
                }
                if(_innerText.indexOf('\n')==-1){
                    _ret.push(_innerText);
                }else{
                    const _getPostfix = ()=>{
                        return typeof props.copyIndex != 'undefined'?'_'+props.copyIndex:'_p';
                    }
                    if(_props.blockData.valueType == 'selector'){
                        _ret.push(<p key={_props.blockData.uuid} id={_props.blockData.uuid+_getPostfix()}>{_innerText.split('\n')[0]}</p>)
                    }else{
                        _innerText.split('\n').forEach((_line,i)=>{
                            _ret.push(<p key={i} id={_props.blockData.uuid+_getPostfix()}>{_line}</p>)
                        })
                    }
                }
                return _ret;
            }
            const _getFromCopyRows = (__stateNow,__uuid,__copyIndex)=>{//aka. column and row
                //if there is no column or no row we return ''
                //if there is a value we return string
                let _ret = ''
                __stateNow.copies.columns.forEach((col,ci)=>{
                    if(__uuid+'' === col.target+''){//looking for right col
                        if(typeof __stateNow.copies.rows[__copyIndex][ci] != 'undefined' && __stateNow.copies.rows[__copyIndex][ci] != null){//looking for right row
                            _ret = __stateNow.copies.rows[props.copyIndex][ci];
                            
                        }else{
                            _ret = __stateNow.template.children.filter(ch=>{ return ch.uuid+'' === __uuid+''})[0].innerText;
                        }
                    }
                })
                return _ret;
            }
            let _ObjectOfOrigin = (__props,__copyChannel)=>{
                let __originObject = __props.store.getState().template.children.filter(ch=>{
                    return (ch.valueType != 'copied')&&(ch.copyChannel+'' === __copyChannel+'')
                })[0]//if there would be more then one origin object -> select first one
                return __originObject;

            }
            //if block is copying from another channel
            let _isCopyLinked = _props.blockData.valueType == 'copied';
            //if block is a copy of template
            let _isCopyIndexed = typeof _props.copyIndex != 'undefined';
            //                    Edit tab           Copy tab
            //not copiLinked    1.innerText        2.getFromCopyRows
            //copyLinked        3.textFromOrigin   4.getOrigin > getFromCopyRows
            if(_isCopyLinked){
                let _orObj = _ObjectOfOrigin(_props,_props.blockData.copyChannel);
                //if block copies it self
                if(typeof _orObj == 'undefined'){
                    _orObj = _props.blockData;
                }
                if(_isCopyIndexed){//4
                    
                    if(_orObj.valueType != 'fixed'){
                        ret = [...formatInnerText(_getFromCopyRows(_props.store.getState(),_orObj.uuid,_props.copyIndex))]
                    }else{
                        ret = [...formatInnerText(_orObj.innerText)]
                    }
                }else{//3
                    ret = [...formatInnerText(_orObj.innerText)] 
                }
            }else{
                if(_isCopyIndexed){
                    //2
                    //TODO is static or variable?
                    if(_props.blockData.valueType != 'fixed'){
                        ret = [...formatInnerText(_getFromCopyRows(_props.store.getState(),_props.blockData.uuid,_props.copyIndex))]
                    }else{
                        ret = [...formatInnerText(_props.blockData.innerText)]
                    }
                }else{
                    //1
                    ret = [...formatInnerText(_props.blockData.innerText)]
                }
            }
        }else{
            //if there`re some children, show them
            hisChildern.forEach(childBlock => {
                if(typeof props.copyIndex != 'undefined'){
                    ret.push(<Block key={`${childBlock.uuid}_${props.copyIndex}`} blockData={childBlock} store={_props.store} copyIndex={props.copyIndex}/>)
                }else{
                    ret.push(<Block key={childBlock.uuid} blockData={childBlock} store={_props.store}/>)
                }
            });
        }
        return ret;
    }
    const getStyle = ()=>{
        //TO DO what if the block is too small to select
        let blockOutline = ''
        //showing selected block
        if(blockData.uuid === stateNow.app.blockSelected && stateNow.app.tabSelected == 'edit'){
            blockOutline = 'var(--selected-border)'
        }
        //showing selected copy
        if(blockData.parentID === '' && props.copyIndex+'' == stateNow.app.copySelected && stateNow.app.tabSelected == 'copy'){
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
            const _s = s.split(':')      
            if(/^(\w|-){2,20}$/.test(_s[0]) && !/[\[\]{};:]|\d/.test(_s[0]) && !/[\[\]{};:]/.test(_s[1])){
                //convering style-case to camelCase
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
        if((blockData.uuid == e.target.id || blockData.uuid+'_p' == e.target.id) && stateNow.app.tabSelected == 'edit'){
            const clickedBlockId = e.target.id.replace('_p','');
            const clickedBlock = stateNow.template.children.filter(ch=>{return ch.uuid == clickedBlockId})[0]
            // const selectedBlock = stateNow.template.children.filter(ch=>{return ch.uuid == stateNow.app.blockSelected})[0]
            props.store.dispatch({type:actionTypes.SELECTEDBLOCK_SET,payload:clickedBlock.uuid})
        }else if(blockData.uuid+'_'+props.copyIndex === e.target.id && stateNow.app.tabSelected == 'copy'){
            props.store.dispatch({type:actionTypes.SELECTEDCOPY_SET,payload:props.copyIndex})            
        }
    }
    const handleKeyPress = (e)=>{
        e.key=='Enter'?handleClick(e):0;
    }
    const getKey = ()=>{
        if(typeof props.copyIndex != 'undefined'){
            return `${blockData.uuid}_${props.copyIndex}`
        }
        return blockData.uuid;
    }
    const getTitle = ()=>{
        if(stateNow.app.tabSelected == 'copy'){
            return `Copy ${props.copyIndex}`
        }
        return blockData.humanfriendlyID;
    }
    return (
    <div id={getKey()} key={getKey()} className="Block" style={getStyle()} onClick={handleClick} onKeyPress={handleKeyPress} tabIndex='10' title={getTitle()}>
        {getBlocks(props)}
    </div>
    );
}

export default Block;
