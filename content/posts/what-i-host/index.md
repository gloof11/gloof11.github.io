+++
date = '2025-01-11'
draft = false 
title = 'What I Host'
summary = 'What I have in my homelab'
+++

Starting in beginning of 2023, I've decided to migrate all of my cloud services/services that are hosted somewhere else on-prem (my house). My motivation for this was to learn more about how to securely host services, cut down on my subscription bill, and gain some more freedom over my digital life. From starting with 2 old laptops running ubuntu server, to a proper server, a Raspberry Pi for NAS storage, and automated cloud backups, I'd say I've come a pretty far way. Below is my proverbial stack as well as what applications I host on there.

## Quick Jumps

[Hardware](#my-hardware)

[Infrastructure](#my-home-infrastructure)

[Services](#self-hosted-services)


## My Hardware
----------
FUJITSU PRIMERGY TX1320 M3 - for Proxmox
![FUJITSU PRIMERGY TX1320 M3](https://www.bsi.uk.com/media/catalog/product/cache/1/thumbnail/1280x960/040ec09b1e35df139433887a97daa66f/4/2/42450_fujitsu_server_primergy_tx1320_m3_left_side_open_lpr.jpg)

ZimaBoard 832 - for OPNSense
![ZimaBoard 832](https://cdn.shopify.com/s/files/1/0549/4495/6614/products/zimaboard-832-2021-special-edition-100446_195x195@2x.jpg?v=1683039366)

TP-Link TL-SG108E
![TL-SG108E](https://shopdelta.eu/shop_image/product/tl-sg108e.jpg)

TP-Link TL-SG116E
![TL-SG116E](https://shopdelta.eu/shop_image/product/tl-sg116e.jpg)

## My Home Infrastructure
----------
**Proxmox** - for Virtualization

**OPNSense** - for Firewall, WAN connection, DNS, and Routing

**Linode Object Storage** - for Offsite Backups

**Authelia** - for 2FA 

**Caddy** - for Reverse Proxy services, both internal and external

**Ansible** - for provisioning VM's & containers

**Gitea** - for Source Control & CI/CD 

**FreeNAS** - for Home NAS 

## Self-Hosted services
----------
**Homarr** - Homarr is an open-source dashboard application designed to centralize and streamline access to various services and resources within a home server, self-hosting, or network environment. You can think about it as a "home page for your home server". 
Homarr was the first service that I started hosting on my old Ubuntu server, and not much in its design has changed since!

**Calibre** - This is where I keep all of my E-books. 

**GNS3** - Used for emulating network components. This was a godsend during my CCNA, and even now I use it to stay sharp on my Cisco skills, and also prototype network changes at the house and at work. I would hihgly recommend anyone wanting to dive deeper in to IT or network architecture to get it. I've been told about EVE-Ng and maybe one day I'll try it out!

**CryptPad** - CryptPad is a fully E2EE (End-to-End Encrypted) office suite. I looooooove CryptPad. I can have Draw.io, and OpenOffice as a SaaS hosted all by myself. Ever since I starting using CryptPad I ditched Google Drive. If you have the space for it, please please **please** try this out, there are tons of free instances on the internet right now that you can use, and since everything is E2EE, you don't have to worry about someone getting access to it if you don't want them to.

**YAMS** - YAMS is a suite of media server apps all packaged together with Docker. It comes with:

- Sonarr
- Radarr
- Prowlarr
- qBittorent
- Jellyfin

Definitely recommend for all of your media needs.

**Immich** - My replacement for iCloud. I'm not a fan of giving all of my photos to Apple, so starting with Immich, I'll be able to have secure backups and not pay for storage that I already have :)
