import {
  Field, Form, defineRule, ErrorMessage, configure,
} from 'vee-validate';
import {
  required,
  email,
  numeric,
  alpha_spaces as alphaSpaces,
  min,
  max,
  between,
  one_of as included,
  confirmed,
} from '@vee-validate/rules';

export default {
  install(app) {
    app.component('vee-form', Form);
    app.component('vee-field', Field);
    app.component('ErrorMessage', ErrorMessage);

    defineRule('required', required);
    defineRule('email', email);
    defineRule('alpha_spaces', alphaSpaces);
    defineRule('numeric', numeric);
    defineRule('between', between);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('included', included);
    defineRule('confirmed', confirmed);

    configure({
      generateMessage(ctx) {
        const messages = {
          required: `${ctx.field}: is required`,
          email: `${ctx.field}: is not a valid email`,
          alphaSpaces: `${ctx.field}: can only contain alphabats or spaces`,
          numeric: `${ctx.field}: can only contain numeric values`,
          between: `${ctx.field}: should be between the range`,
          min: `${ctx.field}: should be greater then the ${ctx.rule.params[0]}`,
          max: `${ctx.field}: should be lesser then the ${ctx.rule.params[0]}`,
          included: `${ctx.field}: must be one of [${ctx.rule.params.join(', ')}]`,
          // confirmed: `${ctx.field}: didn't matched with the password above`,
        };

        return messages[ctx.rule.name] || `${ctx.field} is not valid`;
      },
      // validateOnModelUpdate: true,
    });
  },
};
