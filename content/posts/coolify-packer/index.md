+++
date = '2026-03-02'
draft = true
title = 'Coolify with Packer'
+++

Having issues with Coolify running on first boot

- Either need to use runcmd
- Create a systemctl service that runs once and never again
    -   [Unit]
        Description=Run specific commands on first boot
        After=network.target

        [Service]
        Type=oneshot
        ExecStart=/usr/local/bin/first-boot.sh
        RemainAfterExit=yes

        [Install]
        WantedBy=multi-user.target