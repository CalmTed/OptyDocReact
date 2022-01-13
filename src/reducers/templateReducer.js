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
            children:[]
        }  
      }else{
        console.debug('Getting app data from localstorage')
        return JSON.parse(window.localStorage.getItem('ODStore')).template;
      } 
}
const templateReducer = (state = getinitialState(), action)=>{
    const getNewChildrenList = (property)=>{
        let children = new Array(state.children)[0];
        if(['newBlockAdd','blockRemove'].indexOf(property) == -1){
            //just changing children property
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
                    const _uuid = Math.round(Math.random()*10000000);//TO DO move to emmiter method
                    const _localId = children.length;
                    const _HFId = 'b'+(_localId+1);
                    const _parentID = action.blockSelected;
                    //default new block here
                    children.push({
                        uuid:_uuid,
                        localID:_localId,
                        parentID:_parentID,//selected block
                        humanfriendlyID:_HFId,
                        valueType:'custom',
                        innerText:'b'+_localId,
                        isEditing:false,
                        isTextediting:false,
                        style:{
                            displayMode:'flex',
                            width:'auto', 
                            height:'auto',
                            display:'block',
                            alignVertical:'start',
                            alignVerticalOptions:[
                                ['Top','start'],
                                ['Center','center'],
                                ['Bottom','end'],
                                ['Space around','space-around'],
                                ['Space between','space-between'],
                                ['Space evenly','space-evenly']
                            ],
                            alignHorizontal:'start',
                            alignHorizontalOptions:[
                                ['Left','start'],
                                ['Center','center'],
                                ['Right','end'],
                                ['Space around','space-around'],
                                ['Space between','space-between'],
                                ['Space evenly','space-evenly']
                            ],
                            displayType:'block',
                            displayTypeOptions:[['Inline','inline'],['Block','block'],['Flex','flex']],
                           
                            marginTop:'0',
                            marginBottom:'0',
                            marginLeft:'0',
                            marginRight:'0',

                            fontFamily:'Arial',
                            fontFamilyOptions:[
                                ['Arial','Arial'],
                                ['Times New Roman','Times New Roman'],
                                ['Calibri','Calibri'],
                                ['Roboto','Roboto']
                            ],
                            fontSize:'14pt',
                            fontColor:'#000',
                            fontBold:'',
                            fontItalic:''
                        }
                    });break;
                case 'blockRemove':
                    const getParentList = (_children,_parID,_parList)=>{
                        _parList.push(_parID)
                        _children.forEach((ch)=>{
                            if(ch.parentID == _parID){
                                _parList = [...getParentList(_children,ch.uuid,_parList)];
                            }
                        });
                        return _parList;
                    }
                    const getNewChildrenList = (_children,_parList)=>{
                        let _childrenLess = [];
                        _children.forEach((ch)=>{
                            if(_parList.indexOf(ch.uuid) > -1){
                                return;
                            }else{
                                //resorting indexes
                                ch.localID = _childrenLess.length;
                                ch.humanfriendlyID = 'b'+(_childrenLess.length+1);
                                
                                _childrenLess.push(ch)
                            }
                        })
                        return _childrenLess;
                    }
                    const _parList = getParentList(children,action.blockSelected,[]);
                    children = getNewChildrenList(children,_parList);
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
        case 'selectedBlock/alignVerticalSet':
            //TODO validate payload
            return {...state,children:getNewChildrenList('alignVertical')}
        case 'selectedBlock/alignHorizontalSet':
            //TODO validate payload
            return {...state,children:getNewChildrenList('alignHorizontal')}
        case 'selectedBlock/displayTypeSet':
            //TODO validate payload
            return {...state,children:getNewChildrenList('displayType')};
        case 'selectedBlock/marginTopSet':
            //TODO validate payload
            return {...state,children:getNewChildrenList('marginTop')}
        case 'selectedBlock/marginBottomSet':
            //TODO validate payload
            return {...state,children:getNewChildrenList('marginBottom')}
        case 'selectedBlock/marginLeftSet':
            //TODO validate payload
            return {...state,children:getNewChildrenList('marginLeft')}
        case 'selectedBlock/marginRightSet':
            //TODO validate payload
            return {...state,children:getNewChildrenList('marginRight')}
        
        case 'selectedBlock/fontFamilySet':
            //TODO validate payload
            return {...state,children:getNewChildrenList('fontFamily')}
        case 'selectedBlock/fontSizeSet':
            //TODO validate payload
            return {...state,children:getNewChildrenList('fontSize')}
        case 'selectedBlock/fontColorSet':
            //TODO validate payload
            return {...state,children:getNewChildrenList('fontColor')}
        case 'selectedBlock/fontBoldSet':
            //TODO validate payload
            return {...state,children:getNewChildrenList('fontBold')}
        case 'selectedBlock/fontItalicSet':
            //TODO validate payload
            return {...state,children:getNewChildrenList('fontItalic')}
        default:
            console.warn('Unhandaled case in template reducer: ',action.type)
            return state;
    }
}

export default templateReducer;