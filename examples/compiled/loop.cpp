#include <iostream>

/* FUNCTIONS */
void out(auto ARGUMENT_1) {
  std::cout << ARGUMENT_1; 
}
/* END FUNCTIONS */

int main() {
for (int i = 1;  i != 10;  i = i + 1) {
for (int j = 1;  j != 3;  j = j + 1) {
out ("\n");
out (j);
out ("\n");
}
}

  return 0;
}
