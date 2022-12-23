import { Fragment, ComponentType, lazy } from 'react';

let Component: ComponentType<any> = lazy(() => (
  import('@hookform/devtools')
    .then((m) => ({ default: m.DevTool }))
    .catch(() => ({ default: () => <Fragment /> }))
));

export default Component;
