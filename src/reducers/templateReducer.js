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
            marginLeft:'0mm',
            marginRight:'0mm',
            marginTop:'0mm',
            marginBottom:'0mm',
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
                    if(typeof ch[property] != 'undefined'){
                        ch[property] = action.payload;
                    }else{
                        ch.style[property] = action.payload;
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
                        valueTypeOptions:[
                            ['Custom','custom'],
                            ['Variable','variable'],
                            ['Selector','selector'],
                            ['Copy from','copied']
                        ],
                        innerText:'b'+_localId,
                        copyChannel:_HFId,
                        // isEditing:false,
                        // isTextediting:false,
                        style:{
                            displayMode:'flex',
                            width:'auto', 
                            height:'auto',
                            display:'flex',
                            alignVertical:'inherit',
                            alignVerticalOptions:[
                                ['Top','start'],
                                ['Center','center'],
                                ['Bottom','end'],
                                ['Space around','space-around'],
                                ['Space between','space-between'],
                                ['Space evenly','space-evenly'],
                                ['Space evenly','space-evenly'],
                                ['Inherit','inherit']
                            ],
                            alignHorizontal:'inherit',
                            alignHorizontalOptions:[
                                ['Left','start'],
                                ['Center','center'],
                                ['Right','end'],
                                ['Space around','space-around'],
                                ['Space between','space-between'],
                                ['Space evenly','space-evenly'],
                                ['Inherit','inherit']
                            ],
                            displayType:'inherit',
                            displayTypeOptions:[
                                ['Inline','inline'],
                                ['Flex','flex'],
                                ['Inherit','inherit']
                            ],
                           
                            marginTop:'0mm',
                            marginBottom:'0mm',
                            marginLeft:'0mm',
                            marginRight:'0mm',

                            fontFamily:'inherit',
                            fontFamilyOptions:[
                                ['Arial','Arial'],
                                ['Times New Roman','Times New Roman'],
                                ['Calibri','Calibri'],
                                ['Roboto','Roboto'],
                                ['Inherit','inherit']
                            ],
                            fontSize:'inherit',
                            fontColor:'inherit',
                            backgroundColor:'inherit',
                            fontBold:'inherit',
                            fontBoldOptions:[
                                ['Thin','100'],
                                ['Normal','400'],
                                ['Bold','600'],
                                ['Bolder','900'],
                                ['Inherit','inherit']
                            ],
                            fontItalic:'inherit',
                            fontItalicOptions:[
                                ['Not italic','none'],
                                ['Italic','italic'],
                                ['Inherit','inherit']
                            ],
                            fontUnderline:'inherit',
                            fontUnderlineOptions:[
                                ['Non underline','none'],
                                ['Underline','underline'],
                                ['Inherit','inherit']
                            ],
                            
                            customStyle:''

                            
                        }
                    });break;
                case 'blockRemove':
                    const getParentList = (_children,_parID,_parList)=>{
                        _parList.push(_parID*1)//need to convert to number
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
    const isValidSize = (_value)=>{
        //units: mm,cm,in,pt,%
        return /^(\d{0,4})([a-z]{0,7}|%)$/.test(_value)
    }
    const isValidOption = (_parameter,_payload)=>{
        if(typeof state[_parameter+'Options'] != 'undefined'){
            return state[_parameter+'Options'].map((o)=>{return o[1]}).indexOf(_payload) > -1;
        }else {
            let _selectedBlock = state.children.filter(ch=>ch.uuid == action.blockSelected)[0]
            if(typeof _selectedBlock[_parameter+'Options'] != 'undefined'){
                return _selectedBlock[_parameter+'Options'].map((o)=>{return o[1]}).indexOf(_payload) > -1;
            }else if(typeof _selectedBlock.style[_parameter+'Options'] != 'undefined'){
                return _selectedBlock.style[_parameter+'Options'].map((o)=>{return o[1]}).indexOf(_payload) > -1;
            }else{
                return false;
            }
        }

    }
    const isValidText = (_value)=>{
        return !/[<>\/{}|]/g.test(_value) && _value.length<500
    }
    switch(action.type){
        case 'template/newBlockAdd':
            return {...state,children:getNewChildrenList('newBlockAdd')}
        case 'template/blockRemove':
            return {...state,children:getNewChildrenList('blockRemove')}
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
            if(isValidText(action.payload) && action.payload.length < 40){
                return {...state,name:action.payload}
            }else{
                return state;
            }
        case 'template/pageSizeSet':
            if(isValidOption('pageSize',action.payload)){
                return {...state,pageSize:action.payload}
            }else{
                return state;
            }
        case 'template/pageOrientationSet':
            if(isValidOption('pageOrientation',action.payload)){
                return {...state,pageOrientation:action.payload}
            }else{
                return state;
            }
        case 'template/marginTopSet':
            if(isValidSize(action.payload)){
                return {...state,marginTop:action.payload}
            }else{
                return state;
            }
        case 'template/marginBottomSet':
            if(isValidSize(action.payload)){
                return {...state,marginBottom:action.payload}
            }else{
                return state;
            }
        case 'template/marginLeftSet':
            if(isValidSize(action.payload)){
                return {...state,marginLeft:action.payload}
            }else{
                return state;
            }
        case 'template/marginRightSet':
            if(isValidSize(action.payload)){
                return {...state,marginRight:action.payload}
            }else{
                return state;
            }
        //SELECTED BLOCK
        case 'selectedBlock/innerTextSet':
            if(isValidText(action.payload)){
                return {...state,children:getNewChildrenList('innerText')}
            }else{
                return state;
            }
        case 'selectedBlock/widthSet':
            if(isValidSize(action.payload)){
                return {...state,children:getNewChildrenList('width')}
            }else{
                return state;
            };
        case 'selectedBlock/heightSet':
            if(isValidSize(action.payload)){
                return {...state,children:getNewChildrenList('height')}
            }else{
                return state;
            }
        case 'selectedBlock/alignVerticalSet':
            if(isValidOption('alignVertical',action.payload)){
                return {...state,children:getNewChildrenList('alignVertical')}
            }else{
                return state;
            }
        case 'selectedBlock/alignHorizontalSet':
            if(isValidOption('alignHorizontal',action.payload)){
                return {...state,children:getNewChildrenList('alignHorizontal')}
            }else{
                return state;
            }
        case 'selectedBlock/displayTypeSet':
            if(isValidOption('displayType',action.payload)){
                return {...state,children:getNewChildrenList('displayType')}
            }else{
                return state;
            }
        case 'selectedBlock/marginTopSet':
            if(isValidSize(action.payload)){
                return {...state,children:getNewChildrenList('marginTop')}
            }else{
                return state;
            }
        case 'selectedBlock/marginBottomSet':
            if(isValidSize(action.payload)){
                return {...state,children:getNewChildrenList('marginBottom')}
            }else{
                return state;
            }
        case 'selectedBlock/marginLeftSet':
            if(isValidSize(action.payload)){
                return {...state,children:getNewChildrenList('marginLeft')}
            }else{
                return state;
            }
        case 'selectedBlock/marginRightSet':
            if(isValidSize(action.payload)){
                return {...state,children:getNewChildrenList('marginRight')}
            }else{
                return state;
            }
        case 'selectedBlock/fontFamilySet':
            if(isValidOption('fontFamily',action.payload)){
                return {...state,children:getNewChildrenList('fontFamily')}
            }else{
                return state;
            }
        case 'selectedBlock/fontSizeSet':
            //TODO validate payload
            if(isValidSize(action.payload)){
                return {...state,children:getNewChildrenList('fontSize')}
            }else{
                return state;
            }
        case 'selectedBlock/fontColorSet':
            if(/#[0-9a-f]{6}/.test(action.payload)){
                return {...state,children:getNewChildrenList('fontColor')}
            }else{
                return state;
            }
        case 'selectedBlock/backgroundColorSet':
            if(/#[0-9a-f]{6}/.test(action.payload)){
                return {...state,children:getNewChildrenList('backgroundColor')}
            }else{
                return state;
            }
        case 'selectedBlock/fontBoldSet':
            if(isValidOption('fontBold',action.payload)){
                return {...state,children:getNewChildrenList('fontBold')}
            }else{
                return state;
            }
        case 'selectedBlock/fontItalicSet':
            if(isValidOption('fontItalic',action.payload)){
                return {...state,children:getNewChildrenList('fontItalic')}
            }else{
                return state;
            }
        case 'selectedBlock/fontUnderlineSet':
            if(isValidOption('fontUnderline',action.payload)){
                return {...state,children:getNewChildrenList('fontUnderline')}
            }else{
                return state;
            } 
        case 'selectedBlock/copyChannelSet':
            if(isValidText(action.payload) && action.payload.length<10){
                return {...state,children:getNewChildrenList('copyChannel')}
            }else{
                return state;
            }
        case 'selectedBlock/valueTypeSet':
            //TODO validate payload
            if(isValidOption('valueType',action.payload)){
                return {...state,children:getNewChildrenList('valueType')}
            }else{
                return state;
            }
        case 'selectedBlock/customStyleSet':
            if(!/[{}*\/\\<>^?@&$~`|]/g.test(action.payload) && action.payload.length<500){
                return {...state,children:getNewChildrenList('customStyle')}
            }else{
                return state;
            }
        default:
            return state;
    }
}

export default templateReducer;