export default {
  command: '$0 dummy-positional1',
  builder: (blackFlag) => {
    blackFlag.positional('dummy-positional1', { desc: 'Dummy description1' });
  },
  handler: (argv) => {
    argv.handled_by = filepath;
  }
};
