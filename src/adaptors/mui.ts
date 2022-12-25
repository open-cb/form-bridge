import { PropsAdaptor } from "../types";

export const TextFieldPropsAdaptor: PropsAdaptor = ({ field: { value, onChange }, fieldState: { error } }) => ({
  value: value ?? '',
  onChange,
  error: !!error?.message,
  helperText: error?.message,
});

export const RatingPropsAdaptor: PropsAdaptor = ({ field: { value, onChange }, fieldState: { error } }) => ({
  value: +value ?? 0,
  onChange,
});
