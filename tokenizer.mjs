const tokenizer = code => {
  const fixSpacesInStrings = code => {
    code = code.split("");
    let inString = false;
    for (let i = 0; i < code.length; ++i) {
      if (code[i] !== "\"" && inString === "doublequote") {
        if (code[i] === " ") {
          code[i] = "%%INTERNAL_STRING_SPACE%%";
	}
      }
 
      if (code[i] === "\"") {
        if (inString === "doublequote" && code[i-1] !== "\\") {
          inString = false;
	  break;
	}
        inString = "doublequote";
      }
    }

    for (let i = 0; i < code.length; ++i) {
      if (code[i] !== "'" && inString === "singlequote") {
        if (code[i] === " ") {
          code[i] = "%%INTERNAL_STRING_SPACE%%";
        }
      }

      if (code[i] === "'") {
        if (inString === "singlequote" && code[i-1] !== "\\") {
          inString = false;
          break;
        }
        inString = "singlequote";
      }
    }


    return code.join("").trim();
  }

  let tokens = [];
  code = code.trim();
  const lines = code.split("\n");
  for (let i in lines) {
    // TODO: avoid split using spaces in strings
    const words = fixSpacesInStrings(lines[i]).split(" ");
    for (let j = 0; j < words.length; ++j) {
      // TODO: Parse commentaries (lines starting by # or multiline ? 
      switch(words[j].trim()) {
        case "{":
          tokens.push("LBRACE");
        break;

        case "}":
          tokens.push("RBRACE");
        break;

        case "+":
	  tokens.push("PLUS");
        break;

        case "-":
	  tokens.push("MINUS");
        break;

        case "*":
          tokens.push("ASTERISK");
        break;

        case "/":
	  tokens.push("SLASH");
        break;

	case "=":
	  tokens.push("ASSIGN");
	break;

        case ">":
	  tokens.push("GREATER_THAN");
	break;

	case "<":
	  tokens.push("LESS_THAN");
	break;

	case "":
	  "pass";
	break;

	default: 
          let token = words[j].trim();

	  // Start by $ and only contains numbers
	  if (token[0] === "$" && /^[0-9]+$/.test(token.substring(1, token.length))) {
            tokens.push("ARGUMENT_" + token.substring(1, token.length));
	  // Start by lowercase char and conatains only chars and numbers
	  } else if (/[a-z]/.test(token[0]) && /^[a-zA-Z0-9]+$/.test(token)) {
            tokens.push("ID_" + token);
	  } else if (/^[0-9]+$/.test(token)) {
            tokens.push("NUMBER_" + token);
          } else if (token.substring(0, 1) === "\"") { // Parse " strings
            tokens.push("STRING_START");
	    if (token[token.length-1] === "\"") {
	      if (! ( j+1 !== words.length && words[j] !== "\\" && words[++j]?.trim() !== "\"") ) {
                token = token.substring(0, token.length - 1);
	      }
	    }
	    tokens.push(`STRING_CONTENT_${token.substring(1, token.length)}`);
	    while (j+1 !== words.length && words[j] !== "\\" && words[++j]?.trim() !== "\"") {
	      if (words[j][words[j]?.length-1] === "\"") {
                words[j] = words[j].substring(0, words[j].length - 1);
	      }
	      tokens.push(`STRING_CONTENT_${words[j]}`);
	    }
	    tokens.push("STRING_END");

          } else if (token.substring(0, 1) === "'") { // Parse ' strings
            tokens.push("STRING_START");
	    if (token[token.length-1] === "'") {
	      if (! (j+1 !== words.length && words[j] !== "\\" && words[++j].trim() !== "'") ) {
		token = token.substring(0, token.length - 1);
	      }
	    }
            tokens.push(`STRING_CONTENT_${token.substring(1, token.length)}`);
            while (j+1 !== words.length && words[j] !== "\\" && words[++j].trim() !== "'") {
              if (words[j][words[j].length-1] === "'") {
                words[j] = words[j].substring(0, words[j].length - 1);
              }
              tokens.push(`STRING_CONTENT_${words[j]}`);
            }
            tokens.push("STRING_END");
	  } else if (token.substring(0, 1) === "+" && /[a-zA-Z]/.test(token.substring(1, 2))) {
            tokens.push("CAST_NUMBER");
	    tokens.push("ID_" + token.substring(1, token.length));
	  } else {
            tokens.push("UNKNOWN_" + token);
	  } 
      }
    }
    tokens.push("LINEBREAK");
  }

  return tokens;
}

export default tokenizer;

