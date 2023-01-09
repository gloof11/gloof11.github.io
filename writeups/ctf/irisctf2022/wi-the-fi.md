---
title: /writeups/ctf/irisctf2022/wi-the-fi
layout: post
permalink: /writeups/ctf/irisctf2022/wi-the-fi
---

This challenge gives us a .cap file called BobertsonNet.cap

![](https://i.gyazo.com/ed91e79ad69d4682cf4b123458c5f8f7.png)

From this, we can tell that this is a cap of some Wi-Fi traffic.

I did a search for BobertsonNet, and it returned a device broadcasting the SSID: BobertsonNet

![](https://i.gyazo.com/ec15ac1a94adc5bd9d9ffa3c238e64a8.png)

Something I noticed cruicially, is that all of this data is "QoS" data.
QoS is quality-of-service data, and in this context, wireshark uses "QoS" data as a broad wrapper for encrypted data. Meaning that we're probably going to have to break the encryption between some endpoint devices.

![](https://i.gyazo.com/8f33b8f111b2fac5efc643176e8d9441.png)

And then I came across this packet.

![](https://i.gyazo.com/57a1e0236f9f19d0e64cc67ef31124b3.png)

This is an EAP packet. EAP if you don't know, is an [authentication protocol that is used over 802.1X](https://www.cisco.com/en/US/docs/wireless/wlan_adapter/secure_client/5.1.0/administration/guide/C1_Network_Security.html#wp1051235)

EAP uses a [4-way handshake](https://praneethwifi.files.wordpress.com/2019/11/image-25.png?w=1024) to authenticate. So lets look for that handshake between these clients.

Let's checkout the communications between these devices.

![](https://i.gyazo.com/303dfae84fb77104cb260405fd85c11d.png)

And here we can see what's going on.

Let's use this picture as to help explain what is going on.

![](https://documentation.meraki.com/@api/deki/files/727/3d40e28a-8813-4b79-8ddb-fb395d1e1fba?revision=1)

I would also like to point out, that not all of the transmissions are shown in this capture. In practice this can be for many reasons such as interference.

1. We see that the router gives a probe response.
2. The "mobile station" sends an authentication request.
3. The "mobile station" sends an association request.
4. The router/AP sends an association response.
5. The EAP handshake starts.

![4-way handshake](https://praneethwifi.files.wordpress.com/2019/11/image-25.png?w=1024)

But wait, this is a 4-way handshake, but there are only 3 parts of the message. However will we decrypt the communications here?

Don't you worry because all hope is not lost.

EAP does not actually transmit the password in the handshake. In actuality, both devices know the password. They both use [PBKDF](https://en.wikipedia.org/wiki/PBKDF2) to derive a Pre-Shared Key between one another.

In EAP, the PTK, and MIC are the importent keys that need to be generated in order to authenticate.

![](https://praneethwifi.files.wordpress.com/2019/11/image-22.png)

In message 1, the access point sends the client a NONCE.

![](https://i.gyazo.com/41470d53dcebe29c3ce6ab812a7b0e71.png)

In message 2, MIC verification will be done, and sent back to the access point.

![](https://i.gyazo.com/dde29c2b5626ece213470ccf263bd5ab.png)

Message 3 is supposed to send back the MIC, as well as the GTK, however we don't have message 3, but that's okay.
All we need to do is find the PSK to make the MIC verification hashes match.

This explaination is a gross-oversimplification so please check out [this blog post for a very detailed explaination](https://praneethwifi.in/2019/11/09/4-way-hand-shake-keys-generation-and-mic-verification/)

Because we have both message 1, and 2 we can use airdecap to brute force the password, to generate the PSK.

Running it through airdecap-ng, the password we get is "billybob1".

Let's use that password to decrypt the conversation.

![](https://i.gyazo.com/7f76fccd29d64e3896bdd5a1568140c1.png)

And now we have our decrypted communications!!

Luckily for us, airdecap gives us the decrypted cap.

Grepping through the file for "iris" gives us the flag!!

```irisctf{4ircr4ck_g0_brrrrrrrrrrrrrrr}```