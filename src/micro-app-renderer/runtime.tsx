import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import _debounce from 'lodash/debounce';
import { Data, SimpleMicroApp, LoadableApp } from './types';
import styles from './style.less';
import { loadApp, loadInvalidApp } from './utils/qiankun-polyfill';
import { MicroApp, loadMicroApp, prefetchApps } from 'qiankun';
import { Spin } from 'antd';

// class AppManager {
//   private microApps: { curApp: any; appMap: { [keyName: string]: any } } = {
//     curApp: null as any as any,
//     appMap: {}
//   };

//   private _switch = _debounce(async (nextApp) => {
//     console.log('---', this, this.curApp.name, this.microApps?.curApp.getStatus?.());
//     await this.unmountCurApp();
//     if (!!this.microApps.appMap[nextApp.name]) {
//       console.log('---', nextApp.name, this.microApps.appMap[nextApp.name].getStatus());
//       await this.microApps.appMap[nextApp.name].mount();
//       // @ts-ignore
//       this.nextApp = nextApp;
//       this.microApps.curApp = this.microApps.appMap[nextApp.name];
//       return Promise.resolve();
//     } else if (!!!this.microApps.appMap[nextApp.name]) {
//       // @ts-ignore
//       this.nextApp = nextApp;
//       this.microApps.curApp = loadApp(nextApp);
//       return this.microApps.curApp?.mountPromise;
//     }
//     return Promise.resolve();
//   }, 300);

//   unmountCurApp = async () => {
//     if (!this.microApps?.curApp) {
//       return Promise.resolve();
//     }

//     if (this.microApps?.curApp.getStatus?.() !== 'MOUNTED') {
//       return Promise.resolve();
//     }

//     return this.microApps.curApp?.unmount?.();
//   };

//   switchApp = async (nextApp) => {
//     if (this.microApps?.curApp?.name === nextApp.name) {
//       return Promise.resolve();
//     }

//     return this._switch(nextApp);
//   };

//   switchInvalidApp = async ({ container }) => {
//     await appManager.unmountCurApp?.();
//     this.microApps.curApp = loadInvalidApp?.({ container });
//     return Promise.resolve();
//   };

//   get curApp() {
//     const curApp = this.microApps.curApp;

//     return (
//       curApp && {
//         ...curApp,
//         // @ts-ignore
//         name: this.nextApp?.name
//       }
//     );
//   }
// }

// const appManager = new AppManager();

export default function ({ data, inputs, outputs, slots, env }: RuntimeParams<Data>) {
  // if (!env.runtime || env.runtime.debug) {
  //   window['layoutPC__basePathname'] = ""
  // }

  // useEffect(() => {
  //   if (env.runtime) {
  //     const apps = window?.['layoutPC__routerParams']?.map((item) => ({
  //       name: item.pageUrl,
  //       entry: item.pageUrl
  //     }));
  //     apps?.length && prefetchApps(apps);
  //   }
  // }, []);

  /** 监听路由变化， */
  useLayoutEffect(() => {
    const onPopState = () => {
      const node = window?.['layoutPC__routerParams']?.find(
        (item) => window['layoutPC__basePathname'] + item.route === location.pathname
      );
      data.pageUrl = node?.pageUrl;
    };
    onPopState();
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  const eleRef = useRef<HTMLDivElement>(null);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    let _antd, __comlibs_rt_;
    // @ts-expect-error
    delete window.antd;
    let currentApp: MicroApp;
    if (data.pageUrl && eleRef.current) {
      // setLoading(true);
      currentApp = loadMicroApp(
        { name: data.pageUrl, entry: data.pageUrl, container: eleRef.current },
        {
          sandbox: {
            experimentalStyleIsolation: true
          },
          singular: true
        },
        {
          beforeLoad() {
            // @ts-expect-error 用于兼容解决内网方舟页面 m-ui 挂载逻辑
            _antd = window.antd;
            // @ts-expect-error
            delete window.antd;
            // @ts-expect-error
            __comlibs_rt_ = window.__comlibs_rt_
            // @ts-expect-error
            delete window.__comlibs_rt_;
            return Promise.resolve();
          },
          afterMount() {
            // setLoading(false);
            // @ts-expect-error
            window.antd = _antd;
            // @ts-expect-error
            window.__comlibs_rt_= __comlibs_rt_;
            return Promise.resolve();
          }
        }
      );
    }
    return () => {
      currentApp?.unmount();
    };
  }, [data.pageUrl]);

  return (
    // <div className={styles.pageRender} style={{backgroundColor: !data.pageUrl || loading || env.edit ? '#f6f8fc':''}}>
    <div className={styles.pageRender} style={{backgroundColor: !data.pageUrl || env.edit ? '#f6f8fc':''}}>
      {/* <Spin spinning={loading} tip='加载中...'> */}
        {env.edit ? (
          <div className={styles.tip}>这里是页面渲染区域</div>
        ) : (
          <div className={styles.rtMountNode} ref={eleRef} />
        )}
      {/* </Spin> */}
    </div>
  );
}
