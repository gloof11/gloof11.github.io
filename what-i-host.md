---
title: /what-i-host
layout: page
permalink: /what-i-host
---

# My currently hosted services
Starting in beginning of 2023, I've decided to migrate all of my cloud services/services that are hosted somewhere else on-prem (my house). My motivation for this was to learn more about how to securely host services, cut down on my subscription bill, and gain some more freedom over my digital life. From starting with 2 old laptops running ubuntu server, to a proper server, a Raspberry Pi for NAS storage, and automated cloud backups, I'd say I've come a pretty far way. Below is my proverbial stack as well as what applications I host on there.
<br />

## My Home Infrastructure
<hr />
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

## Self-Hosted services
<hr />
**Homarr**
<img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fdevcarotte.fr%2Fimgs%2Flogo%2Flogo.png&f=1&nofb=1&ipt=bf61c8e40ad24ce086103b1ed60095bf7b51afeb23d9ef63b3e2b5f54b87b183&ipo=images" Alt="Homarr" width="200" height="150" />
Homarr is an open-source dashboard application designed to centralize and streamline access to various services and resources within a home server, self-hosting, or network environment. You can think about it as a "home page for your home server". 
Homarr was the first service that I started hosting on my old Ubuntu server, and not much in its design has changed since!
<img src="/assets/homarr-dashboard.png" Alt="My Homarr Dashbaord" width="900" height="420" />
<br />
