import React from 'react'

function Stack(props) {
    const zoom = props.store.getState().template.zoom;
    const setZoom = (zoom)=>{
        document.documentElement.style.setProperty('--zoom',zoom/100);
        document.documentElement.style.setProperty('--page-wrapper-height',(297/100*zoom)+'mm');
        document.documentElement.style.setProperty('--page-wrapper-width',(210/100*zoom)+'mm');
    }

    const generatePages = ()=>{
        //if there is no blocks create page
        //if there is blocks create page
        //if blocks height larher than page try to split blocks to the next page
        //block can't be heighter then a page
        
        let ret = [];
        setZoom(zoom);
        for(let i=1;i<=70;i++){
            ret.push(<div key={i} className='PageWrapper'><div className='PageInner'>{i}</div></div>)
        }
        return ret;
    }
    return (
    <div className="Stack">
        {generatePages()}
    </div>
    );
}

export default Stack;
