import React, { ComponentProps, ForwardedRef, forwardRef, PropsWithChildren } from 'react';
import { Method } from '../types';
import { FieldValues, useFormContext } from 'react-hook-form';
import { FieldErrors } from 'react-hook-form/dist/types/errors';
import merge from 'lodash-es/merge';
import { useFormConfig } from './FormConfig';
import { useStaticErrors } from './StaticErrors';

type FormProps = Omit<ComponentProps<'form'>, 'method' | 'action' | 'onSubmit' | 'target' | 'onInvalid'>;

export interface PostableFormProps<
  SubmitResponse = unknown,
  TFieldValues extends FieldValues = FieldValues,
> extends FormProps {
  method?: Method;
  action: string;
  onSubmit?: (data: TFieldValues, conf: { method: Method, action: string }, event?: React.BaseSyntheticEvent) => Promise<SubmitResponse> | undefined
  onInvalid?: (error: FieldErrors<TFieldValues>, event?: React.BaseSyntheticEvent) => any | Promise<any>
  onSubmitSuccess?: (res: SubmitResponse | undefined) => any | Promise<any>,
  onSubmitError?: (err: unknown) => any,
  apiErrorAdaptor?: (err: unknown) => FieldErrors | undefined,
}

export default forwardRef(function PostableForm<
  SubmitResponse = unknown,
  TFieldValues extends FieldValues = FieldValues
>(props: PropsWithChildren<PostableFormProps<SubmitResponse, TFieldValues>>, ref: ForwardedRef<HTMLFormElement>) {
  const form = useFormContext<TFieldValues>();
  const { components } = useFormConfig();
  const staticErrors = useStaticErrors();

  const {
    method = 'post', action,
    onInvalid, onSubmit, onSubmitSuccess, onSubmitError,
    apiErrorAdaptor,
    ...restProps
  } = merge(props, components?.PostableForm?.defaultProps);

  return (
    <form
      {...restProps}
      ref={ref}
      onSubmit={form.handleSubmit(async (data, event) => {
        let response: SubmitResponse | undefined;

        try {
          response = await onSubmit?.(data, { method, action }, event);
        } catch (err: any) {
          staticErrors.setErrors(apiErrorAdaptor?.(err))
          return onSubmitError?.(err);
        }

        await onSubmitSuccess?.(response)?.catch();
        staticErrors.setErrors(undefined);
      }, onInvalid)}
    />
  );
});
