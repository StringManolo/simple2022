// import tokenizer from "./tokenizer.mjs";

const parser = (tokens) => {
  const parsed = {};                                                  // Object to save parsed data
  parsed.functions = [];                                              // The function definitions found in codei
  parsed.mainFunction = [];
  parsed.strings = [];
  for (let i = 0; i < tokens.length; ++i) {                           // for each token found
    if (tokens[i].substring(0, 3) === "ID_") {                        // if token start by ID_
      if (tokens[i + 1] === "LBRACE") {                               // if next token is {
	const id = tokens[i].substring(3, tokens[i].length);          // save NAME from ID_NAME
        let code = [];                                                // function code
	i += 2;                                                       // i is ID_, i+1 is LBRACE, i+2 is the next token to parse

	let firstLinebreak = true;                                    // auxiliar to remove useless linebreak
	while (tokens[i] !== "RBRACE") {                              // loop while token } not found (end of body function)
	  if (firstLinebreak === true && tokens[i] === "LINEBREAK") { // remove the useless linebreak
	    firstLinebreak = false;                                   // do not remove next linebreaks (needed to understand if there is more expressions inside function body)
            ++i;
	  }
          code.push(tokens[i++]);                                     // add token as function body element
	}
        if (code[code.length - 1] === "LINEBREAK") {                  // if last token (before } token) is a linebreak, remove it.
          code.pop();
	}

	if (/LINEBREAK/.test(code.join(" "))) {
          for (let j = code.length; j > 0; --j) {
            if (code[j] === "LINEBREAK") {
              code[j] = "INTERNAL_RETURN" 
	    }
	  }
	} else {
          code.unshift("INTERNAL_RETURN");
	}

        let numberOfArgs = 0;
	for (let j in code) {
          if (/ARGUMENT/.test(code[j])) {
            ++numberOfArgs; 
	  }
	}

	parsed.functions.push({
          id: id,
          body: code, // parser(code)
	  numberOfArgs: numberOfArgs
	});
      } else if (tokens[i + 1] === "ASSIGN") {                        // if next token is =
	let cast = false;
        if (tokens[i + 2] === "CAST_NUMBER") {
	  cast = "number";
          //++i;
	}

	if (tokens[i + 2] === "STRING_START") {
          for (let k = i + 2; k < tokens.length; ++k) {
            let str = "";
            while (tokens[++k] !== "STRING_END") {
              str += tokens[k].substring(15, tokens[k].length) + " ";
            }
            str = str.substring(0, str.length);
            parsed.mainFunction.push({
              type: "ASSIGNMENT",
	      id: tokens[i].substring(3, tokens[i].length),
	      value: "\"" + str + "\""
	    });
	    break;
          }
	} else if (tokens[i + 2].substring(0, 7) === "NUMBER_") {
          parsed.mainFunction.push({
            type: "ASSIGNMENT",
	    id: tokens[i].substring(3, tokens[i].length),
	    value: tokens[i + 2].substring(7, tokens[i + 2].length)
	  });

	} else {
	  const aux = {
            type: "ASSIGNMENT",
	    id: tokens[i].substring(3, tokens[i].length)
	  }
          if (cast !== false) {
            aux.cast = cast;
	  }
          parsed.mainFunction.push(aux);
	}
      } else {                                                        // if next token is an argument (in a function call)
        const functionCall = {};
	const id = tokens[i].substring(3, tokens[i].length);
        let code = [];
	i++;

        while (tokens[i] !== "LINEBREAK" || i === tokens.length) {    // take args until linebreak or end of file
          code.push(tokens[i++]);
	}

	if (code[code.length - 1] === "LINEBREAK") {                  // remove useless linebreaks
	  code.pop();
	}

	for (let i in code) {
          if (code[i].substring(0, 3) === "ID_") {
	    code[i] = code[i].substring(3, code[i].length);
	  }
	}

        for (let i = 0; i < code.length; ++i) {
	  let str = "";
	  if (code[i] === "STRING_START") {
	    while (code[++i] !== "STRING_END") {
	      str += code[i].substring(15, code[i].length) + " ";
	    }
	    str = str.substring(0, str.length);
	    code = code.splice(i + 1, code.length);
	    code.push(`STRING_${str}`);
	  }
          // parsed.strings.push(str);

	}

	functionCall.type = "FUNCTION_CALL";
	functionCall.id = id;
	functionCall.args = code;
	parsed.mainFunction.push(functionCall);                       // add the function call to the main function
      }

    } 
  }
  return parsed;
}

export default parser;

/*
const code = `

out "a"
out "\\n"
out "b"

`;

const tokens = tokenizer(code);
const parsed = parser(tokens);


console.log(tokens);
console.log(parsed);
*/

