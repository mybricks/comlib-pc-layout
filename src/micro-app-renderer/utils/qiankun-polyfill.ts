import * as qiankun from 'qiankun';
import { SimpleMicroApp, LoadableApp } from '../types';

class MainApp {

  cacheHtmlMap = {};

  loadApp = ({ entry, container }: { entry: string; container: HTMLElement }): SimpleMicroApp => {
    if (!this.cacheHtmlMap?.[entry]) {
      const mount: () => Promise<null> = async () => {
        await fetch(entry, {
          method: 'GET'
        })
          .then((res) => {
            if (res.headers.get('content-type') === 'text/plain') {
              return res.text();
            }
            return res.text();
          })
          .then((htmlString: string) => {
            const prefix = entry.split('/').slice(0, -1).join('/');
            /** test平台：相对地址处理成绝对地址 */
            const finalHtmlString = htmlString
              .replaceAll('src=".', `src="${prefix}`)
              .replaceAll('src="public', `src="${prefix}/public`)
              .replaceAll('href="public', `href="${prefix}/public`);
            this.cacheHtmlMap[entry] = finalHtmlString;
            this.renderHtmlByHtmlString(encodeURIComponent(finalHtmlString), container);
          });
        return null;
      };

      const mountPromise = mount();

      const unmount: () => Promise<null> = () => Promise.resolve(null);

      return {
        getStatus: () => 'MOUNTED',
        mount,
        mountPromise,
        unmount
      };
    } else {
      const mount = () => {
        this.renderHtmlByHtmlString(encodeURIComponent(this.cacheHtmlMap[entry]), container);
        return Promise.resolve(null);
      };

      const mountPromise = mount();
      const unmount: () => Promise<null> = () => Promise.resolve(null);
      return {
        getStatus: () => 'MOUNTED',
        mount,
        mountPromise,
        unmount
      };
    }
  };

  loadInvalidApp = ({ container }: { container: HTMLElement }): SimpleMicroApp => {
    const mount: () => Promise<null> = () => {
      // this.renderHtmlByHtmlString(
      //   `
      //   <body style="margin: 0px;">
      //     <div style="
      //       display: flex;
      //       justify-content: center;
      //       align-items: center;
      //       font-style: italic;
      //       color: #999;
      //       font-weight: 400;
      //       font-size: 13px;
      //       height: 50px;
      //     ">当前页面未配置</div>
      //   </body>
      //   `,
      //   container
      // );
      this.renderHtmlByHtmlString(
        `%0A%20%20%20%20%20%20%20%20%3Cbody%20style%3D%22margin%3A%200px%3B%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3Cdiv%20style%3D%22%0A%20%20%20%20%20%20%20%20%20%20%20%20display%3A%20flex%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20justify-content%3A%20center%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20align-items%3A%20center%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-style%3A%20italic%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20color%3A%20%23999%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-weight%3A%20400%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20font-size%3A%2013px%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20height%3A%2050px%3B%0A%20%20%20%20%20%20%20%20%20%20%22%3E%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E6%9C%AA%E9%85%8D%E7%BD%AE%3C%2Fdiv%3E%0A%20%20%20%20%20%20%20%20%3C%2Fbody%3E%0A%20%20%20%20%20%20%20%20`,
        container
      );
      return Promise.resolve(null);
    };
    const mountPromise = mount();
    const unmount: () => Promise<null> = () => Promise.resolve(null);
    return {
      getStatus: () => 'MOUNTED',
      mount,
      mountPromise,
      unmount
    };
  };

  private renderHtmlByHtmlString = (htmlString: string, mountNode: HTMLElement) => {
    if (mountNode) {
      const iframeEle = document.createElement('iframe');
      mountNode.innerHTML = '';
      mountNode.appendChild(iframeEle);

      // htmlString = htmlString.replace(
      //   '</head>',
      //   `
      //   <script>
      //     var parentHistory = window.parent.history;
      //     history.pushState = (...args) => {
      //       return parentHistory.pushState.apply(parentHistory, args)
      //     }
      //   </script>
      //   </head>
      // `
      // );
      htmlString = htmlString.replace(
        `%3C%2Fhead%3E`,
        `%0A%20%20%20%20%20%20%20%20%3Cscript%3E%0A%20%20%20%20%20%20%20%20%20%20var%20parentHistory%20%3D%20window.parent.history%3B%0A%20%20%20%20%20%20%20%20%20%20history.pushState%20%3D%20(...args)%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20return%20parentHistory.pushState.apply(parentHistory%2C%20args)%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%3C%2Fscript%3E%0A%20%20%20%20%20%20%20%20%3C%2Fhead%3E%0A%20%20%20%20%20%20`
      );
      window.iframeEle = iframeEle;

      iframeEle.style = 'width: 100%;height: 100%;border: 0px;border-radius: 0px;';

      iframeEle.contentWindow?.document.write(decodeURIComponent(htmlString));
    }
  };
}

const mockMainApp = new MainApp();

// const openIframeMode = false
/** @description 设计器中 用iFrame渲染 */
const openIframeMode = () => {
  return (
    !!document.querySelector('div[class^="lyStage-"]') ||
    !!new URL(location.href).searchParams.get('microIframeMode')
  );
};

export const loadApp = ({ name, entry, container }: LoadableApp) => {
  if (openIframeMode()) {
    return mockMainApp.loadApp({ entry, container });
  }
  return qiankun.loadMicroApp({ name, entry, container }, { sandbox: { experimentalStyleIsolation: true }, singular: false });
};

export const loadInvalidApp = ({ container }: { container: HTMLElement }) => {
  return mockMainApp.loadInvalidApp({ container });
};
