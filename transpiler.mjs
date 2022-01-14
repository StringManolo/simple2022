import tokenizer from "./tokenizer.mjs";
import parser from "./parser.mjs";

const transpiler = {};
transpiler.cpp = (code) => {
  const addLibraries = (code) => {
    if (/void\ out/g.test(code)) {
      code = `#include <iostream>

${code}`;
    }
    return code;
  }

  let internalBodyFunctions = [];
  const internalBodyFunction = functionName => {
    for (let i in internalBodyFunctions) {
      if (internalBodyFunctions[i] === functionName) {
        return true;
      }
    }
    return false;
  }
  const replaceTokens = (tokens) => {
    for (let i = 0; i < tokens.length; ++i) {
      switch(tokens[i]) {
        case "INTERNAL_RETURN":
	  tokens[i] = "return";
	  if (i > 0) tokens[i] = ";\n" + tokens[i];
	break;

	case "PLUS":
	  tokens[i] = "+";
	break;

	case "MINUS":
	  tokens[i] = "-";
	break;

	case "ASTERISK":
	  tokens[i] = "*";
	break;

	case "SLASH":
	  tokens[i] = "/";
	break;

	case "GREATER_THAN":
	  tokens[i] = ">";
	break;

	case "LESS_THAN":
	  tokens[i] = "<";
	break;

	case "LINEBREAK":
          tokens[i] = ";\n";
	break;

	default:
	  if (tokens[i].substr(0, 7) === "NUMBER_") {
            // decl arg is int ?
	    tokens[i] = tokens[i].substring(7, tokens[i].length);
	  }

	  if (tokens[i].substr(0, 7) === "STRING_") {
            tokens[i] = `"${tokens[i].substring(7, tokens[i].length)}"`;
	  }
      }

    }

    for (let i = 0; i < tokens.length; ++i) {
      /* Function body parsing */ // The code is thrash, thanks for notice.
      if (tokens[i] === "out") { // TODO: Allow more internal functions inside body
	tokens[i] = "out (";
	tokens[i+1] += ")"
	internalBodyFunctions.push("out");
      }
    }

    return tokens.join(" ");
  }

  const tokens = tokenizer(code);
  const parsed = parser(tokens);

  let res = "/* FUNCTIONS */";

  for (let i in parsed.functions) {
    let args = "(";
    for (let j = 0; j < parsed.functions[i].numberOfArgs; ++j) {
      // track function calls to guess type
      args += "auto ARGUMENT_" + (j + 1) + ", ";
    }
    if (parsed.functions[i].numberOfArgs) {
      args = args.substring(0, args.length - 2); // remove last comma
    } else {
      
    }
    args += ")";

    // TODO: Transpile function body ?? Need design first
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

      if (parsed.mainFunction[i]?.value) {
        res += parsed.mainFunction[i].value + ";\n";
      }
    } else if (parsed.mainFunction[i].type === "FUNCTION_CALL") {
      if (parsed.mainFunction[i].id === "out" || internalBodyFunction("out")) { // internal function
	if (!/void\ out/g.test(res)) {
          res = res.replace("/* FUNCTIONS */", `/* FUNCTIONS */
void out(auto ARGUMENT_1) {
  std::cout << ARGUMENT_1; 
}
`);
	}
      } else if (parsed.mainFunction[i].id === "in") { // internal function
	if (parsed.mainFunction[i-1]?.cast === "number") {
	  parsed.mainFunction[i].id = "in_number";
          if (!/auto\ in_number/g.test(res)) {
            res = res.replace("/* FUNCTIONS */", `/* FUNCTIONS */
auto in_number(auto ARGUMENT_1) {
  std::cout << ARGUMENT_1;
  std::string userInput;
  getline(std::cin, userInput);
  return std::stoi(userInput);
}
`);
	  }
	} else {

          if (!/auto\ in/g.test(res)) {
            res = res.replace("/* FUNCTIONS */", `/* FUNCTIONS */
auto in(auto ARGUMENT_1) {
  std::cout << ARGUMENT_1;
  std::string userInput;
  getline(std::cin, userInput);
  return userInput;
}
`);
	  }
	}
      } else if (parsed.mainFunction[i].id === "if") { // internal function
        res += `if (${replaceTokens(parsed.mainFunction[i].args)}) {\n`;
      } else if (parsed.mainFunction[i].id === "fi") { // internal function
        res += "}\n"
      } else if (parsed.mainFunction[i].id === "else") { // internal function
        res += "} else {\n"
      } else if (parsed.mainFunction[i].id === "for") { // internal function
	parsed.mainFunction[i].args = replaceTokens(parsed.mainFunction[i].args).split(" ");
	const aux = parsed.mainFunction[i].args.splice(0, 1); // name of var
	parsed.mainFunction[i].args[0] = `int ${aux} = ${parsed.mainFunction[i].args[0]}; `
	parsed.mainFunction[i].args[1] = `${aux} != ${parsed.mainFunction[i].args[1]}; `;
	parsed.mainFunction[i].args[2] = `${aux} = ${aux} + ${parsed.mainFunction[i].args[2]}`;
        res += `for (${replaceTokens(parsed.mainFunction[i].args)}) {\n`;
      } else if (parsed.mainFunction[i].id === "rof") { // internal function
        res += "}\n";
      }


      if (parsed.mainFunction[i].id !== "if" && parsed.mainFunction[i].id !== "fi" &&
          parsed.mainFunction[i].id !== "else" && 
	  parsed.mainFunction[i].id !== "for" && parsed.mainFunction[i].id !== "rof") { 
        if (parsed.mainFunction[i]?.args?.length && parsed.mainFunction[i].args[0].substring(0, 7) === "STRING_") {
          parsed.mainFunction[i].args[0] = "\"" + parsed.mainFunction[i].args[0].substring(7, parsed.mainFunction[i].args[0].length).replace(/ /g, "INTERNAL_SPACE") + "\"";
        }

        res += `${parsed.mainFunction[i].id} (${replaceTokens(parsed.mainFunction[i].args).replace(/ /g, ", ").replace(/INTERNAL_SPACE/g, " ")});\n`;
      }
    }
  }

  res += "\n  return 0;\n}";


  res = addLibraries(res);

  return res;
}

export default transpiler;

