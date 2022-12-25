# Introduction

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

## Usage

=== "Typescript"

    ``` ts title="formConfig.ts"
    import {Form, Controller} from '@cb-pkg/form-bridge';
    import {TextField, Button} from '@mui/material';
    import Axios from 'axios';
    
    import {drfErrorsAdaptor} from '@cb-pkg/form-bridge/adaptors/django';
    import {TextFieldPropsAdaptor} from '@cb-pkg/form-bridge/adaptors/mui';
    
    function Foo() {
      return (
        <Form
          action="/api/login"
          onSubmit={(data, {method, action}) => Axios(action, { method, data })}
          apiErrorAdaptor={drfErrorsAdaptor}
          onSubmitSuccess={(res: any) => {
            localStorage.setItem('accessToken', res.data.accessToken);
            navigate('/');
          }}
        >
          <Controller
            as={TextField}
            defaultValue=""
            label="Email"
            name="email"
            pattern="email"
            propsAdaptor={TextFieldPropsAdaptor}
            required
          />

          <Controller
            as={TextField}
            defaultValue=""
            label="Password"
            name="email"
            propsAdaptor={TextFieldPropsAdaptor}
            required
          />
      
          <Button type="submit">Login</Button>
        </Form>
      );
    }
    ```

=== "Javascript"

    ``` js title="formConfig.js"
    import {Form, Controller} from '@cb-pkg/form-bridge';
    import {TextField, Button} from '@mui/material';
    import Axios from 'axios';
    
    import {drfErrorsAdaptor} from '@cb-pkg/form-bridge/adaptors/django';
    import {TextFieldPropsAdaptor} from '@cb-pkg/form-bridge/adaptors/mui';
    
    function Foo() {
      return (
        <Form
          action="/api/login"
          onSubmit={(data, {method, action}) => Axios(action, { method, data })}
          apiErrorAdaptor={drfErrorsAdaptor}
          onSubmitSuccess={(res) => {
            localStorage.setItem('accessToken', res.data.accessToken);
            navigate('/');
          }}
        >
          <Controller
            as={TextField}
            defaultValue=""
            label="Email"
            name="email"
            pattern="email"
            propsAdaptor={TextFieldPropsAdaptor}
            required
          />

          <Controller
            as={TextField}
            defaultValue=""
            label="Password"
            name="email"
            propsAdaptor={TextFieldPropsAdaptor}
            required
          />
      
          <Button type="submit">Login</Button>
        </Form>
      );
    
    ```

As you can see that some props here will become very redundant when multiple instances of form will be used.
This redundancy can be removed by moving redundant props to global `FormConfig`. See it in next section.
