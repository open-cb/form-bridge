import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import { createContext, useContext, useState } from 'react';
import type { FieldErrors } from 'react-hook-form';
import unset from 'lodash-es/unset';
import get from 'lodash-es/get';


export interface StaticErrorsContext {
  readonly errors?: FieldErrors,
  setErrors: Dispatch<SetStateAction<FieldErrors | undefined>>;
  unsetFieldError: (fieldName: string) => void;
  getFieldError: (fieldName: string) => void;
}

const staticErrorsContext = createContext<StaticErrorsContext>({
  setErrors: () => undefined,
  errors: undefined,
  unsetFieldError: () => undefined,
  getFieldError: () => undefined,
});


export const useStaticErrors = () => useContext(staticErrorsContext);


export default function StaticErrorsProvider({ children }: PropsWithChildren<{}>) {
  const [errors, setErrors] = useState<FieldErrors | undefined>(undefined);

  return (
    <staticErrorsContext.Provider
      value={{
        errors,
        setErrors,
        unsetFieldError: (fieldName) => {
          const newErrors = {...errors};
          unset(newErrors, fieldName);
          setErrors(newErrors);
        },
        getFieldError: (fieldName) => get(errors, fieldName),
      }}
    >
      {children}
    </staticErrorsContext.Provider>
  );
}

