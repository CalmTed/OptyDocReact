import store from "../store";
const getinitialState = () => {
    //SHORTCUT HERE for it to not to store localy
    if(window.localStorage.getItem('ODStore') == undefined){
        return  {
            uuid:'000000',
            name:'New template',
            dateCreated:'0',
            dateEdited:'0',
            creator:'man',
            pageSize:'A4',
            pageSizeOptions:[['A4','A4'],['A3','A3']],
            pageOrientation:'portrait',
            pageOrientationOptions:[['Portrait','portrait'],['Landscape','landscape']],
            marginLeft:'10',
            marginRight:'0',
            marginTop:'0',
            marginBottom:'0',
            zoom:100,
            children:[{
                uuid:'123',
                localID:'0',
                parentID:'',
                humanfriendlyID:'block_1',
                valueType:'custom',
                innerText:'inner text here, hello',
                isEditing:false,
                isTextediting:false,
                style:{
                    displayMode:'flex',
                    width:'100mm', 
                    height:'100mm'

                }
            }]
        }  
      }else{
        console.debug('Getting app data from localstorage')
        return JSON.parse(window.localStorage.getItem('ODStore')).template;
      } 
}
const templateReducer = (state = getinitialState(), action)=>{
    let getNewChildrenList = (property)=>{
  
        let children = new Array(state.children)[0];
        if(['newBlockAdd','blockRemove'].indexOf(property) == -1){
            children.map((ch)=>{
                if(ch.uuid == action.blockSelected){   
                    if(['innerText'].indexOf(property)>-1){
                        ch[property] = action.payload
                    }else{
                        ch.style[property] = action.payload
                    }      
                }
            })
        }else{
            //custom comands
            switch(property){
                case 'newBlockAdd':
                    let _uuid = Math.round(Math.random()*10000000);
                    let _localId = children.length;
                    let _HFId = 'block_'+(_localId+1);
                    //default new block here
                    children.push({
                        uuid:_uuid,
                        localID:_localId,
                        parentID:'',
                        humanfriendlyID:_HFId,
                        valueType:'custom',
                        innerText:'New block',
                        isEditing:false,
                        isTextediting:false,
                        style:{
                            displayMode:'flex',
                            width:'100mm', 
                            height:'100mm'
                        }
                    });break;
                case 'blockRemove':
                    //remove from array
                    //resort
                    let _childrenLess = [];
                    children.forEach((ch)=>{
                        if(ch.uuid == action.blockSelected){  
                            return; 
                        }else{
                            ch.localID = _childrenLess.length;
                            ch.humanfriendlyID = 'block_'+(_childrenLess.length+1);
                            
                            _childrenLess.push(ch)
                        }
                    })
                    children = _childrenLess;
            }
        }
        return children;
    };
    switch(action.type){
        case 'template/newBlockAdd':
            
            return {...state,children:getNewChildrenList('newBlockAdd')}
        case 'template/blockRemove':
            return {...state,children:getNewChildrenList('blockRemove')}
            // return state;
        case 'template/zoomSet':
            //TODO make if functional for scroll
            if(action.payload>=500){
                action.payload=500
            }
            if(action.payload<=1){
                action.payload=1;
            }
            return {...state,zoom:action.payload}
        case 'template/nameSet':
            //TODO check length
            return {...state,name:action.payload}
        case 'template/pageSizeSet':
            //TODO validate payload
            return {...state,pageSize:action.payload}
        case 'template/pageOrientationSet':
            //TODO validate payload
            return {...state,pageOrientation:action.payload}
        case 'template/marginLeftSet':
            //TODO validate payload
            if(action.payload>=0&&action.payload<1000){
                return {...state,marginLeft:action.payload}
            }
        case 'selectedBlock/innerTextSet':
            //TODO validate payload
            return {...state,children:getNewChildrenList('innerText')}
        case 'selectedBlock/widthSet':
            //TODO validate payload
            return {...state,children:getNewChildrenList('width')}
        case 'selectedBlock/heightSet':
            //TODO validate payload
            return {...state,children:getNewChildrenList('height')}
        default:
            return state;
    }
}

export default templateReducer;