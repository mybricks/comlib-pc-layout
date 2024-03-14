import { Data } from './types';

export default function ({ env, data, inputs, outputs, logger, onError }: RuntimeParams<Data>) {
  const { runImmediate } = data;
  const { vars } = env;
  try {
    if (env.runtime) {
      // 监听路由变化事件
      window.onpopstate = function (event) {
        // 获取当前路由
        var currentRoute = window.location.pathname;
        // 处理路由变化
        outputs['route'](currentRoute);
      };
    }
  } catch (ex) {
    onError?.(ex);
    console.error('路由参数组件运行错误.', ex);
    logger.error(`${ex}`);
  }
}
