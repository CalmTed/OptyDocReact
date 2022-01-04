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
        ret.push(<Menuitem key='1' store={props.store} value="template.name" type="text" placeholder="Template name" />)
        ret.push(<Menuitem key='2' store={props.store} value="template.pageSize" type="selector" options={stateNow.template.pageSizeOptions} />);
        ret.push(<Menuitem key='3' store={props.store} value="template.pageOrientation" type="selector" options={stateNow.template.pageOrientationOptions} />)
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
            return <Tab store={props.store} tabName={tabTitle} tabValue={tabValue}/>
          })}
        </div>
        <div className='menuitems'>
          {getSitemenuContent()}
        </div>
    </div>
  );
}

export default Sidemenu;
