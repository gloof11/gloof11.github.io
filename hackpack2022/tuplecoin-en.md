This challenge was very interesting. Let's take a look at the source code.
```
from __future__ import annotations
import hmac
import math
import os
import secrets

from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel


SECRET_KEY = secrets.token_bytes(32)    # random each time we run
TUCO_ACCT_NUM = 314159265

FLAG_FILE = os.environ.get("TUPLECOIN_FLAG_FILE", "flag.txt")
try:
    with open(FLAG_FILE) as fd:
        FLAG = fd.read().strip()
except:
    FLAG = "we has a fake flag for you, but it won't get you points at the CTF..."


app = FastAPI()
APP_DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "client", "dist")
app.mount("/app", StaticFiles(directory=APP_DIST_DIR), name="static")


class Balance(BaseModel):
    acct_num: int
    num_tuco: float

    def serialize(self) -> bytes:
        return (str(self.acct_num) + '|' + str(self.num_tuco)).encode()

    def sign(self, secret_key: bytes) -> CertifiedBalance:
        return CertifiedBalance.parse_obj({
            "balance": {
                "acct_num": self.acct_num,
                "num_tuco": self.num_tuco,
            },
            "auth_tag": hmac.new(secret_key, self.serialize(), "sha256").hexdigest(),
        })


class CertifiedBalance(BaseModel):
    balance: Balance
    auth_tag: str

    def verify(self, secret_key: bytes) -> Balance:
        recreate_auth_tag = self.balance.sign(secret_key)
        if hmac.compare_digest(self.auth_tag, recreate_auth_tag.auth_tag):
            return self.balance
        else:
            raise ValueError("invalid certified balance")


class Transaction(BaseModel):
    from_acct: int
    to_acct: int
    num_tuco: float

    def serialize(self) -> bytes:
        return (str(self.from_acct) + str(self.to_acct) + str(self.num_tuco)).encode()

    def sign(self, secret_key: bytes) -> AuthenticatedTransaction:
        tuco_smash = self.serialize()
        tuco_hash = hmac.new(secret_key, tuco_smash, "sha256").hexdigest()

        return CertifiedTransaction.parse_obj({
            "transaction": {
                "from_acct": self.from_acct,
                "to_acct": self.to_acct,
                "num_tuco": self.num_tuco
            },
            "auth_tag": tuco_hash,
        })


class CertifiedTransaction(BaseModel):
    transaction: Transaction
    auth_tag: str

    def verify(self, secret_key: bytes) -> Transaction:
        recreated = self.transaction.sign(secret_key)
        if hmac.compare_digest(self.auth_tag, recreated.auth_tag):
            return self.transaction
        else:
            raise ValueError("invalid authenticated transaction")


@app.get('/', include_in_schema=False)
def home():
    return RedirectResponse("app/index.html")


@app.get('/robots.txt', include_in_schema=False)
def robots():
    return RedirectResponse("app/robots.txt")

@app.post("/api/account/claim")
async def account_claim(acct_num: int) -> CertifiedBalance:
    if acct_num == TUCO_ACCT_NUM:
        raise HTTPException(status_code=400, detail="That's Tuco's account number! Don't make Tuco mad!")

    balance = Balance.parse_obj({
        "acct_num": acct_num,
        "num_tuco": math.pi,
    })

    return balance.sign(SECRET_KEY)


@app.post("/api/transaction/certify")
async def transaction_certify(transaction: Transaction) -> CertifiedTransaction:
    if transaction.from_acct == TUCO_ACCT_NUM:
        raise HTTPException(status_code=400, detail="Ha! You think you can steal from Tuco so easily?!!")
    return transaction.sign(SECRET_KEY)


@app.post("/api/transaction/commit")
async def transaction_commit(certified_transaction: CertifiedTransaction) -> str:
    transaction = certified_transaction.verify(SECRET_KEY)
    if transaction.from_acct != TUCO_ACCT_NUM:
        return "OK"
    else:
        return FLAG
```
On this website, we can create an account, and transfer "TucoCoin" to other users of the site.

Looking at the source code it's defined here
```
FLAG_FILE = os.environ.get("TUPLECOIN_FLAG_FILE", "flag.txt")
try:
    with open(FLAG_FILE) as fd:
        FLAG = fd.read().strip()
except:
    FLAG = "we has a fake flag for you, but it won't get you points at the CTF..."
```

And the function we need to display the flag is this one.
```
@app.post("/api/transaction/commit")
async def transaction_commit(certified_transaction: CertifiedTransaction) -> str:
    transaction = certified_transaction.verify(SECRET_KEY)
    if transaction.from_acct != TUCO_ACCT_NUM:
        return "OK"
    else:
        return FLAG
```

If the from_acct isn't Tuco's account, then we get the flag!

Let's try it! Set the "from_acct" to Tuco's account number aaaaand!

![](https://i.gyazo.com/1460af8ae9422eabfb2873c4ae4611bf.png)

Hmm, Error 500.

Well let's try sending this request to the /transaction/certify API.

![](https://i.gyazo.com/ad8fcad986c90253250ea7c021c54d0c.png)

Well, that makes sense. In the source code if the from_acct is Tuco's account number then it will give us that message.

Looking again at the "commit" endpoint. There's a line that is really intersting.
```
transaction = certified_transaction.verify(SECRET_KEY)
```

This is in reference to the class CertifiedTransaction
```
class CertifiedTransaction(BaseModel):
    transaction: Transaction
    auth_tag: str

    def verify(self, secret_key: bytes) -> Transaction:
        recreated = self.transaction.sign(secret_key)
        if hmac.compare_digest(self.auth_tag, recreated.auth_tag):
            return self.transaction
        else:
            raise ValueError("invalid authenticated transaction")
```

So what throws the error 500, is when the "auth_tag" HMAC digest doesn't match.

Let's see how the "auth_tag" HMAC digest is generated by looking at the transaction class.
```
class Transaction(BaseModel):
    from_acct: int
    to_acct: int
    num_tuco: float

    def serialize(self) -> bytes:
        return (str(self.from_acct) + str(self.to_acct) + str(self.num_tuco)).encode()

    def sign(self, secret_key: bytes) -> AuthenticatedTransaction:
        tuco_smash = self.serialize()
        tuco_hash = hmac.new(secret_key, tuco_smash, "sha256").hexdigest()

        return CertifiedTransaction.parse_obj({
            "transaction": {
                "from_acct": self.from_acct,
                "to_acct": self.to_acct,
                "num_tuco": self.num_tuco
            },
            "auth_tag": tuco_hash,
        })
```
And here in lies our problem.

What this function does is append the "from_acct" number, "to_acct" number, and the number of TucoCoin being sent to a string, then encodes it to bytes.

This is then signed using a secret key using sha256.

Let's see the raw output of this serialize function and run some tests.
```
import hmac
import math
import os
import secrets

secret_key = bytes("hello".encode())

from_acct = int(12)
to_acct = int(0)
num_tuco = float(3)

serialized = (str(from_acct) + str(to_acct) + str(num_tuco)).encode()

hash = hmac.new(secret_key, serialized, "sha256").hexdigest()
print (serialized)
print (hash)
```

Here is the output of our script showing the bytes object and the corresponding hmac digest.
```
b'1203.0'
3cc052a10acf56a9abeba4c1eeea05040dbb520d2ac088b642b1e4279bdf2499
```

Now if we set the "from_acct" to 1, and the "to_acct" to 20, will we get the same bytes object and hmac digest? Let's see.
```
import hmac
import math
import os
import secrets

secret_key = bytes("hello".encode())

from_acct = int(1)
to_acct = int(20)
num_tuco = float(3)

serialized = (str(from_acct) + str(to_acct) + str(num_tuco)).encode()

hash = hmac.new(secret_key, serialized, "sha256").hexdigest()
print (serialized)
print (hash)
```
```
b'1203.0'
3cc052a10acf56a9abeba4c1eeea05040dbb520d2ac088b642b1e4279bdf2499
```

Because all the function does is append strings together, it doesn't matter in which variable the string exists, leading to the same bytes object and same hash.

So if we can generate a request which will generate a valid "auth_tag", then pass that request to the "commit" endpoint, with Tuco's account number in "from_acct" we'll get the flag!

So let's generate a request that gives us a valid "auth_tag".
![](https://i.gyazo.com/f248c472f4ddae942f935046ad78d3ad.png)

Now let's pass a request to the "commit" endpoint with Tuco's account number.
![](https://i.gyazo.com/26acec8dfa1093601d3ad1ce5ad5bae3.png)

And there's our flag!
