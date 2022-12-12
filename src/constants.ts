export const useFormProps = [
  'mode',
  'reValidateMode',
  'resolver',
  'context',
  'shouldFocusError',
  'shouldUnregister',
  'shouldUseNativeValidation',
  'criteriaMode',
  'delayError',
] as const;

export const validationRuleProps = ['required', 'pattern', 'minLength', 'maxLength', 'min', 'max'] as const;
