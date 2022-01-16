import React from 'react'
import Block from './Block';
function Stack(props) {
    const stateNow = props.store.getState();
    const zoom = stateNow.template.zoom;
    const getBlocks = ()=>{
        let ret = [];
        if(stateNow.template.children.length == 0){//no children
            //create inside template
            //for now show nothing
        }else{//if there`re some children
            //show them
            stateNow.template.children.filter(ch=>{return ch.parentID == ''}).forEach(childBlock => {
                ret.push(<Block key={childBlock.uuid} blockData={childBlock} store={props.store}/>)
            });
        }
        
        return ret;
    }
    const generatePages = ()=>{
        //SHOWiNG
        //if there is no blocks create empty page
        //if there is blocks create page
        //if blocks height larher than page try to split blocks to the next page
        //block can't be heighter then a page
        
        //SELECTING
        //if there is no blocks select page
        //on creating select block
        //create block inside selected object(template or another block)
        //to swap blocks ??? you give it new order_id
        
        let ret = [];
        //for(let i=1;i<=70;i++){
        ret.push(<div key='1' className='PageWrapper'><div className='PageInner'>{getBlocks()}</div></div>)
        ret.push(<span key='footer' style={{'height':'calc(1cm * var(--zoom))'}}></span>)
        //}
        return ret;
    }
    const handleClick = (e)=>{
        // unselect Block
        if(e.target.classList.contains('Stack')){
            props.store.dispatch({type:'stack/selectedBlockSet',payload:''})
        }
    }
    const getStyle = ()=>{
        const sizes = {
            'A4':['210mm','297mm'],
            'A3':['297mm','420mm'],
        }
        let pageWidth = sizes[stateNow.template.pageSize][(stateNow.template.pageOrientation == 'landscape')*1]
        let pageHeight = sizes[stateNow.template.pageSize][(stateNow.template.pageOrientation !== 'landscape')*1]
        const checkForZoom = (_val)=>{
            _val+='';
            if(_val){
                if(_val.substr(-1,1) == '%'){
                    return `${_val}`
                }else{
                    return `calc( ${_val} * var(--zoom) )`
                }
            }else{
                return '';
            }
        }
        return {
            '--zoom':zoom/100,
            '--page-wrapper-height':checkForZoom(pageHeight),
            '--page-wrapper-width':checkForZoom(pageWidth),
            '--page-margin-top':checkForZoom(stateNow.template.marginTop),
            '--page-margin-bottom':checkForZoom(stateNow.template.marginBottom),
            '--page-margin-left':checkForZoom(stateNow.template.marginLeft),
            '--page-margin-right':checkForZoom(stateNow.template.marginRight),
        }
    }
    return (
    <div className="Stack" onClick={handleClick} style={getStyle()}>
        {generatePages()}
    </div>
    );
}

export default Stack;
