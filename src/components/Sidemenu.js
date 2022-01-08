import React from 'react'
import Tab from './Tab';
import Menuitem from './Menuitem';

function Sidemenu(props) {
  const stateNow = props.store.getState();
  const getSitemenuContent = ()=>{
    let ret = [];
    switch (stateNow.app.tabSelected){
      case 'edit':
        //TODO get if any block selected
        //TODO get if template selected
        if(stateNow.app.blockSelected == ''){
          ret.push(<Menuitem key='1' store={props.store} value="template.name" type="text" placeholder="Template name" />)
          ret.push(<Menuitem key='2' store={props.store} value="template.pageSize" type="selector" options={stateNow.template.pageSizeOptions} />)
          ret.push(<Menuitem key='3' store={props.store} value="template.pageOrientation" type="selector" options={stateNow.template.pageOrientationOptions} />)
          ret.push(<Menuitem key='4' store={props.store} value="template.marginLeft" type="size" placeholder="Page margins" />)
          
        }else{
          ret.push(<Menuitem key='1' store={props.store} value="selectedBlock.width" type="size" placeholder="width" />)
          ret.push(<Menuitem key='2' store={props.store} value="selectedBlock.height" type="size" placeholder="height" />)
          ret.push(<Menuitem key='3' store={props.store} value="selectedBlock.innerText" type="text"placeholder="Block text" />)
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
