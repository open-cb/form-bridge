import { ReactNode, ReactElement, JSXElementConstructor } from 'react'

export type ReactTag = keyof JSX.IntrinsicElements | JSXElementConstructor<any>

// A unique placeholder we can use as a default. This is nice because we can use this instead of
// defaulting to null / never / ... and possibly collide with actual data.
// Ideally we use a unique symbol here.
let __ = '1D45E01E-AF44-47C4-988A-19A94EBAF55C' as const
export type __ = typeof __

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

export type PropsOf<TTag extends ReactTag> = TTag extends React.ElementType
  ? React.ComponentProps<TTag>
  : never

type PropsWeControl = 'as' | 'children' | 'refName' | 'className'

// Resolve the props of the component, but ensure to omit certain props that we control
type CleanProps<
  TTag extends ReactTag,
  TOmitableProps extends PropertyKey = __
> = TOmitableProps extends __
  ? Omit<PropsOf<TTag>, PropsWeControl>
  : Omit<PropsOf<TTag>, TOmitableProps | PropsWeControl>

// Add certain props that we control
interface OurProps<TTag extends ReactTag> {
  as?: TTag;
  children?: ReactNode;
  refName?: string
}

// Provide clean TypeScript props, which exposes some of our custom API's.
export type Props<
  TTag extends ReactTag,
  TOmitableProps extends PropertyKey = __
> = CleanProps<TTag, TOmitableProps> & OurProps<TTag>

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
export type XOR<T, U> = T | U extends __
  ? never
  : T extends __
    ? U
    : U extends __
      ? T
      : T | U extends object
        ? (Without<T, U> & U) | (Without<U, T> & T)
        : T | U
