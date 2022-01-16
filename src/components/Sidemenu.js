import React from 'react'
import Tab from './Tab';
import Menuitem from './Menuitem';
import store from '../store';

function Sidemenu(props) {
  const stateNow = props.store.getState();
  const getSitemenuContent = ()=>{
    let ret = [];
    switch (stateNow.app.tabSelected){
      case 'edit':
        //TODO get if any block selected
        //TODO get if template selected
        const selectBlock = e=>{
          props.store.dispatch({type:'stack/selectedBlockSet',payload:e.target.id})
        }
        const createBlockLink = (_uuid,_title)=>{
          return <span id={_uuid} className='blockLink' key={_uuid} onClick={selectBlock}>{_title}</span>
        }

        if(stateNow.app.blockSelected == ''){

          ret.push(<Menuitem key='1' store={props.store} value="template.name" type="text" placeholder="Template name" />)
          ret.push(<Menuitem key='2' store={props.store} value="template.pageSize" type="selector" options={stateNow.template.pageSizeOptions} />)
          ret.push(<Menuitem key='3' store={props.store} value="template.pageOrientation" type="selector" options={stateNow.template.pageOrientationOptions} />)
          ret.push(<div className='spacer' key='spacerMargin' >Margin</div>)
          ret.push(<Menuitem key='marginTop' store={props.store} value="template.marginTop" type="size" placeholder="M top" />)
          ret.push(<Menuitem key='marginBottom' store={props.store} value="template.marginBottom" type="size" placeholder="M bottom" />)
          ret.push(<Menuitem key='marginLeft' store={props.store} value="template.marginLeft" type="size" placeholder="M left" />)
          ret.push(<Menuitem key='marginRight' store={props.store} value="template.marginRight" type="size" placeholder="M right" />)
          
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
            if(ch.uuid == blockSelectedObject.parentID){
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
          ret.push(<div key='nav' className="blockNavigator" >
            {getNavLinks(blockSelectedObject,blockSelectedParentObject,blockSelectedNeigborList,blockSelectedChildrenList)}
          </div>)
          ret.push(<Menuitem key='width' store={props.store} value="selectedBlock.width" type="size" placeholder="width" />)
          ret.push(<Menuitem key='height' store={props.store} value="selectedBlock.height" type="size" placeholder="height" />)
          ret.push(<Menuitem key='displayType' store={props.store} value="selectedBlock.displayType" type="selector" options={'displayTypeOptions'} />)
          ret.push(<Menuitem key='backgroundColor' store={props.store} value="selectedBlock.backgroundColor" type="color" />)
          if(blockSelectedObject.style.displayType !== 'inline'){
            ret.push(<div className='spacer' key='spacerAlign' >Align</div>)
            ret.push(<Menuitem key='alignVertical' store={props.store} value="selectedBlock.alignVertical" type="selector" options={'alignVerticalOptions'} />)
            ret.push(<Menuitem key='alignHorizontal' store={props.store} value="selectedBlock.alignHorizontal" type="selector" options={'alignHorizontalOptions'} />)
            ret.push(<div className='spacer' key='spacerMargin' >Margin</div>)
            ret.push(<Menuitem key='marginTop' store={props.store} value="selectedBlock.marginTop" type="size" placeholder="M top" />)
            ret.push(<Menuitem key='marginBottom' store={props.store} value="selectedBlock.marginBottom" type="size" placeholder="M bottom" />)
            ret.push(<Menuitem key='marginLeft' store={props.store} value="selectedBlock.marginLeft" type="size" placeholder="M left" />)
            ret.push(<Menuitem key='marginRight' store={props.store} value="selectedBlock.marginRight" type="size" placeholder="M right" />)
          }
          ret.push(<div className='spacer' key='spacerText' >Text</div>)
          ret.push(<Menuitem key='fontFamily' store={props.store} value="selectedBlock.fontFamily" type="selector" options={'fontFamilyOptions'} />)
          ret.push(<Menuitem key='fontSize' store={props.store} value="selectedBlock.fontSize" type="size" placeholder='Font size' />)
          ret.push(<Menuitem key='fontColor' store={props.store} value="selectedBlock.fontColor" type="color"/>)
          ret.push(<Menuitem key='fontBold' store={props.store} value="selectedBlock.fontBold" type="selector" options={'fontBoldOptions'} />)
          ret.push(<Menuitem key='fontItalic' store={props.store} value="selectedBlock.fontItalic" type="selector" options={'fontItalicOptions'} />)
          ret.push(<Menuitem key='fontUnderline' store={props.store} value="selectedBlock.fontUnderline" type="selector" options={'fontUnderlineOptions'} />)
          if(blockSelectedChildrenList.length == 0){
            ret.push(<div className='spacer' key='spacerContent' >Content</div>)
            ret.push(<Menuitem key='valueType' store={props.store} value="selectedBlock.valueType" type="selector" options={'valueTypeOptions'} />)
            if(blockSelectedObject.valueType !== 'copied'){
              ret.push(<Menuitem key='innerText' store={props.store} value="selectedBlock.innerText" type="textarea" placeholder="Block text" />)
            }else{
              ret.push(<Menuitem key='copyChannel' store={props.store} value="selectedBlock.copyChannel" type="text" placeholder='Copy channel' />)
            }
            
          }
          ret.push(<div className='spacer' key='spacerCustomCSS' >Custom CSS</div>)
          ret.push(<Menuitem key='customStyle' store={props.store} value="selectedBlock.customStyle" type="textarea" placeholder="property:value" />)
          
        }
        break;
      case 'copy':
        ret = 'Copy';
        break;
      case 'print':
        ret = 'Print';
        break;
      default:
        break;
    }
    return ret;
  }
  return (
    <div className='Sidemenu'>
        <div className='tabs'>
          {stateNow.app.tabSelectedOptions.map(([tabTitle,tabValue],i)=>{
            return <Tab key={tabValue} store={props.store} tabName={tabTitle} tabValue={tabValue}/>
          })}
        </div>
        <div className='menuitems'>
          {getSitemenuContent()}
        </div>
    </div>
  );
}

export default Sidemenu;
