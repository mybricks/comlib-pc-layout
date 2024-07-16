import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Menu, message } from 'antd';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

export default function SideMenu(props) {
  const { slots, items } = props;
  // const items: MenuItem[] = [
  //   {
  //     key: 'sub1',
  //     label: 'Navigation One'
  //   },
  //   {
  //     key: 'sub2',
  //     label: 'Navigation Two'
  //   },
  //   {
  //     key: 'sub4',
  //     label: 'Navigation Three'
  //   }
  // ];

  const renderItems = () => {
    return (
      <>
        {items.map((item) => {
          return (
            <div>
              {slots[item.id]?.render({
                key: item.id
              })}
            </div>
          );
        })}
      </>
    );
  }

 return (
  <div>
    <Menu
      items={items}
      data-side-menu
    /> 
    <div>
    {renderItems()}
    </div>
  </div>
 )
  
}