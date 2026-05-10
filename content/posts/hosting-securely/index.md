+++
date = '2026-04-02T18:01:45-04:00'
draft = true
title = 'Hosting Securely'
summary = 'How I host services from within my house'
tags = ['']
+++

In my talks with friends and skimming the internet, I've found that many are afraid to host their own services so that they are accessible either outside of their home networks, and rightfully so. No one wants to be the target of a script kiddie or proper hacker, especially when it's their private data at stake.

Luckily, there are many ways to skin this cat. I won't go into tools like Tailscale, or CloudFlare Tunnels (though there will be CloudFlare mentioned in this post), instead I'll give an overview on how I host things from Cryptpad, to my own analytics from my home using basic network security principals, and virtualization.

## Quick Jumps

[VPN](#vpn)

[VLANS](#vlans)

[Firewalls](#firewalls)

[Authelia](#authelia)

[Caddy](#caddy)

[CrowdSec](#crowdsec)

## VPN

The easiest way of going about accessing content from outside your local network is with a VPN. No, I'm not talking Mullvad, or NordVPN, but a VPN that you host within your network, and expose to the internet.

There are numerous VPN technologies. The one I reccommend the most is Wireguard. Wireguard is a next-generation VPN that is significantly faster than OpenVPN, and is pretty damn secure. It's also supported on almost every platform on God's green earth, so no matter what hardware you have, you should be good.

I'll walk through my setup for my Wireguard VPN (note: your implementation will be different from mine depending on your hardware and your internal network).

My firewall uses OPNSense which has support for the 'wireguard' package.
