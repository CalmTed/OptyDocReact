import actionTypes from '../reducers/actionTypes';
import React from 'react'
import Block from './Block';
import t from '../local.ts';
import { templateSizes, TAB_NAMES } from '../constants/constants'

function Stack(props) {
    const stateNow = props.store.getState();
    const zoom = stateNow.template.zoom;
    const fitsOnPage = stateNow.template.fitsH*stateNow.template.fitsW;
    const pagesNeeded = stateNow.copies.rows.length / fitsOnPage;
    const getBlocks = ()=>{
        let ret = [];
        if(stateNow.template.children.length == 0){//no children
            //create inside template
            //for now show nothing
        }else{//if there`re some children
            //show them
            stateNow.template.children.filter(ch=>{return ch.parentID === ''}).forEach(childBlock => {
                ret.push(<Block key={childBlock.uuid} blockData={childBlock} store={props.store}/>)
            });
        }
        return ret;
    }
    const getCopies = (_startFrom = 0,_perPage = Infinity)=>{
        let ret = [];
        stateNow.copies.rows.filter((r,i)=>{return true}).forEach((row,ci)=>{
            if(ci>=_startFrom && ci < _startFrom+_perPage){
                stateNow.template.children.filter(ch=>{return ch.parentID === ''}).forEach(childBlock => {
                    ret.push(<Block key={`${childBlock.uuid}_${ci}`} blockData={childBlock} store={props.store} copyIndex={ci}/>)
                });
            }
        })
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
        switch(stateNow.app.tabSelected){
            case TAB_NAMES.edit:
                ret.push(<div key='1' className='PageWrapper'><div className='PageInner'>{getBlocks()}</div></div>)
                break;
            case TAB_NAMES.copy:
            case TAB_NAMES.print:
                if(stateNow.copies.rows.length != 0 && stateNow.copies.columns.length != 0){
                    //get copies rows length / copies per page
                    if(fitsOnPage>0&&pagesNeeded>1){
                        for(let copyPageIndex=0;copyPageIndex<pagesNeeded;copyPageIndex++){
                            ret.push(<div key={'copyPage'+copyPageIndex} className='PageWrapper'><div className='PageInner'>{getCopies(fitsOnPage*copyPageIndex,fitsOnPage)}</div></div>)
                        }
                    }else{
                        ret.push(<div key='1' className='PageWrapper'><div className='PageInner'>{getCopies()}</div></div>)
                    }
                }else{
                        ret.push(<h1 key='placeholder' className='stackPlaceholder'>{t('No copy to show')}</h1>)
                }
                break;
            default:
                ret.push(<h1 key='placeholder'   className='stackPlaceholder'>{t('No tab selected')}</h1>)
                break;
        }
        
        return ret;
    }
    const handleClick = (e)=>{
        // unselect Block
        if(e.target.classList.contains('Stack')){
            if(stateNow.app.tabSelected == TAB_NAMES.edit){
                props.store.dispatch({type:actionTypes.SELECTEDBLOCK_SET,payload:''})
            }else if(stateNow.app.tabSelected == TAB_NAMES.copy ){
                props.store.dispatch({type:actionTypes.SELECTEDCOPY_SET,payload:''})
            }
        }
        
    }
    const getStyle = ()=>{
        const sizes = templateSizes
        let pageWidth = sizes[stateNow.template.pageSize][(stateNow.template.pageOrientation == 'landscape')*1];
        let pageHeight = sizes[stateNow.template.pageSize][(stateNow.template.pageOrientation != 'landscape')*1];
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
        let _ret = {
            '--zoom':zoom/100,
            '--page-wrapper-height':checkForZoom(pageHeight),
            '--page-wrapper-width':checkForZoom(pageWidth),
            '--page-margin-top':checkForZoom(stateNow.template.marginTop),
            '--page-margin-bottom':checkForZoom(stateNow.template.marginBottom),
            '--page-margin-left':checkForZoom(stateNow.template.marginLeft),
            '--page-margin-right':checkForZoom(stateNow.template.marginRight),
            // '--stack-height':`calc(${pagesNeeded} * ${pageHeight})`
        }
        if(stateNow.app.tabSelected == TAB_NAMES.print ){
            _ret['--stack-height'] = `calc(${pagesNeeded} * ${pageHeight})`;
            _ret['--text-color'] = `rgb(26, 26, 26)`;
            _ret['--menu-backcolor'] = `rgb(254,254,254)`;
            _ret['--paper-backcolor'] = `var(--menu-backcolor)`;
        }
        return _ret;
    }
    return (
    <div className="Stack" onClick={handleClick} onKeyPress={(e)=>{e.key=='Enter'?handleClick(e):0}} tabIndex='8' style={getStyle()}>
        {generatePages()}
    </div>
    );
}

export default Stack;
