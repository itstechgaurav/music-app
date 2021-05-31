function plugin(instance) {
  instance.extend({
    rules: {
      foobar: ({ value }) => ['foo', 'bar'].includes(value),
    },
  });
}

export default plugin;
