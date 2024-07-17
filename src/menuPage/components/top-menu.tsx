import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Menu, message, Popover } from 'antd';
import { MenuItem, MenuTypeEnum } from '../type';
import { findSelectkeys, findMenuItem } from '../utils';
import css from '../style.less'

export default function TopMenu(props) {
  const { slots, env, dataSource, logo, logoSize, src, showLogo, showAvatar, showMenu } = props;

  console.log('logoSize1234', logoSize);

  const [selectedKey, setSelectedKey] = useState<string[]>([]);

  useEffect(() => {
    if (dataSource.length !== 0) {
      setSelectedKey([findSelectkeys(dataSource)]);
    }
  }, [dataSource]);

  const renderMenuItems = (ds: MenuItem[]) => {
    return (ds || []).map((item) => {
      const { key, children, menuType, useIcon, icon } = item || {};
      const title = item.title;
      //分组菜单
      if (menuType === MenuTypeEnum.Group) {
        return (
          <div data-menu-item={key} key={key}>
            <Menu.ItemGroup title={title} key={key}>
              {renderMenuItems(children)}
            </Menu.ItemGroup>
          </div>
        );
      }
      //父菜单
      if (menuType === MenuTypeEnum.SubMenu) {
        return (
          <Menu.SubMenu
            title={title}
            key={key}
            data-menu-item={key}
            //icon={useIcon ? chooseIcon({ icon: icon }) : void 0}
            style={{ opacity: 1, height: 'unset', overflowY: 'unset', position: 'relative' }}
          >
            {renderMenuItems(children)}
          </Menu.SubMenu>
        );
      }
      //最后的子菜单
      return (
        <Menu.Item
          onClick={menuOnClick}
          //icon={useIcon ? chooseIcon({ icon: icon }) : void 0}
          key={key}
          //data-topMenu-item={key}
          data-top-menu-item={key}
          //style={{ opacity: 1, height: 'unset', overflowY: 'unset', position: 'relative' }}
        >
          {title}
        </Menu.Item>
      );
    });
  };

  //子菜单的点击事件
  const menuOnClick = (e) => {
    const clickItem = findMenuItem(dataSource, e.key);
    const { key, _key, title, ...res } = clickItem;
    if (key) {
      console.log('子项clickItem',clickItem);
    }
  };

  //菜单点击事件
  const onClick = (e) => {
    //const clickItem = findMenuItem(dataSource, e.key);
    setSelectedKey([e.key]);
  };

 return (
  <div data-top-menu>
    <div style={{display: 'flex', flexWrap: 'nowrap', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: "#333", height: '80px', alignItems: 'center'}} >
        {
          showLogo ? <img 
            data-logo
            src = {logo}
            style={{height: logoSize[0], width: logoSize[1] }}
          /> : void 0
        }
        {
          showMenu ? <div
            data-top-menu-list
            style={{ width: '100%'}} 
            className={css.topMenu}
          >
            <Menu
              style={{
                width: '100%',
                height: '50px',
                backgroundColor: 'unset',
                color: '#fff'
              }}
              className={css.topMenu}
              //items={dataSource}
              mode="horizontal"
              selectedKeys={selectedKey}
              onClick={onClick}
            >
              {renderMenuItems(dataSource)}
            </Menu>
          </div> : void 0
        }
        {
          showAvatar ? <Popover 
          trigger={env.runtime ? 'hover' : 'click'} 
          // title={popoverTitle} 
          // placement='bottomRight' 
          // content={popoverContent}
          >
            <img 
              data-popover-img 
              src={src}
              style={{height: 60, width: 60 }} 
            />
          </Popover> : void 0
        }
    </div>
    {/* <div style={{width: '100%'}}>
      {slots[selectedKey[0]]?.render({
        key: selectedKey[0]
      })}
    </div> */}
  </div>
 )
}