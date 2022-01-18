import React from 'react'
import Tab from './Tab';
import Menuitem from './Menuitem';
import actionTypes from '../reducers/actionTypes';

function Sidemenu(props) {
  const stateNow = props.store.getState();
  const getEditMenuContent = ()=>{
    let ret = [];
    //TODO get if any block selected
    //TODO get if template selected
    const selectBlock = e=>{
      props.store.dispatch({type:actionTypes.SELECTEDBLOCK_SET,payload:e.target.id.replace('_link','')})
    }
    const createBlockLink = (_uuid,_title)=>{
      return <span id={_uuid+'_link'} className='blockLink' key={_uuid} onClick={selectBlock}>{_title}</span>
    }

    if(stateNow.app.blockSelected == ''){
      //TEMPLATE SETINGS
      ret.push(<div className='spacer' key='spacerTemplate' >Template</div>);
      ret.push(<Menuitem key='name' store={props.store} value="template.name" action={actionTypes.TEMPLATE_NAME_SET} type="text" placeholder="Template name" />)
      ret.push(<Menuitem key='pageSize' store={props.store} value="template.pageSize" action={actionTypes.TEMPLATE_PAGE_SIZE_SET} type="selector" />)
      ret.push(<Menuitem key='pageOrientation' store={props.store} value="template.pageOrientation" action={actionTypes.TEMPLATE_PAGE_ORIENATION_SET} type="selector" />)
      ret.push(<div className='spacer' key='spacerMargin' >Margin</div>)
      ret.push(<Menuitem key='marginTop' store={props.store} value="template.marginTop" action={actionTypes.TEMPLATE_MARGIN_TOP_SET} type="size" placeholder="M top" />)
      ret.push(<Menuitem key='marginBottom' store={props.store} value="template.marginBottom" action={actionTypes.TEMPLATE_MARGIN_BOTTOM_SET} type="size" placeholder="M bottom" />)
      ret.push(<Menuitem key='marginLeft' store={props.store} value="template.marginLeft" action={actionTypes.TEMPLATE_MARGIN_LEFT_SET} type="size" placeholder="M left" />)
      ret.push(<Menuitem key='marginRight' store={props.store} value="template.marginRight" action={actionTypes.TEMPLATE_MARGIN_RIGHT_SET} type="size" placeholder="M right" />)
      
      var blockSelectedChildrenList = [];
      stateNow.template.children.forEach(ch => {
        if(ch.parentID == ''){
          blockSelectedChildrenList.push(ch)
        }
      });
      if(blockSelectedChildrenList.length){
        ret.push(<div className='blockNavigator' key='children'><div className='blockChildren'>Children: {blockSelectedChildrenList.map(chi=>{
          let _ret = [];
          _ret.push(createBlockLink(chi.uuid,chi.humanfriendlyID));
          return _ret;
        })}</div></div>)
      }
    }else{
      //SELECTED BLOCK SETTINGS
      const blockSelectedObject = stateNow.template.children.filter(ch=>{return ch.uuid == stateNow.app.blockSelected})[0]
      var blockSelectedChildrenList = [];
      var blockSelectedNeigborList = [];
      var blockSelectedParentObject = '';
      stateNow.template.children.forEach(ch => {
        if(ch.parentID == blockSelectedObject.uuid){//get all children
          blockSelectedChildrenList.push(ch)
        }
        if(ch.parentID == blockSelectedObject.parentID && ch.uuid !== blockSelectedObject.uuid){//get all with the same parent
          blockSelectedNeigborList.push(ch);
        }
        if(ch.uuid == blockSelectedObject.parentID){//get all neigbors
          blockSelectedParentObject = ch;
        }
      });
      
      const getNavLinks = (blockSelectedObject,blockSelectedParentObject,blockSelectedNeigborList,blockSelectedChildrenList)=>{    
        let _ret = [];
        _ret.push(<div key='name' className='blockName'>Block: {blockSelectedObject.humanfriendlyID}</div>)
    
        if(blockSelectedParentObject !== ''){
          _ret.push(<div key='parent' className='blockParent'>Parent: {createBlockLink(blockSelectedParentObject.uuid,blockSelectedParentObject.humanfriendlyID)}</div>)
        }
        if(blockSelectedNeigborList.length){
          _ret.push(<div key='neigbor' className='blockNeigbor'>Neigbors: {blockSelectedNeigborList.map(nei=>{
            let _ret = [];
            _ret.push(createBlockLink(nei.uuid,nei.humanfriendlyID));
            return _ret;
          })}</div>)
        }
        if(blockSelectedChildrenList.length){
          _ret.push(<div key='children' className='blockChildren'>Children: {blockSelectedChildrenList.map(chi=>{
            let _ret = [];
            _ret.push(createBlockLink(chi.uuid,chi.humanfriendlyID));
            return _ret;
          })}</div>)
        }
        return _ret;
      }
      ret.push(<div key='nav' className="blockNavigator" >{
        
        getNavLinks(blockSelectedObject,blockSelectedParentObject,blockSelectedNeigborList,blockSelectedChildrenList)
      }</div>)
      const genBlockMI = (_miData)=>{
        //miData: value,type,action
        let _placeholder = _miData.value;
        ret.push(<Menuitem key={_miData.value} store={props.store} value= {'selectedBlock.'+_miData.value} type={_miData.type} action={_miData.action} placeholder={_placeholder} />)
      }
      genBlockMI({value:'width',type:'size',action:actionTypes.BLOCK_WIDTH_SET})
      genBlockMI({value:'height',type:'size',action:actionTypes.BLOCK_HEGHT_SET})
      genBlockMI({value:'displayType',type:'selector',action:actionTypes.BLOCK_DISPLAY_TYPE_SET})
      genBlockMI({value:'backgroundColor',type:'color',action:actionTypes.BLOCK_BACKGROUND_COLOR_SET})
      if(blockSelectedObject.style.displayType !== 'inline'){
        ret.push(<div className='spacer' key='spacerAlign' >Align</div>)
        genBlockMI({value:'alignVertical',type:'selector',action:actionTypes.BLOCK_ALIGN_VERTICAL_SET})
        genBlockMI({value:'alignHorizontal',type:'selector',action:actionTypes.BLOCK_ALIGN_HORIZONTAL_SET})
        ret.push(<div className='spacer' key='spacerMargin' >Margin</div>)
        genBlockMI({value:'marginTop',type:'size',action:actionTypes.BLOCK_MARGIN_TOP_SET})
        genBlockMI({value:'marginBottom',type:'size',action:actionTypes.BLOCK_MARGIN_BOTTOM_SET})
        genBlockMI({value:'marginLeft',type:'size',action:actionTypes.BLOCK_MARGIN_LEFT_SET})
        genBlockMI({value:'marginRight',type:'size',action:actionTypes.BLOCK_MARGIN_RIGHT_SET})
      }
      ret.push(<div className='spacer' key='spacerText' >Text</div>)
      genBlockMI({value:'fontFamily',type:'selector',action:actionTypes.BLOCK_FONT_FAMILY_SET})
      genBlockMI({value:'fontSize',type:'size',action:actionTypes.BLOCK_FONT_SIZE_SET})
      genBlockMI({value:'fontColor',type:'color',action:actionTypes.BLOCK_FONT_COLOR_SET})
      genBlockMI({value:'fontBold',type:'selector',action:actionTypes.BLOCK_FONT_BOLD_SET})
      genBlockMI({value:'fontItalic',type:'selector',action:actionTypes.BLOCK_FONT_ITALIC_SET})
      
      if(blockSelectedChildrenList.length == 0){
        ret.push(<div className='spacer' key='spacerContent' >Content</div>)
        genBlockMI({value:'valueType',type:'selector',action:actionTypes.BLOCK_VALUE_TYPE_SET})
        if(blockSelectedObject.valueType !== 'copied'){
          genBlockMI({value:'innerText',type:'textarea',action:actionTypes.BLOCK_INNER_TEXT_SET})
        }else{
          //TODO check whitch copy channels exists 
          //show link if it is
          genBlockMI({value:'copyChannel',type:'text',action:actionTypes.BLOCK_COPY_CHANNEL_SET})
        } 
      }
      ret.push(<div className='spacer' key='spacerCustomCSS' >Custom CSS</div>)
      genBlockMI({value:'customStyle',type:'textarea',action:actionTypes.BLOCK_CUSTOM_STYLE_SET})
    }
    return ret;
  }
  const getCopyMenuContent = ()=>{
    let ret = [];
    ret.push(<div className='spacer' key='spacerCopyData' >Data to copy</div>)
    ret.push(<Menuitem key='selectCSV' store={props.store} value="customAction.uploadCSV" type="file" fileType='csv' primary="true" title="Select CSV" icon="hash"/>)
    ret.push(<Menuitem key='downloadCSV' store={props.store} value="customAction.downloadCSV" type="button"  title="" icon="download"/>)    
    return ret;
  }
  const getPrintMenuContent = ()=>{
    let ret = [];
    ret.push(<div className='spacer' key='spacerPrint' >Print options</div>)
    ret.push(<Menuitem key='print' store={props.store} value="customAction.print" type="button" primary="true" title="Print" icon="print"/>)
    return ret;
  }
  const getSitemenuContent = ()=>{
    let ret = [];
    switch (stateNow.app.tabSelected){
      case 'edit':
       ret = [...getEditMenuContent()]
        break;
      case 'copy':
        ret = [...getCopyMenuContent()]
        break;
      case 'print':
        ret = [...getPrintMenuContent()]
        break;
      default:
        ret.push(<div className='spacer' key='spacerNoTabSelected' >No tab selected</div>)
        break;
    }
    return ret;
  }
  return (
    <div className='Sidemenu'>
        <div className='tabs'>
          {stateNow.app.tabSelectedOptions.map(([tabTitle,tabValue],i)=>{
            return <Tab tabIndex={i+1} key={tabValue} store={props.store} tabName={tabTitle} tabValue={tabValue}/>
          })}
        </div>
        <div className='menuitems'>
          {getSitemenuContent()}
        </div>
    </div>
  );
}

export default Sidemenu;
