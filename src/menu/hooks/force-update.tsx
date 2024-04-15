import React, { useState } from 'react'

/** 强制执行 render，效果同 setState 的副作用 */
export default function useForceUpdate() {
  const [_, update] = useState(0);
  return () => update(Math.random());
}
