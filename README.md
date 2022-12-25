# React Forms
This package is an adopter between react hook form and MUI. The aim is to provide concise and
readable syntax while not obscuring any api from react-hook-form or MUI. 

NOTE: This package is in very early development stages.

## Example

```tsx
import {Form, Controller} from '@cb-pkg/form-bridge';
import {TextField} from '@mui/material';

function Foo() {
  return (
    <Form onSubmit={(data) => console.log(data)}>
      <Controller
        as={TextField}
        defaultValue=""
        label="Test Input"
        name="input1"
        required
      />
      
      <button type="submit">Submit</button>
    </Form>
  );
}
```

## Progress

- [x] Form
- [x] FormField
- [x] Controller
- [x] FieldArray
- [ ] `as` prop
- [ ] WatchField
- [ ] FilePicker
- [ ] Extract API Errors Adopter
- [ ] Extract Fields Adopter
