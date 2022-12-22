import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';

import type { BaseControllerProps } from './Controller';
import type { PropsAdaptorItem } from '../types';


interface Components {
  Controller?: {
    defaultProps?: Partial<BaseControllerProps>,
    propsAdapters?: PropsAdaptorItem[]
  },
}

export interface FormConfig {
  components?: Components,
}

const formConfigContext = createContext<FormConfig>({});


export const useFormConfig = () => useContext(formConfigContext);


interface Props {
  config: FormConfig;
}

export default function FormConfig({ config, children }: PropsWithChildren<Props>) {
  return (
    <formConfigContext.Provider value={config}>
      {children}
    </formConfigContext.Provider>
  );
}

