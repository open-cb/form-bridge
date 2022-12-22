import type { ElementType, PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';
import type { ComponentProps } from './Controller';
import type { PropsAdaptor } from '../types';

export interface PropsAdaptorItem {
  component: ElementType,
  adaptor: PropsAdaptor,
}


interface Components {
  Controller?: {
    defaultProps?: Partial<ComponentProps>,
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

