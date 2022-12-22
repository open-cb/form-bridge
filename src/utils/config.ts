import type { ElementType } from 'react';
import { PropsAdaptorItem } from '../core/FormConfig';
import { PropsAdaptor } from '../types';

export function getDisplayName(Component: any): string {
  return (
    Component.displayName ||
    Component.name ||
    (typeof Component === 'string' && Component.length > 0 && Component) ||
    Component.$$typeof.toString().includes('forward_ref') && getDisplayName(Component.render) ||
    'Unknown'
  );
}

export function getAdaptorForComponent<
  TTag extends ElementType
>(config: PropsAdaptorItem[], component: ElementType): PropsAdaptor<TTag> | undefined {

  return config.find(({ component: cType }) => {
    return getDisplayName(component) === getDisplayName(cType);
  })?.adaptor as PropsAdaptor<TTag>;
}
