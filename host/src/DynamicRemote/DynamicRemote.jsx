import React from 'react';

import { loadRemote } from './utils';

export const DynamicRemote = (props) => {
  const { remote, url, module } =
    props;

  const Component = React.lazy(
    loadRemote(remote, 'default', module, url),
  );

  return <Component />;
};
