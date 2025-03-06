export default {
  command: '$0 dummy-positional3',
  builder: (blackFlag) => {
    blackFlag.positional('dummy-positional3', { desc: 'Dummy description3' });
  },
  handler: (argv) => {
    argv.handled_by = filepath;
  }
};
