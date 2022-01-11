import tokenizer from "./tokenizer.mjs"
import parser from "./parser.mjs"

const compiler = {};
compiler.cpp = (code) => {
  const addLibraries = (code) => {
    if (/void\ out/g.test(code)) {
      code = `#include <iostream>

${code}`;
    }
    return code;
  }

  const replaceTokens = (tokens) => {
    for (let i in tokens) {
      switch(tokens[i]) {
        case "INTERNAL_RETURN":
	  tokens[i] = "return";
	break;

	case "PLUS":
	  tokens[i] = "+";
	break;

	case "MINUS":
	  tokens[i] = "-";
	break;

	default:
	  if (tokens[i].substr(0, 7) === "NUMBER_") {
            // decl arg is int ?
	    tokens[i] = tokens[i].substring(7, tokens[i].length);
	  }
      }
    }
    return tokens.join(" ");
  }

  const tokens = tokenizer(code);
  const parsed = parser(tokens);

  let res = "/* FUNCTIONS */"
  for (let i in parsed.functions) {
    let args = "(";
    for (let j = 0; j < parsed.functions[i].numberOfArgs; ++j) {
      // track function calls to guess type
      args += "auto ARGUMENT_" + (j + 1) + ", ";
    }
    args = args.substring(0, args.length - 2); // remove last comma
    args += ")";


    res += `
auto ${parsed.functions[i].id} ${args} {
  ${replaceTokens(parsed.functions[i].body)};
}
`;
  }
  res += "/* END FUNCTIONS */\n";

  res += `
int main() {
`;

  let listOfVars = [];
  let useAuto = true;
  for (let i in parsed.mainFunction) {
    if (parsed.mainFunction[i].type === "ASSIGNMENT") {
      for (let j in listOfVars) {
        if (listOfVars[j] === parsed.mainFunction[i].id) {
          useAuto = false;
	}
      }
      listOfVars.push(parsed.mainFunction[i].id);
      res += `${useAuto ? "auto" : ""} ${parsed.mainFunction[i].id} = `;

      useAuto = true;
    } else if (parsed.mainFunction[i].type === "FUNCTION_CALL") {
      if (parsed.mainFunction[i].id === "out") { // internal function
       res = res.replace("/* FUNCTIONS */", `/* FUNCTIONS */
void out(auto ARGUMENT_1) {
  std::cout << ARGUMENT_1 << std::endl; 
}
`);
      }

      res += `${parsed.mainFunction[i].id} (${replaceTokens(parsed.mainFunction[i].args).replace(/ /g, ", ")});\n`;
    }
  }

  res += "\n  return 0;\n}";


  res = addLibraries(res);

  // console.log(parsed);
  console.log(res);
}

const code = `

add {
  $1 + $2
}

sub {
  $1 - $2
}

result = add 1 2
result = sub 2 1

out result
`;

compiler.cpp(code);

/*

{
  functions: [
    { id: 'add', body: [Array], numberOfArgs: 2 },
    { id: 'sub', body: [Array], numberOfArgs: 2 }
  ],

  mainFunction: [
    { type: 'FUNCTION_CALL', id: 'add', args: [Array] },
    { type: 'FUNCTION_CALL', id: 'sub', args: [Array] }
  ]
}
*/
