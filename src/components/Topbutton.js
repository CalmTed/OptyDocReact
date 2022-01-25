import React from 'react'
import Icon from './Icon';
import actionTypes from '../reducers/actionTypes';
import t from '../local.ts'
function Topbutton(props) {
    var disabled = false;
    if(props.disabled){
        disabled = true;
    }
    switch(props.name){
        case 'removeBlock':
            if(! props.store.getState().app.blockSelected !== ''){
                disabled = true;
            }
            break;
    }
    const isDisabled = ()=>{
        if(disabled){
            return 'disabled'
        }else{
            return ''
        }
    }
    const handleClick = (e)=>{
        //TODO check if not disabled
        const _blockSelected = props.store.getState().app.blockSelected;
        const getCheckSum = (_string = '')=>{
            return Math.abs(_string.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a}));
        }
        if(disabled){
            return false;
        }
        switch(props.name){
            case 'settings':
                props.store.dispatch({type:actionTypes.COLORMODE_TOGGLE,payload:''});
                break;
            case 'newBlock':
                props.store.dispatch({type:actionTypes.TEMPLATE_NEW_BLOCK_ADD,payload:'',blockSelected:_blockSelected});
                break;
            case 'removeBlock':
                props.store.dispatch({type:actionTypes.SELECTEDBLOCK_SET,payload:''})
                props.store.dispatch({type:actionTypes.TEMPLATE_BLOCK_REMOVE,payload:'',blockSelected:_blockSelected});
                break;
            case 'newTemplate':
                const setNewTemp = ()=>{
                    props.store.dispatch({type:actionTypes.TEMPLATE_NEW_TEMPLATE,payload:''});
                    props.store.dispatch({type:actionTypes.COPIES_COLUMNS_SET ,payload:[]});
                    props.store.dispatch({type:actionTypes.COPIES_DATA_SET,payload:[]});
                    props.store.dispatch({type:actionTypes.SELECTEDBLOCK_SET,payload:''});
                }
                if(props.store.getState().template.dateEdited !== '0'){
                    if(confirm(t('Delete existing?'))){
                        setNewTemp()
                    }
                }else{
                    setNewTemp()
                }
                break;
            case 'exportTemplate':
                const saveFile = (_textToSave,_fileName)=> {
                    let _link = document.createElement("a");
                    document.body.appendChild(_link);
                    _link.style = "display: none";
                    let _url = "data:application/json;charset=utf-8,%EF%BB%BF"+ encodeURI(_textToSave);
                    _link.href = _url;
                    _link.download = _fileName;
                    _link.click();
                    window.URL.revokeObjectURL(_url);
                };
                let fileContent = {...props.store.getState().template};
                fileContent.version = props.store.getState().app.version;
                fileContent.checksum = getCheckSum(JSON.stringify(fileContent))
                let fileJSONContent = JSON.stringify(fileContent);
                saveFile(fileJSONContent,props.store.getState().template.name+'.optydoc');
                break;
            case 'importTemplate':
                if(typeof e.target == 'undefined'){
                    return false;
                }
                if(typeof e.target.files == 'undefined'){
                    return false;
                }
                if(typeof e.target.files[0] == 'undefined'){
                    return false;
                }
                if(props.store.getState().template.dateEdited !== '0'){
                    if(!confirm(t('Delete existing?'))){
                        return false;
                    }
                }
                let _file = e.target.files[0];
                let _fileText = '';
                let _fr = new FileReader();
                _fr.onload = function(){
                    _fileText = _fr.result;
                    let _templateData = JSON.parse(_fileText);
                    let _valid = true;
                    //check checksum
                    if(_templateData.checksum !== getCheckSum(_fileText.replace(/,"checksum":\d{1,10}/,''))){
                        _valid=false
                        console.warn('invalid checksum')
                    }
                    //check version
                    if(_templateData.version !== props.store.getState().app.version){
                        _valid=false
                        console.warn('invalid version')
                    }
                    if(_valid){
                        props.store.dispatch({type:actionTypes.TEMPLATE_OPEN_TEMPLATE ,payload:_templateData});
                    }else{
                        //TO DO info box here
                        console.warn('invalid file')
                    }
                }
                _fr.readAsText(_file);
                break;
            case 'language':
                props.store.dispatch({type:actionTypes.LANGCODE_TOGGLE});
                break;
        }
    }
    const handleTemplateImport = (e)=>{
        !disabled?handleClick(e):0;
    }
    const handleKeyPress = (e)=>{
        e.key == 'Enter'?handleClick():0;
    }
    const getIcon = ()=>{
        if(props.name == 'settings'){
            if(props.store.getState().app.colorMode == 'light'){
                return <Icon key={props.name} image='darkMode' store={props.store}></Icon>;
            }else{
                return <Icon key={props.name} image='lightMode' store={props.store}></Icon>;
            }
        }else{
            return <Icon key={props.name} image={props.name} store={props.store}></Icon>;
        }
    }
    const getContent = ()=>{
        let ret = []
        if(props.name == 'importTemplate'){
            ret.push(<label key={props.name+'Label'} title={t(props.name)} >
                <Icon image={props.name} store={props.store}/>
                <input key={props.name+'HiddenInput'} type='file' style={{'display':'none'}} onChange={handleTemplateImport} accept=".optydoc"/>
            </label>)
        }else{
            ret.push(getIcon())
        }
        return ret;
    }
    return (
    <div className={'Topbutton'+ ' tbtn-'+props.name + ' '+ isDisabled()} tabIndex={!disabled?'7':''} onClick={handleClick} onKeyPress={handleKeyPress} title={t(props.name)}>
        {getContent()}
    </div>
    );
}

export default Topbutton;
