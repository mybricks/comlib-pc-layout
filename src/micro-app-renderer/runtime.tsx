import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import _debounce from 'lodash/debounce';
import { Data, SimpleMicroApp, LoadableApp } from './types';
import styles from './style.less';
import { loadApp, loadInvalidApp } from './utils/qiankun-polyfill';
import { prefetchApps } from 'qiankun';
import { Spin } from 'antd';

class AppManager {
  private microApps: { curApp: any; appMap: { [keyName: string]: any } } = {
    curApp: null as any as any,
    appMap: {}
  };

  private _switch = _debounce(async (nextApp) => {
    await this.unmountCurApp();
    if (!!this.microApps.appMap[nextApp.name]) {
      await this.microApps.appMap[nextApp.name].mount();
      // @ts-ignore
      this.nextApp = nextApp;
      this.microApps.curApp = this.microApps.appMap[nextApp.name];
      return Promise.resolve();
    } else if (!!!this.microApps.appMap[nextApp.name]) {
      // @ts-ignore
      this.nextApp = nextApp;
      this.microApps.curApp = loadApp(nextApp);
      return this.microApps.curApp?.mountPromise;
    }
    return Promise.resolve();
  }, 300);

  unmountCurApp = async () => {
    if (!this.microApps?.curApp) {
      return Promise.resolve();
    }

    if (this.microApps?.curApp.getStatus?.() !== 'MOUNTED') {
      return Promise.resolve();
    }

    return this.microApps.curApp?.unmount?.();
  };

  switchApp = async (nextApp) => {
    if (this.microApps?.curApp?.name === nextApp.name) {
      return Promise.resolve();
    }

    return this._switch(nextApp);
  };

  switchInvalidApp = async ({ container }) => {
    await appManager.unmountCurApp?.();
    this.microApps.curApp = loadInvalidApp?.({ container });
    return Promise.resolve();
  };

  get curApp() {
    const curApp = this.microApps.curApp;

    return (
      curApp && {
        ...curApp,
        // @ts-ignore
        name: this.nextApp?.name
      }
    );
  }
}

const appManager = new AppManager();

export default function ({ data, inputs, outputs, slots, env }: RuntimeParams<Data>) {
  // if (!env.runtime || env.runtime.debug) {
  //   window['layoutPC__basePathname'] = ""
  // }

  useEffect(() => {
    if (env.runtime) {
      const apps = window?.['layoutPC__routerParams']?.map((item) => ({
        name: item.pageUrl,
        entry: item.pageUrl
      }));
      apps?.length && prefetchApps(apps);
    }
  }, []);

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
    if (!eleRef.current) return;
    if (!data.pageUrl) {
      console.warn('[micro app] invalid app,url is required');
      appManager.switchInvalidApp({ container: eleRef.current });
    } else {
      // setLoading(true);
      // @ts-expect-error 用于兼容解决内网方舟页面 m-ui 挂载逻辑
      const _antd = window.antd;
      // @ts-expect-error
      delete window.antd;
      appManager
        .switchApp({ name: data.pageUrl, entry: data.pageUrl, container: eleRef.current })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          let timer: NodeJS.Timer | null = setInterval(() => {
            if (
              appManager.curApp &&
              data.pageUrl === appManager.curApp.name &&
              appManager.curApp.getStatus() === 'MOUNTED'
            ) {
              // @ts-expect-error
              window.antd = _antd;
              timer && clearInterval(timer);
              timer = null;
              // setLoading(false);
            }
          }, 100);
        });
    }
  }, [data.pageUrl]);

  return (
    <div className={styles.pageRender}>
      {env.edit ? (
        <div className={styles.tip}>这里是页面渲染区域</div>
      ) : (
        <div className={styles.rtMountNode} ref={eleRef} />
      )}
    </div>
  );
}
