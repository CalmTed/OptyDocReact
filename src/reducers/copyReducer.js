import actionTypes from "./actionTypes";
const getinitialState = () => {
  if(!window.localStorage.getItem("ODStore")) {
    return  {
      //data for copy values: name, title, type, options
      columns:[],
      //with title row
      rows:[]
    };  
  }else {
    console.debug("Getting copies data from localstorage");
    return JSON.parse(window.localStorage.getItem("ODStore")).copies;
  } 
};
const copyReducer = (state = getinitialState(), action) => {
  switch(action.type) {
  case actionTypes.COPIES_DATA_SET:
    //TODO check length of each cell
    let newState = state;
    let payload = action.payload;
    const compareArr = (a = [], b) => {
      let isSame = true;
      if(a.length !== b.length) {
        return false;
      }
      a.forEach((av, ai) => {
        b.forEach((bv, bi) => {
          if(ai === bi && av !== bv) {
            isSame = false;
          }
        });
      });
      return isSame;
    };
    if(compareArr(payload[0], state.columns.map(col => { return col.title; }))) {
      let isValid = true;
      payload.forEach((row) => {
        if(row.length > payload[0].length) {
          isValid = false;
        }
      });
      if(isValid) {
        newState = {...state,
          rows:payload.slice(1)};   
      }
    }else if(!payload.length) {
      newState = {...state,
        rows:[]};
    }
    return newState;
  case actionTypes.COPIES_COLUMN_ADD:
    return state;
  case actionTypes.COPIES_COLUMN_REMOVE:
    return state;
  case actionTypes.COPIES_COLUMNS_SET:
    if(typeof action.payload === "object") {
      let isValid = true;
      action.payload.forEach(c => {
        isValid = Object.keys(c).join(",") === "target,title,type,options" ? true : false;
      });
      if(isValid) {
        return {...state,
          columns:action.payload};
      }else{
                    
        console.warn("invalid cols", Object.keys(action.payload).join(","), "target,title,type,options");
      }
    }
    return state;
  case actionTypes.COPIES_ROW_ADD:
    if(typeof action.payload === "object" && typeof action.copySelected !== "undefined") {
      if(action.payload.length === state.columns.length) {
        let newRows = [...state.rows];
        if(action.copySelected === "") {
          newRows.splice(0, 0, action.payload);
        }else if(action.copySelected * 1 < state.rows.length) {
          newRows.splice((action.copySelected * 1) + 1, 0, action.payload);
        }else{
          newRows.push(action.payload);
        }
        //
        return {...state,
          rows:newRows};
      }else{
        console.debug("invalid payload of new copy row");
      }
    }
    return state;
  case actionTypes.COPIES_ROW_REMOVE:
    if(typeof action.payload !== "undefined") {
      return {...state,
        rows:state.rows.filter((r, i) => { return i + "" !== action.payload + ""; })};
    }
    return state;
  case actionTypes.COPIES_ROW_SET:
    if(typeof action.payload !== "undefined" && typeof action.copySelected !== "undefined" && typeof action.columnSelected !== "undefined") {
      let selectedColumnID = 0;
      state.columns.forEach((c, i) => {
        if(c.target === action.columnSelected) {
          selectedColumnID = i;
        }
      });
      let newRows = [...state.rows];
      newRows[action.copySelected][selectedColumnID] = action.payload;
      return {...state,
        rows:newRows};
    }else{
      console.debug("invalid payload to change row");
    }
    return state;
  default:
    return state;
  }
};

export default copyReducer;