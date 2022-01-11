#include <iostream>

/* FUNCTIONS */
void out(auto ARGUMENT_1) {
  std::cout << ARGUMENT_1 << std::endl; 
}

auto add (auto ARGUMENT_1, auto ARGUMENT_2) {
  return ARGUMENT_1 + ARGUMENT_2;
}

auto sub (auto ARGUMENT_1, auto ARGUMENT_2) {
  return ARGUMENT_1 - ARGUMENT_2;
}
/* END FUNCTIONS */

int main() {
auto result = add (1, 2);
sub (2, 1);
out (result);

  return 0;
}
