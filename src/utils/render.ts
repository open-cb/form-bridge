import omit from 'lodash-es/omit';
import { cloneElement, createElement, ElementType, forwardRef, Fragment, isValidElement, ReactElement } from 'react';
import { Expand, Props } from '../types';

export function render<TTag extends ElementType, TSlot>({ ourProps, theirProps, slot, defaultTag, name }: {
  ourProps: Expand<Props<TTag, any>>
  theirProps: Expand<Props<TTag, any>>
  slot?: TSlot
  defaultTag: ElementType
  name: string
}) {
  return _render(mergeProps(theirProps, ourProps), slot, defaultTag, name);
}

function _render<TTag extends ElementType, TSlot>(
  props: Props<TTag> & { ref?: unknown },
  slot: TSlot = {} as TSlot,
  tag: ElementType,
  name: string,
) {
  let {
    as: Component = tag,
    children,
    refName = 'ref',
    ...rest
  } = omit(props, ['unmount', 'static']);

  // This allows us to use `<HeadlessUIComponent as={MyComponent} refName="innerRef" />`
  let refRelatedProps = props.ref !== undefined ? { [refName]: props.ref } : {};

  let resolvedChildren = children as
    | ReactElement
    | ReactElement[];

  // Allow for className to be a function with the slot as the contents
  if (rest.className && typeof rest.className === 'function') {
    (rest as any).className = rest.className(slot);
  }

  if (Component === Fragment) {
    if (Object.keys(compact(rest)).length > 0) {
      if (
        !isValidElement(resolvedChildren) ||
        (Array.isArray(resolvedChildren) && resolvedChildren.length > 1)
      ) {
        throw new Error(
          [
            'Passing props on "Fragment"!',
            '',
            `The current component <${name} /> is rendering a "Fragment".`,
            `However we need to passthrough the following props:`,
            Object.keys(rest)
              .map((line) => `  - ${line}`)
              .join('\n'),
            '',
            'You can apply a few solutions:',
            [
              'Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".',
              'Render a single element as the child so that we can forward the props onto that element.',
            ]
              .map((line) => `  - ${line}`)
              .join('\n'),
          ].join('\n'),
        );
      }

      return cloneElement(
        resolvedChildren,
        Object.assign(
          {},
          // Filter out undefined values so that they don't override the existing values
          mergeProps(resolvedChildren.props as Props<any>, compact(omit(rest, ['ref']))),
          refRelatedProps,
          mergeRefs((resolvedChildren as any).ref, refRelatedProps.ref),
        ),
      );
    }
  }

  return createElement(
    Component,
    Object.assign(
      {},
      omit(rest, ['ref']),
      Component !== Fragment && refRelatedProps,
    ),
    resolvedChildren,
  );
}

function mergeRefs(...refs: any[]) {
  return {
    ref: refs.every((ref) => ref == null)
      ? undefined
      : (value: any) => {
        for (let ref of refs) {
          if (ref == null) continue;
          if (typeof ref === 'function') ref(value);
          else ref.current = value;
        }
      },
  };
}

function mergeProps(...listOfProps: Props<any, any>[]) {
  if (listOfProps.length === 0) return {};
  if (listOfProps.length === 1) return listOfProps[0];

  let target: Props<any, any> = {};

  let eventHandlers: Record<
    string,
    ((event: { defaultPrevented: boolean }, ...args: any[]) => void | undefined)[]
  > = {};

  for (let props of listOfProps) {
    for (let prop in props) {
      // Collect event handlers
      // @ts-ignore
      if (prop.startsWith('on') && typeof props[prop] === 'function') {
        eventHandlers[prop] ??= [];
        // @ts-ignore
        eventHandlers[prop].push(props[prop]);
      } else {
        // Override incoming prop
        // @ts-ignore
        target[prop] = props[prop];
      }
    }
  }

  // Do not attach any event handlers when there is a `disabled` or `aria-disabled` prop set.
  // @ts-ignore
  if (target.disabled || target['aria-disabled']) {
    return Object.assign(
      target,
      // Set all event listeners that we collected to `undefined`. This is
      // important because of the `cloneElement` from above, which merges the
      // existing and new props, they don't just override therefore we have to
      // explicitly nullify them.
      Object.fromEntries(Object.keys(eventHandlers).map((eventName) => [eventName, undefined])),
    );
  }

  // Merge event handlers
  for (let eventName in eventHandlers) {
    let handlers = eventHandlers[eventName];

    if (handlers.length === 1) {
      (target as any)[eventName] = handlers[0];
      continue;
    }

    Object.assign(target, {
      [eventName](event: { nativeEvent?: Event; defaultPrevented: boolean }, ...args: any[]) {
        let handlers = eventHandlers[eventName];

        for (let handler of handlers) {
          if (
            (event instanceof Event || event?.nativeEvent instanceof Event) &&
            event.defaultPrevented
          ) {
            return;
          }

          handler(event, ...args);
        }
      },
    });
  }

  return target;
}

/**
 * This is a hack, but basically we want to keep the full 'API' of the component, but we do want to
 * wrap it in a forwardRef so that we _can_ passthrough the ref
 */
export function forwardRefWithAs<T extends { name: string; displayName?: string }>(
  component: T,
): T & { displayName: string } {
  return Object.assign(forwardRef(component as unknown as any) as any, {
    displayName: component.displayName ?? component.name,
  });
}

export function compact<T extends Record<any, any>>(object: T) {
  let clone = Object.assign({}, object);
  for (let key in clone) {
    if (clone[key] === undefined) delete clone[key];
  }
  return clone;
}
