const tokenizer = code => {
  let tokens = [];
  code = code.trim();
  const lines = code.split("\n");
  for (let i in lines) {
    const words = lines[i].split(" ");
    for (let j in words) {
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

	case "":
          "pass";
	break;

	default: 
          const token = words[j].trim();


	  // Start by $ and only contains numbers
	  if (token[0] === "$" && /^[0-9]+$/.test(token.substring(1, token.length))) {
            tokens.push("ARGUMENT_" + token.substring(1, token.length));
	  // Start by lowercase char and conatains only chars and numbers
	  } else if (/[a-z]/.test(token[0]) && /^[a-zA-Z0-9]+$/.test(token)) {
            tokens.push("ID_" + token);
	  } else if (/^[0-9]+$/.test(token)) {
            tokens.push("NUMBER_" + token);
	  } else {
            tokens.push("UNKNOWN_" + token);
	  } 
      }
    }
    tokens.push("LINEBREAK");
  }

  // tokens = tokens.join(" ");
  return tokens;
}

export default tokenizer;

/*
const code = `

add {
  $1 + $2
}

sub {
  $1 - $2
}

add 1 2
sub 2 1

`;

tokenizer(code);
*/


