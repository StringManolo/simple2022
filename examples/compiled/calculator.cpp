#include <iostream>

/* FUNCTIONS */
void out(auto ARGUMENT_1) {
  std::cout << ARGUMENT_1; 
}

auto in_number(auto ARGUMENT_1) {
  std::cout << ARGUMENT_1;
  std::string userInput;
  getline(std::cin, userInput);
  return std::stoi(userInput);
}

auto addition (auto ARGUMENT_1, auto ARGUMENT_2) {
  return ARGUMENT_1 + ARGUMENT_2;
}
/* END FUNCTIONS */

int main() {
auto num1 = in_number ("Your first number -> ");
auto num2 = in_number ("Your second number -> ");
auto res = addition (num1, num2);
out (num1);
out (" + ");
out (num2);
out (" = "");
out (res);

  return 0;
}