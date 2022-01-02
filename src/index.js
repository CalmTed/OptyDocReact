import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import './css/Index.scss';

import Page from './components/Page';
import store from "./store";
// import * as serviceWorker from './serviceWorker';

//zoom event listener
document.onkeydown = (e)=>{
    const zoomIs = store.getState().template.zoom;
    const zoomStep = (zoomIs)=>{
        if(zoomIs<10){
            return 1;
        }else if(zoomIs<90){
            return 5;
        }else if(zoomIs<200){
            return 10;
        }else{
            return 25;
        }
    }
    if(e.key == '='&& e.ctrlKey){//zoom in
        e.preventDefault();
        store.dispatch({type:"template/zoomSet",payload:zoomIs+zoomStep(zoomIs)})
    }else if(e.key == '-' && e.ctrlKey){//zoom out
        e.preventDefault();
        store.dispatch({type:"template/zoomSet",payload:zoomIs-zoomStep(zoomIs)})
    }
}
const render = ()=> ReactDOM.render(<Provider store={store}><Page store={store}/></Provider>, document.getElementById('root'));
render()
store.subscribe(render)