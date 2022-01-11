#include <iostream>

/* FUNCTIONS */
void out(auto ARGUMENT_1) {
  std::cout << ARGUMENT_1 << std::endl; 
}

auto in(auto ARGUMENT_1) {
  std::cout << ARGUMENT_1;
  std::string userInput;
  getline(std::cin, userInput);
  return userInput;
}
/* END FUNCTIONS */

int main() {
auto userInput = in ("Your name:");
out (userInput);

  return 0;
}