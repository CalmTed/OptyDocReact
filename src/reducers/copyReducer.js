import actionTypes from "./actionTypes";
const getinitialState = () => {
    if(window.localStorage.getItem('ODStore') == undefined){
        return  {
            //data for copy values: name, title, type, options
            columns:[{
                title:'',
                target:'',
                type:'',
                options:''
            }],
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
                    _ret = {...state,rows:_payload}   
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
                action.payload.forEach(col=>{
                    
                    ['target','title','options','type'].forEach(prop=>{
                        _valid = typeof col[prop] == 'undefined'?false:true;
                    })
                })
                if(_valid){
                    return {...state,columns:action.payload}
                }
            }
            return state;
        default:
            return state;
    }
}

export default copyReducer;