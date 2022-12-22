import type { ReactElement } from 'react';

import { useWatch } from 'react-hook-form';
import { Control, DeepPartialSkipArrayKey, FieldPath, FieldPathValue, FieldValues } from 'react-hook-form/dist/types';

interface Props {
  disabled?: boolean;
  exact?: boolean;
}

// export default function WatchState<
//   TFieldValues extends FieldValues = FieldValues
// >(props : {
//   defaultValue?: DeepPartialSkipArrayKey<TFieldValues>;
//   control?: Control<TFieldValues>;
// } & Props): ReactElement | null;

export default function WatchState<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props : {
  name: TFieldName;
  defaultValue?: FieldPathValue<TFieldValues, TFieldName>;
  control?: Control<TFieldValues>;
} & Props): ReactElement | null;

export default function WatchState<
  TFieldValues extends FieldValues = FieldValues,
  TFieldNames extends readonly FieldPath<TFieldValues>[] = readonly FieldPath<TFieldValues>[]
>(props : {
  name: readonly [...TFieldNames];
  defaultValue?: DeepPartialSkipArrayKey<TFieldValues>;
  control?: Control<TFieldValues>;
} & Props): ReactElement | null {
  const state = useWatch(props);

  return <div />;
}
