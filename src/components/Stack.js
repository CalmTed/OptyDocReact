import React from 'react'

function Stack(props) {
    const stateNow = props.store.getState();
    const zoom = stateNow.template.zoom;
    const setSize = (zoom)=>{
        document.documentElement.style.setProperty('--zoom',zoom/100);
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
        document.documentElement.style.setProperty('--page-wrapper-height',(pageHeight/100*zoom)+'mm');
        document.documentElement.style.setProperty('--page-wrapper-width',(pageWidth/100*zoom)+'mm');
    }

    const generatePages = ()=>{
        //if there is no blocks create page
        //if there is blocks create page
        //if blocks height larher than page try to split blocks to the next page
        //block can't be heighter then a page
        
        let ret = [];
        setSize(zoom);
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
