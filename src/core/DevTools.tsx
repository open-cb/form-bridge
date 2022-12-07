import {ComponentType, lazy} from 'react';

// eslint-disable-next-line import/no-mutable-exports
let Component: ComponentType<any>;

if (import.meta.env.DEV) {
  // eslint-disable-next-line import/no-extraneous-dependencies
  Component = lazy(() =>
    import('@hookform/devtools').then((m) => ({ default: m.DevTool })),
  );
} else {
  Component = function Dummy() {
    return null;
  };
}

export default Component;
