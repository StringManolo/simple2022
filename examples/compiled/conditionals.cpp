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

auto sub (auto ARGUMENT_1, auto ARGUMENT_2) {
  return ARGUMENT_1 - ARGUMENT_2;
}
/* END FUNCTIONS */

int main() {
auto age = in_number ("Your age -> ");
if (age < 18) {
out ("You are underage, access denied.");
auto diff = sub (18, age);
out ("\nTry again in ");
out (diff);
out (" year/s");
} else {
out ("Welcome!");
}

  return 0;
}
