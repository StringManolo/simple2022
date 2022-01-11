import transpiler from "./transpiler.mjs";
import tokenizer from "./tokenizer.mjs";
import parser from "./parser.mjs";
import fs from "fs";
import * as exec from "child_process";

const run = (args) => {
  let res = exec.execSync(args).toString()
  return res;
};

const loadFile = (filename) => {
  let retValue;
  try {
    retValue = fs.readFileSync(filename, { encoding: "utf-8" })
  } catch(e) {
    retValue = null;
  }
  return retValue;
};

const input = () => {
  let rtnval = "";
  let buffer = Buffer.alloc ? Buffer.alloc(1) : new Buffer(1);
  for(;;) {
    fs.readSync(0, buffer, 0, 1, null);
    if(buffer[0] === 10) {
      break;
    } else if(buffer[0] !== 13) {
      rtnval += new String(buffer);
    }
  }
  return rtnval;
}

const open = (filename, mode) => {
  const fd = {};
  try {
    fd.internalFd = fs.openSync(filename, mode)
    fd.read = (buffer, position, len) => fs.readSync(fd.internalFd, buffer, position, len, null);
    fd.puts = (str) => fs.writeSync(fd.internalFd, str);
    fd.close = () => fs.closeSync(fd.internalFd);
    return fd;
  } catch(err) {
    console.log("open " + err);
    return fd;
  }
}

const createFile = (filename, data) => {
  try {
    if (!fs.existsSync(filename)) {
      const fd = open(filename, "w");
      fd.puts(data);
      fd.close();
    }
  } catch(err) {
    console.log("createFile " + err);
  }
}


const createFileOverwrite = (filename, data) => {
  const fd = open(filename, "w");
  fd.puts(data);
  fd.close();
}


const helpMessage = () => {
  console.log(`usage: node compile.mjs -f examples/helloworld.imp -l c++

-f, --file          The file holding the simple code
-l, --language      The language the code is going to be compiled to

-b, --build         Build the project (compile. needs output flag)
-r, --run           Run the project (needs compile flag)
-o, --output        Name of the file to output (if omited, output is shown in terminal)

-t, --tokens        Print the tokenizer output instead
-p, --parser        Print the parser output instead
`);
}

const cli = {};
for (let i = 0; i < process.argv.length; ++i) {
  switch(process.argv[i]) {
    case "-b":
    case "--build":
      cli.build = true; 
    break;
      
    case "-f":
    case "--file":
      cli.code = loadFile(process.argv[+i+1]);
    break;

    case "-l":
    case "--language":
      cli.language = process.argv[+i+1];
    break;

    case "-h":
    case "--help":
      helpMessage();
      process.exit(0);
    break;

    case "-o":
    case "--output":
      cli.output = process.argv[+i+1];
    break;

    case "-p":
    case "--parser":
      cli.parser = true;
    break;

    case "-t":
    case "--token":
    case "--tokens":
    case "--tokenizer":
      cli.tokens = true;
    break;


    case "-r":
    case "--run":
      cli.run = true;
    break;
  }
}

if (cli?.tokens) {
  if (!cli?.code) {
    cli.code = input();
  }
  console.log(JSON.stringify(tokenizer(cli.code), null, 2));
  process.exit(0);
}

if (cli?.parser) {
  if (!cli?.code) {
    cli.code = input();
  }
  console.log(JSON.stringify(parser(tokenizer(cli.code)), null, 2));
  process.exit(0);
}

if (!cli?.language) {
  helpMessage();
  process.exit(0);
}

if (!cli?.code) {
  cli.code = input();
}

if (cli?.language?.toLowerCase() === "cpp" || cli?.language?.toLowerCase() === "c++") {
  const transpiled = transpiler.cpp(cli.code);
  if (cli?.output) {
    createFileOverwrite(cli.output, transpiled);
    if (cli.build) {
      run(`cp ${cli.output} ${cli.output}.internal.cpp && g++ -o ${cli.output} ${cli.output}.internal.cpp --std=c++20 && rm ${cli.output}.internal.cpp`);
      if (cli.run) {
        console.log(run(`chmod 0775 ${cli.output} && ./${cli.output}`));
      }
    }
  } else {
    console.log(transpiled);
  }
}


