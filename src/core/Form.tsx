import type { ForwardedRef, MutableRefObject } from 'react';
import { ElementType, Suspense } from 'react';

import type { FieldValues, UseFormProps, UseFormReturn } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import omit from 'lodash-es/omit';
import pick from 'lodash-es/pick';
import merge from 'lodash-es/merge';

import DevTools from './DevTools';
import { forwardRefWithAs, render } from '../utils';
import { useFormProps } from '../constants';
import { Props } from '../types';
import PostableForm from './PostableForm';
import { useFormConfig } from './FormConfig';
import StaticErrorsProvider from './StaticErrors';

interface BaseFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any
> extends UseFormProps<TFieldValues, TContext> {
  formRef?: ForwardedRef<UseFormReturn<TFieldValues, TContext>>,
  enableDevtools?: boolean;
}

export type FormProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTag extends ElementType = typeof PostableForm
> =
  Props<TTag>
  & BaseFormProps<TFieldValues, TContext>;

function Form<TFieldValues extends FieldValues = FieldValues, TContext = any>(
  props: FormProps<TFieldValues, TContext>,
  ref: ForwardedRef<HTMLElement>,
) {
  const { components } = useFormConfig();
  props = merge(props, components?.Controller?.defaultProps);
  const { formRef, enableDevtools = false, ...theirProps } = omit(props, useFormProps);

  const form = useForm<TFieldValues, TContext>({
    ...pick(props, useFormProps),
    mode: props.mode ?? 'onBlur',
    reValidateMode: props.reValidateMode ?? 'onChange',
  });

  if (formRef) {
    if (typeof formRef === 'function') {
      (formRef as ((instance: UseFormReturn<TFieldValues, TContext> | null) => void))(form);
    } else {
      (formRef as MutableRefObject<UseFormReturn<TFieldValues, TContext>>).current = form;
    }
  }

  return (
    <FormProvider {...form}>
      <StaticErrorsProvider>
        {render({
          defaultTag: PostableForm,
          name: 'PostableForm',
          theirProps: theirProps,
          ourProps: { ref },
        })}
      </StaticErrorsProvider>

      {enableDevtools && (
        <Suspense fallback={<span />}>
          <DevTools control={form.control} />
        </Suspense>
      )}
    </FormProvider>
  );
}

export default forwardRefWithAs(Form);
