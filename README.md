# SIMPLE 2022

Simple is a new programming language (under development)

This lenguage is desgined thinking in simplicity and productivity. Focused on fast development, should be usefull to create small and fast scripts. 


#### Notice
The code quality is really bad.   



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
- Bash like function calls
- Variables
- Types are guessed
- Transpilable to multiple languages
- Short and simple syntax
- Really easy to learn



#### Next
- Modules to call complex c++ code


#### Syntax
##### Variables
You can use variables to save values.
```
res = 5
```

##### Internal Functions
There are some predefined functions you can use.
- out
```
out "Hello world!\n"
```

- in
```
in "What is your name?"
```

- +in
```
+in "How old are you"
```

##### Functions
You can create functions. You will need them to basic actions like addition. 
- Void function
```
sayHello {
  out "Hello"
}

sayHello
```

- Function returning value
```
add {
  $1 + $2
}

add 2 7
```

- Function with multiple expresions and returning a value
```
sub {
  out "Substraction started...\n"
  $1 - $2
}

res = sub 10 7
out res
```

##### Conditionals
```
if 5 > 1
  out "All good!"
else
  out "Whaaaat?"
fi
```

##### Loops
- For
For loops require four arguments. Variable name for the itherator, initial variable value, value to reach, amouth of increment.
```
for i 0 10 1
  out i
  out "\n"
rof
```


#### Examples
```
sub {
  $1 - $2
}

age = +in "Your age -> "

if age < 18
  out "You are underage, access denied."
  diff = sub 18 age
  out "\nTry again in "
  out diff
  out " year/s"
else
  out "Welcome!"
fi
```
