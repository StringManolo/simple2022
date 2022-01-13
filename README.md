# SIMPLE 2022

Simple is a new programming language (under development)

This lenguage is desgined thinking in simplicity and productivity. Focused on fast development, should be usefull to create small and fast scripts. 

#### Usage
##### Compile and Run
- Transpile your SIMPLE code to C++
```
node compiler.js -f myCode.imp -o myCode.cpp -l c++
```
- Compile your C++ code
```
g++ myCode.cpp -o myProgram --std=c++20
```
- Run your code
```
chmod +775 myProgram
./myProgram
```
##### Run Once
```
node compiler.mjs -f myCode.imp -o myCode.cpp -l c++ -b -r
rm myCode.cpp
```
##### Show tokens
```
node compile.mjs -f myCode.imp -t
```
##### Show parser
```
node compile.mjs -f myCode.imp -p
```
##### Show code
```
node compile.mjs -f myCode.imp -l c++
```


#### Features
- Bash like functions
- Evrything is a function, making the syntax really easy to learn


#### Next
- Modules to call complex c++ code


#### Syntax
##### Functions

