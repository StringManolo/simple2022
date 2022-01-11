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

auto addition (auto ARGUMENT_1, auto ARGUMENT_2) {
  return ARGUMENT_1 + ARGUMENT_2;
}

auto substraction (auto ARGUMENT_1, auto ARGUMENT_2) {
  return ARGUMENT_1 - ARGUMENT_2;
}

auto multiplication (auto ARGUMENT_1, auto ARGUMENT_2) {
  return ARGUMENT_1 * ARGUMENT_2;
}

auto division (auto ARGUMENT_1, auto ARGUMENT_2) {
  return ARGUMENT_1 / ARGUMENT_2;
}
/* END FUNCTIONS */

int main() {
auto num1 = in ("Your first number");
auto num2 = in ("Your second number");
auto res = addition (num1, num2);
out (num1);
out (" +         ");
out (num2);
out (" = ");
out (res);
 res = substraction (num1, num2);
out (res);
 res = multiplication (num1, num2);
out (res);
 res = division (num1, num2);
out (res);

  return 0;
}