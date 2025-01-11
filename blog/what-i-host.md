---
title: /blog/what-i-host
layout: page
permalink: /blog/what-i-host
---

# My currently hosted services
Starting in beginning of 2023, I've decided to migrate all of my cloud services/services that are hosted somewhere else on-prem (my house). My motivation for this was to learn more about how to securely host services, cut down on my subscription bill, and gain some more freedom over my digital life. From starting with 2 old laptops running ubuntu server, to a proper server, a Raspberry Pi for NAS storage, and automated cloud backups, I'd say I've come a pretty far way. Below is my proverbial stack as well as what applications I host on there.
<br />

Quick Jumps
[Hardware](#my-hardware)
[Infrastructure](#my-home-infrastructure)
[Services](#self-hosted-services)

<br />

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
Proxmox - for Virtualization
![Proxmox](https://blog.miniserver.it/wp-content/uploads/logo-proxmox-firewallhardware.jpg)
<br />

OPNSense - for Firewall, WAN connection, DNS, and Routing
![OPNSense](https://www.bsmithio.com/post/opnsense-dashboard/opnsense-logo.png)
<br />

Linode Object Storage - for Offsite Backups
<img src="https://www.linode.com/wp-content/uploads/2019/06/linode-splash-object-storage-scale-data.svg" Alt="Linode Object Storage" width="200" height="200" />
<br />

Nginx Reverse Proxy - for Reverse Proxy services, both internal and external
![Nginx Reverse Proxy](https://i0.wp.com/easycode.page/wp-content/uploads/2021/09/download.jpeg?fit=192%2C192&ssl=1)
<br />

Ansible - for provisioning VM's & containers
![Ansible](https://databarracks.imgix.net/uploads/Logos/ansible-logo-red.png?w=150&q=90&auto=format&fit=crop&crop=faces,edges&fm=png)
<br />

Semaphore - used as an Ansible control node 
![Semaphore](https://semaphoreui.com/img/favicon.png?_2825)
<br />

OpenMediaVault - for HomeNAS ( When I get my new server, it'll be FreeNAS so stay tuned ;) ) 
![OpenMediaVault](https://images.sftcdn.net/images/t_app-icon-s/p/a960b59d-21db-466b-8166-ee2f06f45664/3071543822/openmediavault-icon.png)
<br />

## Self-Hosted services
----------
**Homarr**
<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fdevcarotte.fr%2Fimgs%2Flogo%2Flogo.png&f=1&nofb=1&ipt=bf61c8e40ad24ce086103b1ed60095bf7b51afeb23d9ef63b3e2b5f54b87b183&ipo=images" Alt="Homarr" width="200" height="150" />
Homarr is an open-source dashboard application designed to centralize and streamline access to various services and resources within a home server, self-hosting, or network environment. You can think about it as a "home page for your home server". 
Homarr was the first service that I started hosting on my old Ubuntu server, and not much in its design has changed since!
<img src="/assets/homarr-dashboard.png" Alt="My Homarr Dashbaord" width="900" height="420" />
<br />

**Calibre**
![Calibre](https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/calibre-logo.png)
This is where I keep all of my E-books. Setting this one up with Nginx Proxy Manager was annoying... Until I learned what WebSockets were ;)
<br />

**Gitea**
![Gitea](https://cdn.icon-icons.com/icons2/2407/PNG/128/gitea_icon_146173.png)
I know that Github has private repositories, but now that they've been training AI on repo's, I felt that it was time to have my own repo.
<br />

**GNS3**
![GNS3](https://assets.goodfirms.co/software/general/gns3.png)
Used for emulating network components. This was a godsend during my CCNA, and even now I use it to stay sharp on my Cisco skills, and also prototype network changes at the house and at work. I would hihgly recommend anyone wanting to dive deeper in to IT or network architecture to get it. I've been told about EVE-Ng and maybe one day I'll try it out!
<br />

**MySQL**
![MySQL](https://toppng.com/uploads/thumbnail/mysql-logo-png-design-11660514445kyekt4slt8.png)
I keep a MySQL instance up always for prototyping anything I'm building or prototyping other apps I'd like to host. Yes I know, SQLite is a thing and I love SQLite, but practically, database are connected to over a network so having an instance around to play with is always a good idea to me.
<br />

**CryptPad**
![CryptPad](https://vscteam.de/wp-content/uploads/2021/03/CryptPad_logo-e1630493144708.png)
CryptPad is a fully E2EE (End-to-End Encrypted) office suite. I looooooove CryptPad. I can have Draw.io, and OpenOffice as a SaaS hosted all by myself. Ever since I starting using CryptPad I ditched Google Drive. If you have the space for it, please please **please** try this out, there are tons of free instances on the internet right now that you can use, and since everything is E2EE, you don't have to worry about someone getting access to it if you don't want them to.
<br />

**LocalStack**
![LocalStack](https://media.trustradius.com/vendor-logos/Cn/G9/KR26U0CBJ7PT-180x180.PNG)
LocalStack is a local instance of the entire AWS platform. My goal this year is to get two AWS certs so hopefully I'll get more use out of this.
<br />

**YAMS**
<img src="https://yams.media/pics/logo.webp" Alt="YAMS" width="200" height="200" />
YAMS is a suite of media server apps all packaged together with Docker. It comes with
* Sonarr
* Radarr
* Prowlarr
* qBittorent
* Jellyfin

Definitely recommend for all of your media needs.
<br />

**Immich**
![Immich](https://raw.githubusercontent.com/immich-app/immich/main/mobile/android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png)
Immich is the first new addition to the box, and is my replacement for iCloud. I'm not a fan of giving all of my photos to Apple, so starting with Immich, I'll be able to have secure backups and not pay for storage that I already have :)
<br />
