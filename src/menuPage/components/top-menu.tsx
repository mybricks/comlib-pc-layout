import React, { useLayoutEffect, useMemo, useState } from 'react';
import css from '../style.less';

export default function TopMenu(props) {

  return (
    <div className={css.navbar} data-top-menu>
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Services</a>
      <a href="#">Contact</a>
    </div>
  );

}