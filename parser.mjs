// import tokenizer from "./tokenizer.mjs";

const parser = (tokens) => {
  const parsed = {};                                                  // Object to save parsed data
  parsed.functions = [];                                              // The function definitions found in codei
  parsed.mainFunction = [];
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
        parsed.mainFunction.push({
          type: "ASSIGNMENT",
	  id: tokens[i].substring(3, tokens[i].length)
	})
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

add {
  $1 + $2
  5 + 2
}

sub {
  $1 - $2
}

result = add 1 2
sub 2 1

out result
`;

const tokens = tokenizer(code);
const parsed = parser(tokens);


console.log(tokens);
console.log(parsed);
*/
