import type { ReactElement } from 'react';

import type {
  UseFieldArrayProps,
  UseFieldArrayReturn,
  FieldValues,
  FieldArrayPath,
} from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';

type Props<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
  TKeyName extends string = 'id',
  > = UseFieldArrayProps<TFieldValues, TFieldArrayName, TKeyName> & {
  render: (
    props: UseFieldArrayReturn<TFieldValues, TFieldArrayName, TKeyName>,
  ) => ReactElement;
};

export default function FieldArray<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
  TKeyName extends string = 'id',
  >({ render, ...props }: Props<TFieldValues, TFieldArrayName, TKeyName>) {
  return render(useFieldArray(props));
}
