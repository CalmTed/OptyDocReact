import React from 'react'
import Block from './Block';
function Stack(props) {
    const stateNow = props.store.getState();
    const zoom = stateNow.template.zoom;
    const setSize = (zoom)=>{
        
    }
    const getBlocks = ()=>{
        let ret = [];
        if(stateNow.template.children.length == 0){//no children
            //create inside template
            //for now show nothing
        }else{//if there`re some children
            //show them
            stateNow.template.children.forEach(childBlock => {
                ret.push(<Block key='' blockStyle={childBlock.style} blockText={childBlock.innerText} blockData={childBlock} store={props.store}/>)
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
        setSize(zoom);
        //for(let i=1;i<=70;i++){
            ret.push(<div key='1' className='PageWrapper'><div className='PageInner'>{getBlocks()}</div></div>)
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
        let pageWidth = 210;
        let pageHeight = 297;
        if(stateNow.template.pageSize == 'A4'){
            if(stateNow.template.pageOrientation == 'landscape'){
                pageWidth = pageHeight;
                pageHeight = 210;
            }
        }else if(stateNow.template.pageSize == 'A3'){
            pageWidth = 297;
            pageHeight = 420;
            if(stateNow.template.pageOrientation == 'landscape'){
                pageWidth = pageHeight;
                pageHeight = 297;
            }
        }
        return {
            '--zoom':zoom/100,
            '--page-wrapper-height':(pageHeight/100*zoom)+'mm',
            '--page-wrapper-width':(pageWidth/100*zoom)+'mm',
            '--page-margin-left':((stateNow.template.marginLeft)/100*zoom)+'mm'
        }
    }
    return (
    <div className="Stack" onClick={handleClick} style={getStyle()}>
        {generatePages()}
    </div>
    );
}

export default Stack;
