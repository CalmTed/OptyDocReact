import actionTypes from "./actionTypes";
const getinitialState = () => {
    if(window.localStorage.getItem('ODStore') == undefined){
        return  {
            //data for copy values: name, title, type, options
            columns:[],
            //with title row
            rows:[]
        }  
      }else {
        console.debug('Getting copies data from localstorage')
        return JSON.parse(window.localStorage.getItem('ODStore')).copies;
      } 
}
const copyReducer = (state = getinitialState(), action)=>{
    switch(action.type){
        case actionTypes.COPIES_DATA_SET:
            //TODO check length of each cell
            let _ret = state;
            let _payload = action.payload;
            const compareArr = (a,b)=>{
                let _ret = true;
                if(a.length != b.length){
                    return false;
                }
                a.forEach((av,ai)=>{
                    b.forEach((bv,bi)=>{
                        if(ai==bi && av!=bv){
                            _ret = false;
                        }
                    })
                })
                return _ret;
            }
            if(compareArr(_payload[0],state.columns.map(col=>{return col.title}))){
                let _valid = true;
                _payload.forEach((row)=>{
                    if(row.length>_payload[0].length){
                        _valid = false;
                    }
                })
                if(_valid){
                    _ret = {...state,rows:_payload.slice(1)}   
                }
            }
            return _ret;
        case actionTypes.COPIES_COLUMN_ADD:
            return state;
        case actionTypes.COPIES_COLUMN_REMOVE:
            return state;
        case actionTypes.COPIES_COLUMNS_SET:
            if(typeof action.payload == 'object'){
                let _valid = true;
                action.payload.forEach(c=>{
                    _valid = Object.keys(c).join(',') == 'target,title,type,options'?true:false;
                })
                if(_valid){
                    return {...state,columns:action.payload}
                }else{
                    
                    console.warn('invalid cols',Object.keys(action.payload).join(','), 'target,title,type,options')
                }
            }
            return state;
        case actionTypes.COPIES_ROW_ADD:
            if(typeof action.payload == 'object' && typeof action.copySelected != 'undefined'){
                if(action.payload.length == state.columns.length){
                    let _newRows = [...state.rows];
                    if(action.copySelected === ''){
                        _newRows.splice(0,0,action.payload)
                    }else if(action.copySelected*1<state.rows.length){
                        _newRows.splice((action.copySelected*1)+1,0,action.payload)
                    }else{
                        _newRows.push(action.payload);
                    }
                    //
                    return {...state,rows:_newRows}
                }else{
                    console.debug('invalid payload of new copy row')
                }
            }
            return state;
        case actionTypes.COPIES_ROW_REMOVE:
            if(typeof action.payload != 'undefined'){
                return {...state,rows:state.rows.filter((r,i)=>{return i+''!=action.payload+''})}
            }
            return state;
        case actionTypes.COPIES_ROW_SET:
            if(typeof action.payload != 'undefined' && typeof action.copySelected != 'undefined' && typeof action.columnSelected != 'undefined'){
                let _selectedColumnID = 0;
                state.columns.forEach((c,i)=>{
                    if(c.target == action.columnSelected){
                        _selectedColumnID = i;
                    }
                })
                let _newRows = [...state.rows];
                _newRows[action.copySelected][_selectedColumnID] = action.payload;
                return {...state,rows:_newRows}
            }else{
                console.debug('invalid payload to change row')
            }
            return state;
        default:
            return state;
    }
}

export default copyReducer;