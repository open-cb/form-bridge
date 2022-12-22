import type { ElementType } from 'react';
import { PropsAdaptor, PropsAdaptorItem } from '../types';

export function getDisplayName(Component: any): string {
  return (
    Component.displayName ||
    Component.name ||
    (typeof Component === 'string' && Component.length > 0 && Component) ||
    Component.$$typeof.toString().includes('forward_ref') && getDisplayName(Component.render) ||
    'Unknown'
  );
}

export function getConfigForComponent<
  TTag extends ElementType
>(config: PropsAdaptorItem<TTag>[], component: ElementType): PropsAdaptorItem<TTag> | undefined {
  return config.find(({ component: cType }) => {
    return getDisplayName(component) === getDisplayName(cType);
  }) as PropsAdaptorItem<TTag>;
}
