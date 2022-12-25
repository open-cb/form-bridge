import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';

import type { BaseControllerProps } from './Controller';
import type { PropsAdaptorItem } from '../types';
import type { PostableFormProps } from './PostableForm';
import type { FormProps } from './Form';


interface Components {
  Controller?: {
    defaultProps?: Partial<BaseControllerProps>,
    propsAdapters?: PropsAdaptorItem[]
  },
  PostableForm?: {
    defaultProps?: Partial<PostableFormProps>,
  },
  Form?: {
    defaultProps?: Partial<FormProps>,
  },
}

export interface FormConfigType {
  components?: Components,
}

const formConfigContext = createContext<FormConfigType>({});


export const useFormConfig = () => useContext(formConfigContext);


interface Props {
  config: FormConfigType;
}

export default function FormConfig({ config, children }: PropsWithChildren<Props>) {
  return (
    <formConfigContext.Provider value={config}>
      {children}
    </formConfigContext.Provider>
  );
}

