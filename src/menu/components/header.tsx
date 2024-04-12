import { Button, Menu, Popover } from 'antd';
import React from 'react'
import { Data } from '../type';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { HandleRouteDataNode } from '../runtime';

type PropsType = {
  data: Data;
  items: ItemType[]
  curActiveNode: HandleRouteDataNode
}

export default function Header(props: PropsType) {
  const { data, items, curActiveNode } = props;

  const logoEl = (
    <div style={{ width: 'fit-content', margin: 'auto', padding: '0 12px', cursor: 'pointer' }}>
      {
        data.logoUrl ? <img height="28" src={data.logoUrl} /> : <span style={{ fontSize: 32, fontWeight: 500 }} >LOGO</span>
      }
    </div>
  );

  const userinfoEl = (() => {
    const isLogin = !!window['layoutPC__userInfo'];

    const el = (
      <div style={{ width: 'fit-content', display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', minWidth: 125 }}>
        <img height="28" src="https://p1.a.yximgs.com/s1/i/def/head_m.png" />
        <div style={{ color: '#1d1d1f', fontWeight: 500, fontSize: 14 }}>
          {isLogin ? window['layoutPC__userInfo']?.nickname : '未登录'}
        </div>
      </div>
    );

    const userinfoPopover = <Button style={{ width: 125, height: 50 }} type='text' >退出登录</Button>;

    return (isLogin ? <Popover
      placement="bottom"
      content={userinfoPopover}
      overlayClassName='overlay-no-padding'
      overlayStyle={{ width: 125 }}
      overlayInnerStyle={{ width: 125, padding: 0 }}
    > {el} </Popover> : el)
  })();

  return (
    <div className='mybricks-layout-menu' style={{ display: 'flex', height: 64, alignItems: 'center' }}>
      {data.showLogo && logoEl}

      <Menu style={{ width: 0, flex: 1 }} mode={data.mode} items={items} activeKey={curActiveNode?.id} />

      {data.showUserInfo && userinfoEl}
    </div>
  );

}
