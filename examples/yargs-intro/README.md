[examples][1] / yargs-intro

# Black Flag Example: Yargs Intro

This file is copied from [Yargs's own examples document][2].

Each command exists under the `commands/` directory.

The [entry point][3] is `cli.js`:

```javascript
#!/usr/bin/env node

const bf = require('@black-flag/core');
const path = require('node:path');
module.exports = bf.runProgram(path.join(__dirname, 'commands'), {
  /* We can use configureExecutionPrologue to disable default .strict()-ness */
});
```

The [root command][3] is `index.js`:

```javascript
exports.name = 'intro';
```

## With Yargs, the Options Be Just a Hash

`commands/plunder.js`:

```javascript
exports.handler = function (argv) {
  if (argv.ships > 3 && argv.distance < 53.5) {
    console.log('Plunder more riffiwobbles!');
  } else {
    console.log('Retreat from the xupptumblers!');
  }
};
```

---

```text
$ ./cli.js plunder --ships=4 --distance=22
Plunder more riffiwobbles!

$ ./cli.js plunder --ships 12 --distance 98.7
Retreat from the xupptumblers!
```

## But Don't Walk the Plank Just yet! There Be More!

`commands/short.js`:

```javascript
exports.handler = function (argv) {
  console.log('(%d,%d)', argv.x, argv.y);
};
```

---

```text
$ ./cli.js short -x 10 -y 21
(10,21)
```

## And Booleans, Both Long, Short, and Even Grouped

`commands/bool.js`:

```javascript
exports.handler = function (argv) {
  if (argv.s) {
    process.stdout.write(argv.fr ? 'Le perroquet dit: ' : 'The parrot says: ');
  }

  console.log((argv.fr ? 'couac' : 'squawk') + (argv.p ? '!' : ''));
};
```

---

```text
$ ./cli.js bool -s
The parrot says: squawk

$ ./cli.js bool -sp
The parrot says: squawk!

$ ./cli.js bool -sp --fr
Le perroquet dit: couac!
```

## And Non-Hyphenated Options Too! Just Use `argv._`

`commands/nonopt.js`:

```javascript
exports.handler = function (argv) {
  console.log('(%d,%d)', argv.x, argv.y);
  console.log(argv._);
};
```

---

```text
$ ./cli.js nonopt -x 6.82 -y 3.35 rum
(6.82,3.35)
[ 'rum' ]

$ ./cli.js nonopt "me hearties" -x 0.54 yo -y 1.12 ho
(0.54,1.12)
[ 'me hearties', 'yo', 'ho' ]
```

## Yargs Even Counts Your Booleans

`commands/count.js`:

```javascript
exports.builder = { verbose: { alias: 'v', count: true } };

exports.handler = function (argv) {
  VERBOSE_LEVEL = argv.verbose;

  function WARN() {
    VERBOSE_LEVEL >= 0 && console.log.apply(console, arguments);
  }

  function INFO() {
    VERBOSE_LEVEL >= 1 && console.log.apply(console, arguments);
  }

  function DEBUG() {
    VERBOSE_LEVEL >= 2 && console.log.apply(console, arguments);
  }

  WARN('Showing only important stuff');
  INFO('Showing semi-important stuff too');
  DEBUG('Extra chatty mode');
};
```

---

```text
$ node cli.js count
Showing only important stuff

$ node cli.js count -v
Showing only important stuff
Showing semi-important stuff too

$ node cli.js count -vv
Showing only important stuff
Showing semi-important stuff too
Extra chatty mode

$ node cli.js count -v --verbose
Showing only important stuff
Showing semi-important stuff too
Extra chatty mode
```

## Tell Users How to Use Your Options and Make Demands

`commands/area.js`:

```javascript
exports.usage = '$0 -w [num] -h [num]';
exports.builder = { w: { demandOption: true }, h: { demandOption: true } };
exports.handler = (argv) => console.log('The area is:', argv.w * argv.h);
```

---

```text
$ ./cli.js area -w 55 -h 11
The area is: 605

$ ./cli.js area -w 4.91 -w 2.51
Usage: intro area -w [num] -h [num]

Options:
  -w  [required]
  -h  [required]

Missing required arguments: h
```

## After Your Demands Have Been Met, Demand More

`commands/demand_count.js`:

```javascript
exports.builder = (bf) => bf.demandCommand(2);
exports.handler = (argv) => console.dir(argv);
```

---

```text
$ ./cli.js demand_count a

Not enough non-option arguments: got 1, need at least 2

$ ./cli.js demand_count a b
{ _: [ 'a', 'b' ], '$0': 'demand_count.js' }

$ ./cli.js demand_count a b c
{ _: [ 'a', 'b', 'c' ], '$0': 'demand_count.js' }
```

## Even More Shiver Me Timbers

`commands/default_singles.js`:

```javascript
exports.builder = { x: { default: 10 }, y: { default: 10 } };
exports.handler = (argv) => console.log(argv.x + argv.y);
```

---

```text
$ ./cli.js default_singles -x 5
15
```

`commands/default_hash.js`:

```javascript
exports.builder = { x: { default: 10 }, y: { default: 10 } };
exports.handler = (argv) => console.log(argv.x + argv.y);
```

---

```text
$ ./cli.js default_singles -y 7
17
```

## And If You Really Want to Get All Descriptive

`commands/boolean_single.js`:

```javascript
exports.builder = { r: { boolean: true }, v: { boolean: true } };

exports.handler = function (argv) {
  console.dir([argv.r, argv.v]);
  console.dir(argv._);
};
```

---

```text
$ ./cli.js boolean_single -r false -v "me hearties" yo ho
[ false, true ]
[ 'me hearties', 'yo', 'ho' ]
```

`commands/boolean_double.js`:

```javascript
exports.builder = {
  x: { boolean: true },
  y: { boolean: true },
  z: { boolean: true }
};

exports.handler = function (argv) {
  console.dir([argv.x, argv.y, argv.z]);
  console.dir(argv._);
};
```

---

```text
$ ./cli.js boolean_double -x -z one two three
[ true, undefined, true ]
[ 'one', 'two', 'three' ]
```

## Yargs Is Here to Help You

You can describe parameters for help messages and set aliases. Yargs figures out
how to format a handy help string automatically.

`commands/line_count/index.js`:

```javascript
exports.usage = 'Usage: $0 <command> [options]';

exports.builder = (bf) => {
  bf.example('$0 count -f foo.js', 'Count the lines in the given file').epilog(
    'Copyright 2019'
  );
};
```

`commands/line_count/count.js`:

```javascript
const fs = require('node:fs');

exports.builder = {
  f: {
    alias: 'file',
    nargs: 1,
    describe: 'Load a file',
    demandOption: true
  }
};

exports.description = 'Count the lines in a file';

exports.handler = function (argv) {
  var lines = 0;
  const s = fs.createReadStream(argv.file);

  s.on('data', function (buf) {
    lines += buf.toString().match(/\n/g).length;
  });

  s.on('end', function () {
    console.log(lines);
  });
};
```

---

```text
$ ./cli.js line_count --help
Usage: intro line_count <command> [options]

Commands:
  intro line_count count  Count the lines in a file

Options:
  --version   Show version number          [boolean]
  --help      Show help                    [boolean]

Examples:
  intro line_count count -f foo.js  Count the lines in the given file

Copyright 2019
```

```text
$ ./cli.js line_count count --help
Usage: intro line_count count

Count the lines in a file

Options:
  -f, --file  Load a file                 [required]
  -h, --help  Show help                    [boolean]
```

```text
$ ./cli.js line_count count
Usage: intro line_count count

Options:
  -f, --file  Load a file                 [required]
  -h, --help  Show help                    [boolean]

Missing required argument: f
```

```text
$ ./cli.js line_count count --file some-file.js
25

$ ./cli.js line_count count -f some-file.js
25
```

[1]: ../README.md
[2]: https://github.com/yargs/yargs/blob/main/docs/examples.md
[3]: ../../docs/getting-started.md#building-and-running-your-cli
