#include <iostream>

/* FUNCTIONS */
void out(auto ARGUMENT_1) {
  std::cout << ARGUMENT_1; 
}

auto in(auto ARGUMENT_1) {
  std::cout << ARGUMENT_1;
  std::string userInput;
  getline(std::cin, userInput);
  return userInput;
}
/* END FUNCTIONS */

int main() {
auto userInput = in ("Your name: ");
out (userInput);
auto userInput2 = in ("Your age: ");
out (userInput2);

  return 0;
}