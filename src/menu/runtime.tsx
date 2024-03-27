import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Menu } from 'antd';
import { Data, mockRouterParams } from './constants';

type RouteParam = {
  id: string;
  menuTitle: string;
  route: string;
  pageId: string;
  parentId?: string;
};
type RouteParams = RouteParam[];

type HandleRouteDataNode = RouteParam & {
  dep: number;
  children?: HandleRouteDataNode[];
  parentNode?: HandleRouteDataNode;
};

function transToItems(data: HandleRouteDataNode[]) {
  return (
    data?.map((node) => {
      return {
        key: node.id,
        label: node.menuTitle,
        children: node.children && transToItems(node.children),
        onClick: () => {
          if (node.children) return;
          const completeRoute = window['layoutPC__basePathname'] + node.route;
          history.pushState({}, '', completeRoute);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      };
    }) || []
  );
}

export default function ({ env, data, outputs, inputs }: RuntimeParams<Data>) {
  if (!env.runtime || env.runtime.debug) {
    window['layoutPC__basePathname'] = "basePathname"
    window['layoutPC__routerParams'] = mockRouterParams;
  }

  const [routerParams, setRouterParams] = useState<RouteParams>(window['layoutPC__routerParams']);
  const [showNodes, setShowNodes] = useState<HandleRouteDataNode[]>();
  const [curActiveNode, setCurActiveNode] = useState<HandleRouteDataNode>();

  /** 和壳应用通信 */
  useLayoutEffect(() => {
    window['layoutPC__onRouterParamsChange'] = window['layoutPC__onRouterParamsChange'] || [];
    window['layoutPC__onRouterParamsChange'].push(setRouterParams);
  }, []);

  /** 监听路由变化， */
  useLayoutEffect(() => {
    const onPopState = () => {
      if (!flatData) return;
      let node = flatData.find((item) => item.route === location.pathname);
      setCurActiveNode(node);
      while (node && node.dep >= data.menuLevel) node = node.parentNode;
      setShowNodes(node?.children || []);
    };
    onPopState();
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  /** 树形数据预处理 */
  const { nestedData, flatData } = useMemo(() => {
    const flatData: HandleRouteDataNode[] = (routerParams || []).map((item) => ({ ...item, dep: -1 }));

    const map = {};
    const nestedData = [];

    // 构建一个以id为键的映射对象
    flatData.forEach((node) => {
      map[node.id] = node;
    });

    // 构建嵌套结构
    flatData.forEach((node) => {
      if (!node.parentId) nestedData.push(map[node.id]);

      const parent = map[node.parentId];
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(map[node.id]);
      }
    });

    function dfs(nodes: HandleRouteDataNode[], dep = 1, parentNode?: HandleRouteDataNode) {
      nodes.forEach((node) => {
        node.dep = dep;
        node.parentNode = parentNode;
        node.children && dfs(node.children, dep + 1, node);
      });
    }
    dfs(nestedData);

    return { nestedData, flatData };
  }, [routerParams]);

  /** 菜单展示数据 */
  const items = useMemo(() => {
    if (data.menuLevel === 1 && data.menuDeep === -1) return transToItems(nestedData);
    if (data.menuLevel === 1 && data.menuDeep === 0) {
      return transToItems(nestedData.map((item) => ({ ...item, children: undefined })));
    }

    if (data.menuDeep === -1) return transToItems(showNodes);
    else return transToItems(showNodes.map((item) => ({ ...item, children: undefined })));
  }, [showNodes, nestedData]);

  return (
    <div>
      <Menu mode={data.mode} items={items} activeKey={curActiveNode?.id}></Menu>
    </div>
  );
}
