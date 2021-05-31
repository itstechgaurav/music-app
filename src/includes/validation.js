import { Field, Form, defineRule } from 'vee-validate';
import {
  required,
  email,
  numeric,
  alpha_spaces as alphaSpaces,
  min,
  max,
  between,
  one_of as included,
} from '@vee-validate/rules';

export default {
  install(app) {
    app.use('vee-form', Form);
    app.use('vee-field', Field);

    defineRule('required', required);
    defineRule('email', email);
    defineRule('alpha_spaces', alphaSpaces);
    defineRule('numeric', numeric);
    defineRule('between', between);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('included', included);
  },
};
