export default {
  beforeMount(el, options) {
    // eslint-disable-next-line no-param-reassign
    el.innerHTML += `
    <i class="fas fa-${options.value} float-right text-green-400 text-xl"></i>`;
  },
};
