export const useFormProps = [
  'mode',
  'reValidateMode',
  'defaultValues',
  'values',
  'resetOptions',
  'resolver',
  'context',
  'shouldFocusError',
  'shouldUnregister',
  'shouldUseNativeValidation',
  'criteriaMode',
  'delayError',
] as const;

export const validationRuleProps = ['required', 'pattern', 'minLength', 'maxLength', 'min', 'max', 'validate'] as const;
