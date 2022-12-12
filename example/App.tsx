import { TextField } from '@mui/material';

import {Form} from '../dist';
import { Controller } from '../src';


export default function App() {
  return (
    <div className="App">
      <Form onSubmit={(data) => console.log(data)}>
        <Controller
          name="input1"
          defaultValue=""
          render={({field: {value, onChange, onBlur}, fieldState: {error, invalid}}) => (
            <TextField
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              label="Test"
              error={invalid}
              helperText={error?.message}
            />
          )}
          required
        />

        <button type="submit">Submit</button>
      </Form>
    </div>
  )
}
