
# Blocky - HackTheBox

This machine seems like something that you could actually find in the wild. Mainly reusing creds, and exposing files you shouldn't

このボックスでは、ネット上で本格的なサーバーに似てるので良い練習になりました。このボックスの大脆弱性は二つです。パスワード再設定とセンシティブなファイルを無意識に表示することです。

# Enumeration・情報収集

## Rustscan

```bash
Open 10.10.10.37:21
Open 10.10.10.37:22
Open 10.10.10.37:80
Open 10.10.10.37:25565
```

## Nmap

```bash
21/tcp    open  ftp       ProFTPD 1.3.5a
22/tcp    open  ssh       OpenSSH 7.2p2 Ubuntu 4ubuntu2.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 d6:2b:99:b4:d5:e7:53:ce:2b:fc:b5:d7:9d:79:fb:a2 (RSA)
|   256 5d:7f:38:95:70:c9:be:ac:67:a0:1e:86:e7:97:84:03 (ECDSA)
|_  256 09:d5:c2:04:95:1a:90:ef:87:56:25:97:df:83:70:67 (ED25519)
80/tcp    open  http      Apache httpd 2.4.18
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Did not follow redirect to http://blocky.htb
|_http-server-header: Apache/2.4.18 (Ubuntu)
25565/tcp open  minecraft Minecraft 1.11.2 (Protocol: 127, Message: A Minecraft Server, Users: 0/20)
```

## ffuf

```bash
.htpasswd               [Status: 403, Size: 294, Words: 22, Lines: 12, Duration: 4476ms]
.htaccess               [Status: 403, Size: 294, Words: 22, Lines: 12, Duration: 4476ms]
javascript              [Status: 301, Size: 313, Words: 20, Lines: 10, Duration: 116ms]
phpmyadmin              [Status: 301, Size: 313, Words: 20, Lines: 10, Duration: 66ms]
plugins                 [Status: 301, Size: 310, Words: 20, Lines: 10, Duration: 59ms]
server-status           [Status: 403, Size: 298, Words: 22, Lines: 12, Duration: 69ms]
wiki                    [Status: 301, Size: 307, Words: 20, Lines: 10, Duration: 116ms]
wp-includes             [Status: 301, Size: 314, Words: 20, Lines: 10, Duration: 295ms]
wp-admin                [Status: 301, Size: 311, Words: 20, Lines: 10, Duration: 306ms]
wp-content              [Status: 301, Size: 313, Words: 20, Lines: 10, Duration: 352ms]
```

もしかして、これがマインクラフトサーバーかな。

# Foothold・初期侵入

一つのポストが書かれたワードプレスブログがあります。そのポストの著者は"notch"らしい。

![blog post](https://i.gyazo.com/879e84274d1c5e06b581fd1b5201ef1d.png)

anonymous FTPログインしようとしましたがアクセスできませんでした。しかし、ユーザーネームを"notch"に設定したらサーバーからの返事には少し遅れたので、"notch"はユーザーとして可能だとわかりました。

"/plugins"フォルダーを見て、"BlockyCore.jar"っていうファイルが見つかりました。

![blocky core](https://i.gyazo.com/ca69cbd256bcce587e55176d947770f8.png)

"BlockyCore.jar"をデコンパイルするとmysqlデーターベースのユーザーとパスワードを発見した！

![sql creds](https://i.gyazo.com/a7ca9c98ed326817ea3be1b0f7f31ccc.png)

"notch"と".jar"ファイルからもらったパスワードを使ってFTPとSSHができました。

そしてuserフラグゲット！

```bash
drwxrwxr-x   7 notch    notch        4096 Jul  3  2017 minecraft
-r--------   1 notch    notch          33 Sep  4 23:15 user.txt
```

# Root

Rootは簡単でした。

```bash
notch@Blocky:~$ sudo -l
[sudo] password for notch: 
Matching Defaults entries for notch on Blocky:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User notch may run the following commands on Blocky:
    (ALL : ALL) ALL
notch@Blocky:~$ sudo bash -i
root@Blocky:~# cd /root
root@Blocky:/root# ls -al
total 28
drwx------  3 root root 4096 Jul  6 07:25 .
drwxr-xr-x 23 root root 4096 Jun  2 02:44 ..
-rw-------  1 root root    1 Dec 24  2017 .bash_history
-rw-r--r--  1 root root 3106 Oct 22  2015 .bashrc
drwx------  2 root root 4096 Jun  7 02:47 .cache
-rw-r--r--  1 root root  148 Aug 17  2015 .profile
-r--------  1 root root   33 Sep  4 18:15 root.txt
root@Blocky:/root# cat root.txt
```

この解説を読んでくれてありがとうございます！　:D
