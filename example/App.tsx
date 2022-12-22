import {
  Checkbox,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Rating, Slider,
  Switch,
  TextField, ToggleButton, ToggleButtonGroup,
} from '@mui/material';

import { Form, Controller, FormConfig } from '../src';


export default function App() {
  return (
    <div className='App'>
      <FormConfig
        config={{
          components: {
            Controller: {
              propsAdapters: [
                {
                  component: TextField,
                  adaptor: ({ field: { value, onChange }, fieldState: { error } }) => ({
                    value: value ?? '',
                    onChange,
                    error: !!error?.message,
                    helperText: error?.message,
                  }),
                }, {
                  component: Rating,
                  adaptor: ({ field: { value, onChange } }) => ({
                    value: +value ?? 0,
                    onChange,
                  }),
                },
              ],
            },
          },
        }}
      >
        <Form onSubmit={(data: Record<string, any>) => console.log(data)}>
          <div>
            <Controller
              as={TextField}
              name='textField'
              label='Test Field'
              required
            />
          </div>

          <div>
            <Controller
              as={TextField}
              name='selectField'
              label='Test Field'
              select
              required
            >
              <MenuItem value='op1'>Option 1</MenuItem>
              <MenuItem value='op2'>Option 2</MenuItem>
              <MenuItem value='op3'>Option 3</MenuItem>
            </Controller>
          </div>

          <div>
            <Controller
              as={FormControlLabel}
              control={<Switch /> as any}
              defaultValue=''
              label='Label'
              name='switch'
            />
          </div>

          <div>
            <Controller
              as={FormControlLabel}
              control={<Checkbox /> as any}
              defaultValue=''
              label='Label'
              name='checkbox'
            />
          </div>

          <div>
            <Controller
              as={RadioGroup}
              defaultValue={''}
              name='radio'
            >
              <FormControlLabel value='female' control={<Radio />} label='Female' />
              <FormControlLabel value='male' control={<Radio />} label='Male' />
              <FormControlLabel value='other' control={<Radio />} label='Other' />
            </Controller>
          </div>

          <div>
            <Controller
              as={Rating}
              name='rating'
              defaultValue={0}
            />
          </div>

          <div>
            <Controller
              as={Slider}
              name='slider'
              defaultValue={0}
              valueLabelDisplay='auto'
            />
          </div>

          <div>
            <Controller
              as={ToggleButtonGroup}
              name='toggleButton'
              exclusive
              color='primary'
            >
              <ToggleButton value='web'>Web</ToggleButton>
              <ToggleButton value='android'>Android</ToggleButton>
              <ToggleButton value='ios'>iOS</ToggleButton>
            </Controller>
          </div>

          {/*<div>*/}
          {/*  <Controller*/}
          {/*    as={Autocomplete}*/}
          {/*    renderInput={(params: any) => <TextField {...params} label="Movie" />}*/}
          {/*    options={[*/}
          {/*      { label: 'The Shawshank Redemption', year: 1994 },*/}
          {/*      { label: 'The Godfather', year: 1972 },*/}
          {/*      { label: 'The Godfather: Part II', year: 1974 },*/}
          {/*      { label: 'The Dark Knight', year: 2008 },*/}
          {/*      { label: '12 Angry Men', year: 1957 },*/}
          {/*      { label: "Schindler's List", year: 1993 },*/}
          {/*    ]}*/}
          {/*    name='autocomplete'*/}
          {/*    propsAdapter={({ field: { value, onChange }, fieldState: { error } }) => ({*/}
          {/*      value: value ?? null,*/}
          {/*      onChange,*/}
          {/*      error: !!error?.message,*/}
          {/*      helperText: error?.message,*/}
          {/*    })}*/}
          {/*  />*/}
          {/*</div>*/}

          <button type='submit'>Submit</button>
        </Form>
      </FormConfig>
    </div>
  );
}
