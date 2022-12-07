import { Controller as BaseController, useFormContext } from 'react-hook-form';
import type { FieldValues, Path, ControllerProps } from 'react-hook-form';

import get from 'lodash-es/get';
import pick from 'lodash-es/pick';
import omit from 'lodash-es/omit';
import unset from 'lodash-es/unset';
import { messagifyValidationRules } from '../utils';

export type Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
  > = Omit<ControllerProps<TFieldValues, TName>, 'rules'> &
  ControllerProps<TFieldValues, TName>['rules'];

export const rulePropsList = [
  'required',
  'min',
  'max',
  'maxLength',
  'minLength',
  'pattern',
  'validate',
] as const;

export default function Controller<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
  >({ render, name, ...props }: Props<TFieldValues, TName>) {
  const form = useFormContext();
  const rulesProps = pick(props, rulePropsList);
  const controllerProps = omit(props, rulePropsList);

  return (
    <BaseController
      {...controllerProps}
      name={name}
      render={(renderProps) => {
        const formOnChange = renderProps.field.onChange;

        renderProps.field.onChange = (e) => {
          // eslint-disable-next-line no-underscore-dangle
          unset((form.control as any)._apiErrors, name);
          formOnChange(e);
        };

        // @ts-ignore
        return render({
          ...renderProps,
          fieldState: {
            ...renderProps.fieldState,
            error: renderProps.fieldState.error ?? get((form.control as any)._apiErrors, name),
          },
        });
      }}
      rules={{
        ...messagifyValidationRules(rulesProps),
        validate: rulesProps.validate,
      }}
    />
  );
}
