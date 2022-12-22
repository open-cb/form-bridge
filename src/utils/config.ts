import type { ElementType } from 'react';
import { PropsAdaptorItem } from '../core/FormConfig';
import { PropsAdaptor } from '../types';

export function getDisplayName(Component: any): string {
  return (
    Component.displayName ||
    Component.name ||
    (typeof Component === 'string' && Component.length > 0
      ? Component
      : 'Unknown')
  );
}

export function getAdaptorForComponent<
  TTag extends ElementType
>(config: PropsAdaptorItem[], component: ElementType): PropsAdaptor<TTag> | undefined {
  return config.find(({ component: cType }) => {
    return component === cType;
  })?.adaptor as PropsAdaptor<TTag>;
}
