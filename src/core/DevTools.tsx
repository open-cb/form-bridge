import { Fragment, ComponentType, lazy } from 'react';

let Component: ComponentType<any> = import.meta.env.MODE === 'development' ? lazy(() => (
  import('@hookform/devtools')
    .then((m) => ({ default: m.DevTool }))
    .catch(() => ({ default: () => <Fragment /> }))
)) : () => <Fragment />;

export default Component;
