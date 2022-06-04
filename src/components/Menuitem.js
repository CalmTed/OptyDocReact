import React from 'react';
import Icon from './Icon';
import actionTypes from '../reducers/actionTypes';
import t from '../local.ts';
import { TAB_NAMES, MI_INPUT_TYPES } from '../constants/constants'

function Menuitem(props) {
    const stateNow = props.store.getState();
    const valueMI = props.value.split('.');
    const getClasses = ()=>{
        let ret = '';
        switch(props.type){
            case MI_INPUT_TYPES.text:
                ret +='text'
                break;
            case MI_INPUT_TYPES.textarea:
                ret +='textarea'
                break;
            case MI_INPUT_TYPES.selector:
                ret +='selector'
                break;
            case MI_INPUT_TYPES.file:
                ret +='file'
                break;
        }
        // ret += props.type
        return ret;
    }
    const compareArr = (a,b)=>{
        if(!(a&&b)){
            return false;
        }
        let _ret = true;
        if(a.length != b.length){
            return false;
        }
        a.forEach((av,ai)=>{
            b.forEach((bv,bi)=>{
                if(ai===bi && av!==bv){
                    _ret = false;
                }
            })
        })
        return _ret;
    }
    const uploadFile = (_e,_fileType,_actionType)=>{
        let _file = _e.target.files[0];
        let _fileText = '';
        if(_file.name.substr(-(_fileType.length),_fileType.length) === _fileType){
            //geting text value of csv file
            let fr = new FileReader();
            fr.onload = function(){
                //parsing csv
                _fileText = fr.result;
                function parseCSV(str) {
                    var arr = [];
                    var quote = false;
                    for (var row = 0, col = 0, c = 0; c < str.length; c++) {
                        var cc = str[c], nc = str[c+1];
                        arr[row] = arr[row] || [];
                        arr[row][col] = arr[row][col] || ''; 
                        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
                        if (cc == '"') { quote = !quote; continue; }
                        if (cc == ',' && !quote) { ++col; continue; }
                        if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }
                        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
                        if (cc == '\r' && !quote) { ++row; col = 0; continue; }
                        arr[row][col] += cc;
                    }
                    return arr;
                }
                // console.log(_fileText)
                let _formatedTableData = parseCSV(_fileText)
                //read first line
                
                //check length of all rows
                if(compareArr(_formatedTableData[0],stateNow.copies.columns.map(col=>{return col.title}) )){
                    let _valid = true;
                    _formatedTableData.forEach((row)=>{
                        if(row.length!=_formatedTableData[0].length){
                            _valid = false;
                        }
                    });
                    if(_valid){
                        props.store.dispatch({type:_actionType ,payload:_formatedTableData});
                    }else{
                        console.log('invalid table')
                    }
                }else{
                    console.log('wrong size')
                }
            }                        
            fr.readAsText(_file);
        }
    }
    const handleMIchange = (e)=>{
        if(valueMI[0] == 'customAction'){
            switch(valueMI[1]){
                case 'uploadCSV':
                    uploadFile(e,props.fileType,actionTypes.COPIES_DATA_SET)
                    break;
                case 'downloadCSV':
                    const saveTable = (_textToSave,_fileName)=> {
                        let _link = document.createElement("a");
                        document.body.appendChild(_link);
                        _link.style = "display: none";
                        let _url = "data:text/csv;charset=utf-8,%EF%BB%BF"+ encodeURI(_textToSave);
                        _link.href = _url;
                        _link.download = _fileName;
                        _link.click();
                        window.URL.revokeObjectURL(_url);
                    };
                    const columnsTitles = stateNow.copies.columns.map(col=>{
                        return col.title;
                    })
                    const columnsRows = stateNow.copies.rows[0];
                    let _tts = columnsTitles;//"table to save"
                    if(columnsTitles.length,columnsRows.length){
                        //safe saving cells with commas
                        _tts = _tts.concat(stateNow.copies.rows.map(row=>{
                            let _ret = row.map(cell=>{
                                let __ret = cell;
                                if(cell.indexOf(',') > -1){
                                    __ret =    `"${cell}"`;
                                }
                                return __ret;
                            }).join(',')
                            return _ret;
                        })).join('\r\n')
                    }
                    saveTable(_tts,stateNow.template.name+'_table.csv')
                    break;
                case 'addCopyRow':
                    let _newRowToAdd = ()=>{
                        return stateNow.copies.columns.map((col)=>{
                            if(col.type == 'selector'){
                                return col.options[0];
                            }else if (col.type == 'variable'){
                                return stateNow.template.children.filter(ch=>{return ch.uuid+'' === col.target})[0].innerText;
                            }else{
                                return col.title;
                            }
                        })
                    }
                    props.store.dispatch({type:actionTypes.COPIES_ROW_ADD,payload:_newRowToAdd(),copySelected:stateNow.app.copySelected})
                    break;
                case 'removeCopyRow':
                    props.store.dispatch({type:actionTypes.COPIES_ROW_REMOVE,payload:stateNow.app.copySelected})
                    break;
                case 'print':
                    window.print();
                break;
                default:break;
            }
        }else{
            //manual action handling
            if(props.action){
                if(stateNow.app.tabSelected == TAB_NAMES.edit ){
                    props.store.dispatch({type:props.action,payload:e.target.value,blockSelected:stateNow.app.blockSelected})
                }else if(stateNow.app.tabSelected == TAB_NAMES.copy ){
                    props.store.dispatch({type:props.action,payload:e.target.value,copySelected:stateNow.app.copySelected,columnSelected:props.columnSelected})
                }
                //changing selectedBlock
                if(stateNow.app.blockSelected !== ''){
                    let selectedBlockObject = stateNow.template.children.filter((b)=>{return b.uuid === stateNow.app.blockSelected})[0]
                    //editing copies columns table
                    if(
                        ((props.action == actionTypes.BLOCK_INNER_TEXT_SET)||(props.action == actionTypes.BLOCK_VALUE_TYPE_SET)||(props.action == actionTypes.BLOCK_VARIABLE_TITLE_SET))
                        ){
                        //loop through all children and find ones that have variable and selectors
                        let variablesListObjects = stateNow.template.children.filter((b)=>{
                            return ['selector','variable','date'].indexOf(b.valueType) >-1
                        })
                        let columnsObject = (variablesListObjects)=>{
                            let ret = [];
                            variablesListObjects.forEach(obj=>{
                                let _type = 'variable';
                                let _options = [''];
                                if(obj.valueType == 'selector'){
                                    _type = obj.valueType;
                                    _options = obj.innerText.split('\n');
                                }
                                ret.push({
                                    target:obj.uuid+'',
                                    title:obj.variableTitle,
                                    type:_type,
                                    options:_options
                                })
                            })
                            
                            return ret;
                        }
                        props.store.dispatch({type:actionTypes.COPIES_COLUMNS_SET,payload:columnsObject(variablesListObjects)   })
                        //dispatch an action
                    }
                }
                //calculate how much there might be blocks
                if([actionTypes.BLOCK_WIDTH_SET,actionTypes.BLOCK_HEGHT_SET,actionTypes.BLOCK_DISPLAY_TYPE_SET,actionTypes.BLOCK_MARGIN_TOP_SET,actionTypes.BLOCK_MARGIN_BOTTOM_SET,actionTypes.BLOCK_MARGIN_LEFT_SET,actionTypes.BLOCK_MARGIN_RIGHT_SET].indexOf(props.action)>-1){
                    
                    //TODO remove this timeout
                    //VERY BAD IMPLEMENTATION
                    //but cant access rendered block size b.c. it is not rendered yet 
                    setTimeout(()=>{
                        let farthestHeight = 0;
                        let farthestWidth = 0;
                        stateNow.template.children.filter(ch=>{return ch.parentID === ''}).forEach(rootChild=>{
                            let childDomObj = document.getElementById(rootChild.uuid)
                            // console.log(childDomObj,childDomObj.clientWidth,childDomObj.offsetLeft,childDomObj.clientWidth+childDomObj.offsetLeft)
                            // console.log(childDomObj,childDomObj.clientHeight,childDomObj.offsetTop,childDomObj.clientHeight+childDomObj.offsetTop)
                            childDomObj.clientWidth+childDomObj.offsetLeft>farthestWidth?farthestWidth = childDomObj.clientWidth+childDomObj.offsetLeft:0;
                            childDomObj.clientHeight+childDomObj.offsetTop>farthestHeight?farthestHeight = childDomObj.clientHeight+childDomObj.offsetTop:0;
                        })
                        let pageDomObj = document.querySelector('.PageInner')
                        let pageDomObjStyle = getComputedStyle(document.querySelector('.PageInner'))
                        let pageDomObjStylePadingWidth = parseInt(pageDomObjStyle.paddingLeft) + parseInt(pageDomObjStyle.paddingRight) +1;
                        let pageDomObjStylePadingHeight = parseInt(pageDomObjStyle.paddingTop) + parseInt(pageDomObjStyle.paddingBottom) +1;
                        let pageInnerWidth = (pageDomObj.clientWidth - pageDomObjStylePadingWidth);
                        let pageInnerHeight = (pageDomObj.clientHeight - pageDomObjStylePadingHeight);

                        let blockOuterWidth = farthestWidth - parseInt(pageDomObjStyle.paddingLeft) - pageDomObj.offsetLeft +1;
                        let blockOuterHeight = farthestHeight - parseInt(pageDomObjStyle.paddingTop) - pageDomObj.offsetTop +1;
                        // console.log('name','width','height')
                        // console.log('page',pageInnerWidth,pageInnerHeight)
                        // console.log('block',blockOuterWidth,blockOuterHeight)
                        // console.log('diff',pageInnerWidth/blockOuterWidth,pageInnerHeight/blockOuterHeight)
                        let fitW = Math.floor(pageInnerWidth / blockOuterWidth);
                        let fitH = Math.floor(pageInnerHeight / blockOuterHeight);
                        if(fitW ===0 && Math.abs(pageInnerWidth - blockOuterWidth) < 5){//some error is ok for flex
                            fitW = 1;
                        }
                        if(fitH ===0 && Math.abs(pageInnerHeight - blockOuterHeight) < 5){//some error is ok for flex
                            fitH = 1;
                        }
                        // console.log(fitH,fitW)
                        // console.log('-----')
                        props.store.dispatch({type:actionTypes.TEMPLATE_FITS_W_SET,payload:fitW})
                        props.store.dispatch({type:actionTypes.TEMPLATE_FITS_H_SET,payload:fitH})
                    },500)
                }
            }else{
                console.warn('No action specify')
            }
        }
    }
    const getContent = ()=>{
        let ret = [];

        let inputValue = ()=>{
            let ret = ''
            if(valueMI[0] == 'selectedBlock'){
                //search for needed block
                let selectedBlockID = stateNow.app.blockSelected;
                let selectedBlockObject = stateNow.template.children.filter((b)=>{return b.uuid == selectedBlockID})[0]
                if(selectedBlockObject[valueMI[1]]){
                    ret = selectedBlockObject[valueMI[1]];
                }else if(selectedBlockObject.style[valueMI[1]]){
                    ret = selectedBlockObject.style[valueMI[1]];
                }else{  }
            }
            if(valueMI[0] == 'selectedCopy'){
                let _selectedColumnID = 0;
                stateNow.copies.columns.forEach((c,i)=>{
                    if(c.target == props.columnSelected){
                        _selectedColumnID = i;
                    }
                })
                if(typeof stateNow.copies.rows[stateNow.app.copySelected] != 'undefined' && stateNow.copies.rows[stateNow.app.copySelected][_selectedColumnID] != null){
                    ret = stateNow.copies.rows[stateNow.app.copySelected][_selectedColumnID]
                }
            }
            if(stateNow[valueMI[0]]){
                ret =  stateNow[valueMI[0]][valueMI[1]];
            }
            return ret;
        }
        switch(props.type){
            case MI_INPUT_TYPES.text:
                ret.push(<input key={valueMI[1]+'TextInput'} value={inputValue()} onChange={handleMIchange} placeholder={props.placeholder} title={t(valueMI[1])}/>);
                // ret.push(<textarea key={target[1]} className='text' onChange={handleMIchange} placeholder={props.placeholder} title={target[1]}>{inputValue()}</textarea>);
                break;
            case MI_INPUT_TYPES.textarea:
                ret.push(<textarea key={valueMI[1]+'TextareaInput'} className='textarea' value={inputValue()} onChange={handleMIchange} placeholder={props.placeholder} title={t(valueMI[1])}></textarea>);
                // ret.push(<input key={target[1]} value={inputValue()} onChange={handleMIchange} placeholder={props.placeholder} title={target[1]}/>);
                break;
            case MI_INPUT_TYPES.size:
                ret.push(<input key={valueMI[1]+'SizeInput'} className='size' value={inputValue()} onChange={handleMIchange} placeholder={props.placeholder}  title={t(valueMI[1])}/>);
                break;
            case MI_INPUT_TYPES.color:
                ret.push(<input key={valueMI[1]+'ColorInput'} className='color' type='color' value={inputValue()} onChange={handleMIchange} placeholder={props.placeholder}  title={t(valueMI[1])}/>);
                break;
            case MI_INPUT_TYPES.selector:
                
                let _options = [['','']];
                let miOptionsName = valueMI[1]+'Options';
                let targetObject = stateNow[valueMI[0]];
                if(valueMI[0] == 'selectedBlock'){
                    let selectedBlockID = stateNow.app.blockSelected;
                    targetObject = stateNow.template.children.filter((b)=>{return b.uuid == selectedBlockID})[0]
                }
                if(typeof props.options == 'undefined' || props.options.length == 0){
                    if(targetObject[miOptionsName]){
                        _options = targetObject[miOptionsName];
                    }else if(targetObject.style[miOptionsName]){
                        _options = targetObject.style[miOptionsName];
                    }
                }else{
                    _options = props.options;
                }
                let options = _options.map(([title,optionValue],index)=>{
                    //check if we need to translate
                    if(valueMI[0] == 'selectedCopy'){
                        return <option key={index} value={optionValue}>{title}</option>
                    }else{
                        return <option key={index} value={optionValue}>{t(title)}</option>
                    }
                })
                ret.push(<select key={valueMI[1]+'SelectorInput'} onChange={handleMIchange} value={inputValue()} title={valueMI[1]} >{options}</select>);
                break;
            case MI_INPUT_TYPES.button:
                const getButtonClass = ()=>{
                    let _ret = '';
                    props.primary ? _ret+= 'primary': _ret+=''
                    return _ret;
                }
                const getButtonTitle = ()=>{
                    let _ret = [];
                    props.title ? _ret.push(<span key='buttonTitle'>{props.title}</span>) :  false;
                    return _ret;
                }
                ret.push(<button className={getButtonClass()} key={valueMI[1]} onClick={handleMIchange} title={valueMI[1]} ><Icon image={props.icon} store={props.store}/>{getButtonTitle()}</button>);
                break;
            case MI_INPUT_TYPES.file:
                const getTitle = ()=>{
                    let _ret = [];
                    props.title ? _ret.push(<span key='title'>{props.title}</span>) :  false;
                    return _ret;
                }
                ret.push(<label className='fileinput' key={valueMI[1]+'Label'} title={valueMI[1]} >
                            <Icon image={props.icon} store={props.store}/>
                            {getTitle()}
                            <input key={valueMI[1]+'hiddenInput'} type='file' style={{'display':'none'}} onChange={handleMIchange} accept=".csv"/>
                        </label>)
                break;
        }
        return ret;
    }
    return (
        <div className={'Menuitem '+ getClasses()}>
            {getContent()}
        </div>
    );
}

export default Menuitem;
