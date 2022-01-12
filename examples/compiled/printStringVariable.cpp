#include <iostream>

/* FUNCTIONS */
void out(auto ARGUMENT_1) {
  std::cout << ARGUMENT_1; 
}
/* END FUNCTIONS */

int main() {
auto msg = "Hello world!";
out (msg);

  return 0;
}