import React from 'react'
import Tab from './Tab';
import Menuitem from './Menuitem';
import actionTypes from '../reducers/actionTypes';
import t from '../local.ts';
import { TAB_NAMES, MI_INPUT_TYPES } from '../constants/constants'
import { BLOCK_STYLE_NAMES } from '../constants/block'

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

    if(stateNow.app.blockSelected === '' ||stateNow.template.children.length === 0){
      //TEMPLATE SETINGS
      ret.push(<div className='spacer' key='spacerTemplate' >{t('Template')}</div>);
      ret.push(<Menuitem key='name' store={props.store} value="template.name" action={actionTypes.TEMPLATE_NAME_SET} type={ MI_INPUT_TYPES.text } placeholder="Template name" />)
      ret.push(<Menuitem key='pageSize' store={props.store} value="template.pageSize" action={actionTypes.TEMPLATE_PAGE_SIZE_SET} type={ MI_INPUT_TYPES.selector } />)
      ret.push(<Menuitem key='pageOrientation' store={props.store} value="template.pageOrientation" action={actionTypes.TEMPLATE_PAGE_ORIENATION_SET} type={ MI_INPUT_TYPES.selector } />)
      ret.push(<div className='spacer' key='spacerMargin' >{t('Margin')}</div>)
      ret.push(<Menuitem key='marginTop' store={props.store} value="template.marginTop" action={actionTypes.TEMPLATE_MARGIN_TOP_SET} type={ MI_INPUT_TYPES.size } placeholder="M top" />)
      ret.push(<Menuitem key='marginBottom' store={props.store} value="template.marginBottom" action={actionTypes.TEMPLATE_MARGIN_BOTTOM_SET} type={ MI_INPUT_TYPES.size } placeholder="M bottom" />)
      ret.push(<Menuitem key='marginLeft' store={props.store} value="template.marginLeft" action={actionTypes.TEMPLATE_MARGIN_LEFT_SET} type={ MI_INPUT_TYPES.size } placeholder="M left" />)
      ret.push(<Menuitem key='marginRight' store={props.store} value="template.marginRight" action={actionTypes.TEMPLATE_MARGIN_RIGHT_SET} type={ MI_INPUT_TYPES.size } placeholder="M right" />)
      
      var blockSelectedChildrenList = [];
      stateNow.template.children.forEach(ch => {
        if(ch.parentID === ''){
          blockSelectedChildrenList.push(ch)
        }
      });
      if(blockSelectedChildrenList.length){
        ret.push(<div className='blockNavigator' key='children'><div className='blockChildren'>{t('Children: ')}{blockSelectedChildrenList.map(chi=>{
          let _ret = [];
          _ret.push(createBlockLink(chi.uuid,chi.humanfriendlyID));
          return _ret;
        })}</div></div>)
      }
    }else{
      //SELECTED BLOCK SETTINGS
      const blockSelectedObject = stateNow.template.children.filter(ch=>{return ch.uuid+'' === stateNow.app.blockSelected+''})[0]
      var blockSelectedChildrenList = [];
      var blockSelectedNeigborList = [];
      var blockSelectedParentObject = '';
      stateNow.template.children.forEach(ch => {
        if(ch.parentID === blockSelectedObject.uuid){//get all children
          blockSelectedChildrenList.push(ch)
        }
        if(ch.parentID === blockSelectedObject.parentID && ch.uuid !== blockSelectedObject.uuid){//get all with the same parent
          blockSelectedNeigborList.push(ch);
        }
        if(ch.uuid === blockSelectedObject.parentID){//get all neigbors
          blockSelectedParentObject = ch;
        }
      });
      
      const getNavLinks = (blockSelectedObject,blockSelectedParentObject,blockSelectedNeigborList,blockSelectedChildrenList)=>{    
        let _ret = [];
        _ret.push(<div key='name' className='blockName'>{t('Block: ')}{blockSelectedObject.humanfriendlyID}</div>)
    
        if(blockSelectedParentObject !== ''){
          _ret.push(<div key='parent' className='blockParent'>{t('Parent: ')}{createBlockLink(blockSelectedParentObject.uuid,blockSelectedParentObject.humanfriendlyID)}</div>)
        }
        if(blockSelectedNeigborList.length){
          _ret.push(<div key='neigbor' className='blockNeigbor'>{t('Neigbors: ')}{blockSelectedNeigborList.map(nei=>{
            let _ret = [];
            _ret.push(createBlockLink(nei.uuid,nei.humanfriendlyID));
            return _ret;
          })}</div>)
        }
        if(blockSelectedChildrenList.length){
          _ret.push(<div key='children' className='blockChildren'>{t('Children: ')}{blockSelectedChildrenList.map(chi=>{
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
        let _options = typeof _miData.options !== 'undefined'?_miData.options:[];
        ret.push(<Menuitem key={_miData.value} store={props.store} value= {'selectedBlock.'+_miData.value} type={_miData.type} action={_miData.action} placeholder={_placeholder} options={_options}/>)
      }
      genBlockMI({value: BLOCK_STYLE_NAMES.width, type: MI_INPUT_TYPES.size, action:actionTypes.BLOCK_WIDTH_SET})
      genBlockMI({value: BLOCK_STYLE_NAMES.height, type: MI_INPUT_TYPES.size, action:actionTypes.BLOCK_HEGHT_SET})
      genBlockMI({value: BLOCK_STYLE_NAMES.displayType, type: MI_INPUT_TYPES.selector, action:actionTypes.BLOCK_DISPLAY_TYPE_SET})
      genBlockMI({value:BLOCK_STYLE_NAMES.backgroundColor, type: MI_INPUT_TYPES.color, action:actionTypes.BLOCK_BACKGROUND_COLOR_SET})
      if(blockSelectedObject.style.displayType !== 'inline'){
        ret.push(<div className='spacer' key='spacerAlign' >{t('Align')}</div>)
        genBlockMI({value: BLOCK_STYLE_NAMES.alignVertical, type: MI_INPUT_TYPES.selector, action:actionTypes.BLOCK_ALIGN_VERTICAL_SET})
        genBlockMI({value: BLOCK_STYLE_NAMES.alignHorizontal, type: MI_INPUT_TYPES.selector, action:actionTypes.BLOCK_ALIGN_HORIZONTAL_SET})
        ret.push(<div className='spacer' key='spacerMargin' >{t('Margin')}</div>)
        genBlockMI({value: BLOCK_STYLE_NAMES.marginTop, type: MI_INPUT_TYPES.size, action:actionTypes.BLOCK_MARGIN_TOP_SET})
        genBlockMI({value: BLOCK_STYLE_NAMES.marginBottom, type: MI_INPUT_TYPES.size, action:actionTypes.BLOCK_MARGIN_BOTTOM_SET})
        genBlockMI({value: BLOCK_STYLE_NAMES.marginLeft, type: MI_INPUT_TYPES.size, action:actionTypes.BLOCK_MARGIN_LEFT_SET})
        genBlockMI({value: BLOCK_STYLE_NAMES.marginRight, type: MI_INPUT_TYPES.size, action:actionTypes.BLOCK_MARGIN_RIGHT_SET})
      }
      ret.push(<div className='spacer' key='spacerText' >{t('Text')}</div>)
      genBlockMI({value: BLOCK_STYLE_NAMES.fontFamily, type: MI_INPUT_TYPES.selector, action:actionTypes.BLOCK_FONT_FAMILY_SET})
      genBlockMI({value: BLOCK_STYLE_NAMES.fontSize, type: MI_INPUT_TYPES.size, action:actionTypes.BLOCK_FONT_SIZE_SET})
      genBlockMI({value: BLOCK_STYLE_NAMES.fontColor, type: MI_INPUT_TYPES.color, action:actionTypes.BLOCK_FONT_COLOR_SET})
      genBlockMI({value: BLOCK_STYLE_NAMES.fontBold, type: MI_INPUT_TYPES.selector, action:actionTypes.BLOCK_FONT_BOLD_SET})
      genBlockMI({value: BLOCK_STYLE_NAMES.fontItalic, type: MI_INPUT_TYPES.selector, action:actionTypes.BLOCK_FONT_ITALIC_SET})
      
      if(blockSelectedChildrenList.length === 0){
        ret.push(<div className='spacer' key='spacerContent' >{t('Content')}</div>)
        genBlockMI({value: 'valueType',type: MI_INPUT_TYPES.selector, action:actionTypes.BLOCK_VALUE_TYPE_SET})
        if(blockSelectedObject.valueType !== 'copied'){//if block is not copying from another
          if(blockSelectedObject.valueType !== 'fixed'){//if value is variable

            genBlockMI({value:'variableTitle',type: MI_INPUT_TYPES.text, action:actionTypes.BLOCK_VARIABLE_TITLE_SET})
            genBlockMI({value:'innerText',type: MI_INPUT_TYPES.textarea, action:actionTypes.BLOCK_INNER_TEXT_SET})
          }else{
            genBlockMI({value:'innerText',type: MI_INPUT_TYPES.textarea, action:actionTypes.BLOCK_INNER_TEXT_SET})
          }
        }else{
          //TODO check which copy channels exists 
          const _getLinksOptions = ()=>{
            //loop though the children and find ones not copying
            return stateNow.template.children.filter(ch=>{return ch.valueType !== 'copied' || (ch.uuid === blockSelectedObject.uuid)}).map(ch=>{return [ch.copyChannel,ch.copyChannel]})
          }
          //show link if it is
          genBlockMI({value:'copyChannel',type: MI_INPUT_TYPES.text, action:actionTypes.BLOCK_COPY_CHANNEL_SET,options:_getLinksOptions()})
        }
      }
      ret.push(<div className='spacer' key='spacerCustomCSS' >{t('Custom CSS')}</div>)
      genBlockMI({value:'customStyle',type: MI_INPUT_TYPES.textarea, action:actionTypes.BLOCK_CUSTOM_STYLE_SET})
    }
    return ret;
  }
  const getCopyMenuContent = ()=>{
    let ret = [];
    if(stateNow.copies.columns.length === 0){
      ret.push(<div className='spacer' key='spacerCopyInfo' >{t('Create variable block to add copy')}</div>)
    }else{
      ret.push(<div className='spacer' key='spacerCopyData' >{t('Data to copy')}</div>)
      ret.push(<Menuitem key='selectCSV' store={props.store} value="customAction.uploadCSV" type={ MI_INPUT_TYPES.file } fileType='csv' primary="true" title={t('Select CSV')} icon="hash"/>)
      ret.push(<Menuitem key='downloadCSV' store={props.store} value="customAction.downloadCSV" type={ MI_INPUT_TYPES.button }  title="" icon="download"/>)
      if(stateNow.copies.rows.length === 0){
        ret.push(<Menuitem key='addCopyRow' store={props.store} value="customAction.addCopyRow" action='' type={ MI_INPUT_TYPES.button }  title={t('Add copy')} icon="add"/>)    
      }else{
        ret.push(<div className='spacer' key='spacerCopyList' >{t('Copy')}</div>)
        const _copyOptions = ()=>{
          let _ret = [['Unselected','']]
          _ret = _ret.concat(stateNow.copies.rows.map((r,i)=>{
            return [t('Copy')+' '+i,i]
          }))
          return _ret;
        }
        ret.push(<Menuitem key='copySelector' store={props.store} value="app.copySelected" action={actionTypes.SELECTEDCOPY_SET} type={ MI_INPUT_TYPES.selector } fileType='csv' primary="true" title={t('Select CSV')} options={_copyOptions()}/>)
        ret.push(<Menuitem key='addCopyRow' store={props.store} value="customAction.addCopyRow"  type={ MI_INPUT_TYPES.button }  title="" icon="add"/>)   
        if(stateNow.app.copySelected+'' !== ''){
          ret.push(<Menuitem key='removeCopyRow' store={props.store} value="customAction.removeCopyRow"  type={ MI_INPUT_TYPES.button }  title="" icon="remove"/>)    
        }
        if(stateNow.app.copySelected+'' !== '' && typeof stateNow.copies.rows[stateNow.app.copySelected] !== 'undefined'){
          stateNow.copies.columns.forEach((col)=>{
            const _miType  = ()=>{
              switch(col.type){
                case 'variable':
                  return MI_INPUT_TYPES.text;
                case 'selector':
                  return MI_INPUT_TYPES.selector;
                default:
                  return MI_INPUT_TYPES.text;
              }
            }
            const _getOptions = ()=>{
              let _ret = col.options.map(o=>{return [o,o]})
              return _ret;
            }
            
            ret.push(<div className='spacer' key={'spacerInput'+col.target} >{col.title}</div>)
            ret.push(<Menuitem key={col.target+'Input'} store={props.store} value={'selectedCopy.'+col.target} action={actionTypes.COPIES_ROW_SET} columnSelected={col.target} type={_miType()} options={_getOptions()}/>)
          });
        }
      }
    }

    return ret;
  }
  const getPrintMenuContent = ()=>{
    let ret = [];
    if(stateNow.copies.rows.length !== 0 && stateNow.copies.columns.length !== 0){
      ret.push(<div className='spacer' key='spacerPrint' >{t('Print options')}</div>)
      ret.push(<Menuitem key='print' store={props.store} value="customAction.print" type={  MI_INPUT_TYPES.button } primary="true" title={t('Print')} icon="print"/>)
    }else{
      ret.push(<div className='spacer' key='spacerNothingToPrint' >{t('Create copy to print')}</div>)
    }
    return ret;
  }
  const getSitemenuContent = ()=>{
    let ret = [];
    switch (stateNow.app.tabSelected){
      case TAB_NAMES.edit:
       ret = [...getEditMenuContent()]
        break;
      case TAB_NAMES.copy:
        ret = [...getCopyMenuContent()]
        break;
      case TAB_NAMES.print:
        ret = [...getPrintMenuContent()]
        break;
      default:
        ret.push(<div className='spacer' key='spacerNoTabSelected' >{t('No tab selected')}</div>)
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
