import type { FormEventHandler, ForwardedRef, MutableRefObject } from 'react';
import { ElementType, Suspense } from 'react';

import type { FieldValues, SubmitErrorHandler, SubmitHandler, UseFormProps, UseFormReturn } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';

import omit from 'lodash-es/omit';
import pick from 'lodash-es/pick';
import stableHash from 'stable-hash';

import DevTools from './DevTools';
import { ApiErrors, apiToFormErrors, forwardRefWithAs, render, useTempState } from '../utils';
import { useFormProps } from '../constants';
import { Props } from '../types';

export type FormProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTag extends ElementType<{ onSubmit: FormEventHandler }> = 'form'
> =
  UseFormProps<TFieldValues, TContext>
  & Props<TTag, 'onSubmit' | 'ref' | 'defaultValue'>
  & {
  onSubmit?: SubmitHandler<TFieldValues>;
  onInvalid?: SubmitErrorHandler<TFieldValues>;
  errors?: ApiErrors;
  formRef?: ForwardedRef<UseFormReturn<TFieldValues, TContext>>,
};

function Form<TFieldValues extends FieldValues = FieldValues, TContext = any>(
  props: FormProps<TFieldValues, TContext>,
  ref: ForwardedRef<HTMLElement>,
) {
  const {
    errors,
    children,
    onSubmit = () => undefined,
    onInvalid,
    formRef,
    ...theirProps
  } = omit(props, useFormProps) as Omit<FormProps<TFieldValues, TContext>, typeof useFormProps[number]>;

  const form = useForm<TFieldValues, TContext>({
    ...pick(props, useFormProps),
    mode: props.mode ?? 'onBlur',
    reValidateMode: props.reValidateMode ?? 'onChange',
  });

  const internalErrors = useTempState(errors);
  if (internalErrors.current && stableHash(internalErrors.current) !== (form.control as any)?._apiErrorsHash) {
    // TODO: use proper context rather than appending form.control;
    (form.control as any)._apiErrors = apiToFormErrors(internalErrors.current);
    (form.control as any)._apiErrorsHash = stableHash(internalErrors.current);
  }

  if (formRef) {
    if (typeof ref === 'function') {
      (formRef as ((instance: UseFormReturn<TFieldValues, TContext> | null) => void))(form);
    } else {
      (formRef as MutableRefObject<UseFormReturn<TFieldValues, TContext>>).current = form;
    }
  }

  return (
    <FormProvider {...form}>
      {render({
        defaultTag: 'form',
        name: 'Form.Render',
        theirProps: {
          ...theirProps,
          children,
        },
        ourProps: {
          ref,
          onSubmit: form.handleSubmit(
            (data, event) => {
              Promise.resolve(onSubmit(data, event)).then(() => {
                (form.control as any)._apiErrors = null;
                (form.control as any)._apiErrorsHash = null;
              });
            },
            onInvalid,
          ),
        },
      })}

      <Suspense fallback={<span />}>
        <DevTools control={form.control} />
      </Suspense>
    </FormProvider>
  );
}

export default forwardRefWithAs(Form);
