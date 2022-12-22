import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import { createContext, useContext, useState } from 'react';
import type { FieldErrors } from 'react-hook-form';
import { useTempState } from '../utils';


export interface StaticErrorsContext {
  readonly errors?: FieldErrors,
  setErrors: Dispatch<SetStateAction<FieldErrors | undefined>>;
}

const staticErrorsContext = createContext<StaticErrorsContext>({
  setErrors: () => undefined,
  errors: undefined,
});


export const useStaticErrors = () => useContext(staticErrorsContext);


export default function StaticErrorsProvider({ children }: PropsWithChildren<{}>) {
  const [errors, setErrors] = useState<FieldErrors | undefined>(undefined);
  const tempErrors = useTempState(errors);

  return (
    <staticErrorsContext.Provider
      value={{
        errors: tempErrors.current,
        setErrors,
      }}
    >
      {children}
    </staticErrorsContext.Provider>
  );
}

