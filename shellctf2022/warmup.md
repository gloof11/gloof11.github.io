# Warmup

Opening up the binary in cutter, we find that the provided input has to be 27 length, or else if will print "wrong length."

![image](https://i.gyazo.com/d87457bc07dd7292ab1e353dd300442f.png)

The code loads values into separate variables, bit-shifts the variables to the right by 2, and compares it against our user string!

The main decryption loop is down below

![image](https://i.gyazo.com/f4e3d048df964aba77d02497d67f10c4.png)

There are many ways to solve this but I just created a python script to the the loop for me, and found the flag! :)

```
string = [0x1cc
   ,0x1a0
   ,0x194
   ,0x1b0
   ,0x1b0
   ,0x18c
   ,0x1d0
   ,0x198
   ,0x1ec
   ,0x188
   ,0xc4
   ,0x1d0
   ,0x15c
   ,0x1a4
   ,0xd4
   ,0x194
   ,0x17c
   ,0xc0
    ,0x1c0
    ,0xcc
    ,0x1c8
    ,0x104
    ,0x1d0
    ,0xc0
    ,0x1c8
    ,0x14c
    ,0x1f4]

for letter in string:
    letter = letter >> 2
    print(chr(letter), end="")
```

flag: shellctf{b1tWi5e_0p3rAt0rS}
