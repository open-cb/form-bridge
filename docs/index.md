# Getting Started

## Installation

Create a `.npmrc` file in your project alongside `package.json` with following connect.

``` properties title=".npmrc"
@cb-pkg:registry=https://npm.pkg.github.com
```

Install `form-bridge` package:

```sh
npm install @cb-pkg/form-bridge react-hook-form --save
```

You can optionally also install devtools: 

```sh
npm install @hookform/devtools --save-dev
```

## Quick start with MUI

Define the global config:

=== "Typescript"

    ``` ts title="formConfig.ts"
    import { Rating, TextField } from '@mui/material';

    import type { FormConfigType } from '@cb-pkg/react-forms';
    import {
      drfErrorsAdaptor
    } from '@cb-pkg/react-forms/adaptors/django';
    import {
      TextFieldPropsAdaptor,
      RatingPropsAdaptor
    } from '@cb-pkg/react-forms/adaptors/mui';
    
    import Axios from 'axios';
    
    
    export default {
      components: {
        Form: {
          defaultProps: {
            onSubmit: (data, { method, action }, e) => (
              Axios(action, { method, data })
            ),
            apiErrorAdaptor: drfErrorsAdaptor,
            enableDevtools: true, // (1)!
          }
        },
        Controller: {
          propsAdapters: [
            {
              component: TextField,
              adaptor: TextFieldPropsAdaptor,
            },
            {
              component: Rating,
              adaptor: RatingPropsAdaptor,
            },
          ],
        },
      }
    } as FormConfigType;
    ```

    1. If you wan to enable devtools for all the forms. It also requires `@hookform/devtools` to be installed.

=== "Javascript"

    ``` js title="formConfig.js"
    import { Rating, TextField } from '@mui/material';

    import {
      drfErrorsAdaptor
    } from '@cb-pkg/react-forms/adaptors/django';
    import {
      TextFieldPropsAdaptor,
      RatingPropsAdaptor
    } from '@cb-pkg/react-forms/adaptors/mui';
    
    import Axios from 'axios';
    
    
    export default {
      components: {
        Form: {
          defaultProps: {
            onSubmit: (data, { method, action }, e) => (
              Axios(action, { method, data })
            ),
            apiErrorAdaptor: drfErrorsAdaptor,
            enableDevtools: true, // (1)!
          }
        },
        Controller: {
          propsAdapters: [
            {
              component: TextField,
              adaptor: TextFieldPropsAdaptor,
            },
            {
              component: Rating,
              adaptor: RatingPropsAdaptor,
            },
          ],
        },
      }
    };
    ```

    1. If you wan to enable devtools for all the forms. It also requires `@hookform/devtools` to be installed.

Provide the form config at the root of app, like so:

=== "Typescript"

    ``` jsx title="main.tsx" hl_lines="7 12"
    import { FormConfig } from '@cb-pkg/react-forms';
    import formConfig from './formConfig';
    // ...other imports and code
    
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <FormConfig config={formConfig}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </FormConfig>
      </React.StrictMode>,
    );
    ```

=== "Javascript"

    ``` jsx title="main.jsx" hl_lines="7 12"
    import { FormConfig } from '@cb-pkg/react-forms';
    import formConfig from './formConfig';
    // ...other imports and code
    
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <FormConfig config={formConfig}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </FormConfig>
      </React.StrictMode>,
    );
    ```

Finally, use it in your component, for example let build a login component here:

=== "Typescript"

    ``` jsx title="Login.tsx"
    import React from 'react';
    import { Controller, Form } from '@cb-pkg/react-forms';
    import { Button, TextField } from '@mui/material';
    import { useNavigate } from 'react-router-dom';
    
    export default function Login() {
      const navigate = useNavigate();

      return (
        <Form
          action="/api/login"
          onSubmitSuccess={(res: any) => {
            localStorage.setItem('accessToken', res.data.accessToken);
            navigate('/');
          }}
        >
          <Controller
            as={TextField}
            name='email'
            label='Email'
            pattern='email'
            required
          />

          <Controller
            as={TextField}
            name='password'
            label='Password'
            required
          />

          <Button type='submit' variant='contained'>
            Login
          </Button>
        </Form>
      );
    }
    ```

=== "Javascript"

    ``` jsx title="Login.jsx"
    import React from 'react';
    import { Controller, Form } from '@cb-pkg/react-forms';
    import { Button, TextField } from '@mui/material';
    import { useNavigate } from 'react-router-dom';
    
    export default function Login() {
      const navigate = useNavigate();

      return (
        <Form
          action="/api/login"
          onSubmitSuccess={(res) => {
            localStorage.setItem('accessToken', res.data.accessToken);
            navigate('/');
          }}
        >
          <Controller
            as={TextField}
            name='email'
            label='Email'
            pattern='email'
            required
          />

          <Controller
            as={TextField}
            name='password'
            label='Password'
            required
          />

          <Button type='submit' variant='contained'>
            Login
          </Button>
        </Form>
      );
    }
    ```
