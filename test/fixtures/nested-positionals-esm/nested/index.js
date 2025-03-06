export default {
  command: '$0 dummy-positional2',
  builder: (blackFlag) => {
    blackFlag.positional('dummy-positional2', { desc: 'Dummy description2' });
  },
  handler: (argv) => {
    argv.handled_by = filepath;
  }
};
