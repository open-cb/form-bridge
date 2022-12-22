import type { FieldValues } from 'react-hook-form';
import { Controller as BaseController, useFormContext } from 'react-hook-form';

import get from 'lodash-es/get';
import pick from 'lodash-es/pick';
import omit from 'lodash-es/omit';
import unset from 'lodash-es/unset';
import merge from 'lodash-es/merge';

import { forwardRefWithAs, getAdaptorForComponent, getDisplayName, messagifyValidationRules, render } from '../utils';
import { validationRuleProps } from '../constants';
import { Props, PropsAdaptor, ReactTag } from '../types';
import React, { ForwardedRef, Fragment } from 'react';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';
import { Control, FieldPath, FieldPathValue, UseFormStateReturn } from 'react-hook-form/dist/types';
import { ControllerFieldState, ControllerRenderProps } from 'react-hook-form/dist/types/controller';
import { useFormConfig } from './FormConfig';

export interface RenderProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<TFieldValues>;
}

type BaseComponentProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTag extends ReactTag = typeof Fragment
> = Omit<RegisterOptions<TFieldValues, TName>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>
  & Props<TTag>

export interface ComponentProps<
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
>(props: ComponentProps<TFieldValues, TName, TTag> & BaseComponentProps<TFieldValues, TName, TTag>, ref: ForwardedRef<HTMLElement>) {
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
            const configPropsAdaptor = propsAdapters && getAdaptorForComponent(propsAdapters, props.as);

            if (!configPropsAdaptor) {
              ourProps = { ref, value: renderProps.field.value, onChange: renderProps.field.onChange };
            } else {
              ourProps = { ref, ...configPropsAdaptor(renderProps as any) };
            }
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
