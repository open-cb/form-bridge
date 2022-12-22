import get from 'lodash-es/get';
import pick from 'lodash-es/pick';
import omit from 'lodash-es/omit';
import unset from 'lodash-es/unset';
import merge from 'lodash-es/merge';

import type {
  Control, FieldPath, FieldPathValue, UseFormStateReturn,
  RegisterOptions, ControllerFieldState, ControllerRenderProps,
  FieldValues,
} from 'react-hook-form';
import React, { ForwardedRef, Fragment } from 'react';
import { Controller as BaseController, useFormContext } from 'react-hook-form';

import { useFormConfig } from './FormConfig';

import { validationRuleProps } from '../constants';
import { Props, PropsAdaptor, ReactTag } from '../types';
import {
  forwardRefWithAs, getConfigForComponent,
  messagifyValidationRules, render,
} from '../utils';

export interface RenderProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<TFieldValues>;
}

type MoreProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTag extends ReactTag = typeof Fragment
> = Omit<RegisterOptions<TFieldValues, TName>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>
  & Props<TTag>

export interface BaseControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTag extends ReactTag = typeof Fragment
> {
  name: TName;
  shouldUnregister?: boolean;
  defaultValue?: FieldPathValue<TFieldValues, TName>;
  control?: Control<TFieldValues>;
  render?: (renderProps: RenderProps<TFieldValues, TName>) => React.ReactElement;
  propsAdapter?: PropsAdaptor<TTag, TFieldValues, TName>;
}

export default forwardRefWithAs(function Controller<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTag extends ReactTag = typeof Fragment
>(props: BaseControllerProps<TFieldValues, TName, TTag> & MoreProps<TFieldValues, TName, TTag>, ref: ForwardedRef<HTMLElement>) {
  const form = useFormContext();
  const config = useFormConfig();

  const defaultProps = config.components?.Controller?.defaultProps;
  const propsAdapters = config.components?.Controller?.propsAdapters;

  props = merge(props, defaultProps);
  const rulesProps = pick(props, validationRuleProps);
  const cProps = pick(props, ['shouldUnregister', 'defaultValue'] as const);

  return (
    <BaseController
      {...cProps}
      name={props.name as any}
      rules={{
        ...messagifyValidationRules(rulesProps),
        validate: rulesProps.validate,
      }}
      render={(renderProps) => {
        // wraps onChange callback of base controller
        // to remove api errors on change
        // and also to trim string values
        const formOnChange = renderProps.field.onChange;
        renderProps.field.onChange = (e) => {
          // eslint-disable-next-line no-underscore-dangle
          unset((form.control as any)._apiErrors, props.name);
          if (typeof e?.target?.value === 'string') {
            e.target.value = e.target.value.trim();
          }
          formOnChange(e);
        };

        // add api error to field if available
        renderProps.fieldState = new Proxy(renderProps.fieldState, {
          get(target: ControllerFieldState, prop: string | symbol, receiver: any): any {
            if (prop === 'error') {
              return Reflect.get(target, prop, receiver) ?? get((form.control as any)._apiErrors, props.name);
            }

            return Reflect.get(target, prop, receiver);
          },
        });

        if (props.as) {
          const theirProps = omit(props, [
            ...validationRuleProps,
            'shouldUnregister', 'defaultValue', 'name', 'propsAdapter',
          ]);
          let ourProps;

          // compute component props by using provide propsAdapter prop
          // or by using global component propsAdapter config
          if (props.propsAdapter) {
            ourProps = { ref, ...props.propsAdapter(renderProps as any) };
          } else {
            const componentConfig = propsAdapters && getConfigForComponent(propsAdapters, props.as);

            ourProps = {
              ref,
              ...componentConfig?.defaultProps ?? {},
              ...(componentConfig?.adaptor ?
                componentConfig.adaptor(renderProps as any) :
                {
                  value: renderProps.field.value,
                  onChange: renderProps.field.onChange,
                }),
            };
          }

          return render({
            ourProps,
            theirProps,
            defaultTag: Fragment,
            name: 'Controller.Renderer',
          });
        }

        return (props.render as any)?.(renderProps);
      }}
    />
  );
});
