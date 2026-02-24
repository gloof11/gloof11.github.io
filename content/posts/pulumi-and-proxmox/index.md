+++
date = '2026-02-24'
draft = false 
title = 'Pulumi and Proxmox'
summary = 'Doing CI/CD with Pulumi and Proxmox'
+++

It's time to retire my old gaming laptop. I bought this laptop before I shipped off for basic military training (circa September 2018), and it has served me well. In the past I've had bad experiences with them, but I can say that the ASUS FX504 was a solid laptop for its time. It has a Core i7-8750H, 16GB RAM, and a GTX 1060 Mobile. However, she's shown her age, the trackpad & keyboard barely works, and the frame around the screen is bending, and feels like it's going to fall off. If you look at it from the side you can actually see where the plastic is separating lol.

![Poor girl :(](holyscreen.jpg)

So instead of putting her out of her misery, I decided to turn her into my second Proxmox node!
Welcome to the club Cirina.

## Quick Jumps

[Intro To CI/CD](#intro-to-ci/cd)

[A Look At Pulumi](#a-look-at-pulumi)

[Tying It Together With Git](#tying-it-together-with-git)

[Some Considerations](#some-considerations)

## Intro To CI/CD

Since adding this laptop to the cluster, I've had to re-evaluate how some of my CI/CD pipelines work. Nothing too big, but I would have to change some portions. I figured this would be a good time to go over what CI/CD is, and how you can use it in your homelabs.

In short, CI/CD stands for Continuous Integration/Continuous Delivery. In other words, the principal behind achieving CI/CD is to make chagnes frequently, catch bugs early, and have a deliverable product as soon as possible. Now, remember I said Continuous **Delivery**, not Continuous **Deployment**. These are two different things, delivery ensures you have a deliverable product, I.E. something that could be deployed, while deployment automates deployments. Automated deployments can be done, and to an extent I do them in my own projects, but do realize is it much more risky than continuous delivery.

There exist multiple tools that are used in CI/CD pipelines, but the main ones I'm going to go over are [Ansible](https://docs.ansible.com/projects/ansible/latest/getting_started/introduction.html), and [Pulumi](https://www.pulumi.com/docs/iac/concepts/). I've gone over Ansible & Terraform in my [cloud migration post](/posts/homelab-cloud-migration), however Pulumi is a little bit different. Pulumi is a declaritive IaC tool just like Terraform however, it supports more than 1 programming language! That's right, if you hate HCL, now you can write your IaC with TypeScript, Python, Go, C#, Java, or YAML! Seriously moving to Pulumi has been sooo much better, and you'll see what I mean shortly.

So that's the introduction of the tools, but lets go over Pulumi a little bit more.

## A Look At Pulumi

If you're familiar with Terraform and its state management, Pulumi works very similarly.
I have my own S3 storage on my homelab, so I use that for my backend. If you're following along please look at [this article](https://www.pulumi.com/docs/iac/concepts/state-and-backends/) to get a good understanding of how state management works for Pulumi.

So, where do we begin?

First, you'll need to install pulumi, so follow [this link](https://www.pulumi.com/docs/get-started/download-install/) for your OS.
Then, you'll need to setup a backend.

Finally, we do a 

```bash
pulumi new
```

and this will give you a lot of templates for Pulumi, but we're gonna select just "Python".

```bash
-> % pulumi new      
Please choose a template (184 total):
 python  [Use arrows to move, type to filter]
  ...
  aiven-python                       A minimal Aiven Python Pulumi program
  alicloud-python                    A minimal AliCloud Python Pulumi program
  auth0-python                       A minimal Auth0 Python Pulumi program
  aws-python                         A minimal AWS Python Pulumi program
  ovh-python                         A minimal OVHcloud Python Pulumi program
  pinecone-python                    A minimal Pinecone Python Pulumi program
> python                             A minimal Python Pulumi program
  random-python                      A minimal Random Python Pulumi program.
  rediscloud-python                  A minimal RedisCloud Python Pulumi program
  ...
```

You'll then be prompted for a project name, description, and stack.
Name and description is self-explainatory, but stack is pretty interesting. It essentially allows you to switch quickly between environments. If you run a dev/prod split environment, this would be very helpful.

This will then generate the following files:

```md
__main__.py <- Where the main IaC code will go
.gitignore <- Standard gitignore for Pulumi
Pulumi.dev.yaml <- Your Pulumi encryption salt
Pulumi.yaml <- Your Pulumi configuration
requirements.txt <- Pip requirements for Pulumi
```

For the sake of brevity, lets take a look at the main IaC code.
For this example I'll be using a project that I made that creates a Kubernetes cluster. Some portions will be redacted.

```python
import pulumi
import pulumi_proxmoxve as proxmox
import json
import os
from jinja2 import Template
import base64

provider = proxmox.Provider(os.getenv('PROXMOX_NODE'),
                            endpoint=f"https://[REDACTED]:8006",
                            insecure=True,
                            username=f"{os.getenv('PROXMOX_USER')}[REDACTED]",
                            password=os.getenv('[REDACTED]'),)
```

First we import the necessary modules that we'd need for the project, as well as setup the Proxmox provider.

```python
for vm in vms:
    current_vm = proxmox.vm.VirtualMachine(vm["name"],
        node_name=os.getenv('PROXMOX_NODE'),
                                        
        agent=proxmox.vm.VirtualMachineAgentArgs(
            enabled=True
        ),
                                        
        cdrom=proxmox.vm.VirtualMachineCdromArgs(
            file_id="none",
        ),

        cpu=proxmox.vm.VirtualMachineCpuArgs(
            cores=2,
            type="host"
        ),     

        clone=proxmox.vm.VirtualMachineCloneArgs(
            vm_id=105, # Ubuntu Base Template
            full=True,
            node_name="ventus"
        ),
        
        description=f"Kubernets Cluster For Training: {vm["name"]}",

        disks=[
            proxmox.vm.VirtualMachineDiskArgs(
                interface="scsi0",
                datastore_id="local-zfs",
                replicate=False,
                size=24
            )
        ],

        initialization=proxmox.vm.VirtualMachineInitializationArgs(
            datastore_id="local-zfs",
            interface="ide0",
            ip_configs=[
                proxmox.vm.VirtualMachineInitializationIpConfigArgs(
                    ipv4=proxmox.vm.VirtualMachineInitializationIpConfigIpv4Args(
                        address=f"{vm["addr"]}/24",
                        gateway="[REDACTED]"
                    )
                )
            ],
            user_account=proxmox.vm.VirtualMachineInitializationUserAccountArgs(
                username=vm_user,
                keys=[decode_base64_key()],
                password=os.getenv('[REDACTED]')
            ),
        ),

        memory=proxmox.vm.VirtualMachineMemoryArgs(
            dedicated=2048
        ),
                              
        name=vm["name"],
                                        
        operating_system=proxmox.vm.VirtualMachineOperatingSystemArgs(
            type="l26"
        ),

        serial_devices=[],
        
        stop_on_destroy=True,
        
        tags=["kubernetes"],

        opts=pulumi.ResourceOptions(provider=provider, ignore_changes=["initialization"]))
```

Look at that beauty. The configurations are pretty self-explainatory. All this does is create a clone of an Ubuntu template that I have (made with Packer, maybe that should be its own article...) But there are some things that you may have noticed.
Like why is there a function called "decode_base64_key()", and why are we iterating over an object "vms"?
This my friends is the power of Pulumi and why I love it.

Because we are just using standard Python, we have all of the functionality, syntax that Python offers, and we can leverage that to make our infrastructure as dynamic as we want!

For example, if we create a dictionary with all of the VM's that we'd want to create, all we have to do is loop over them, and we can make as many VM's as we need!

```python
vms = [
    {
        "name": "c1-control1",
        "addr": "192.168.2.210"
    },
    {
        "name": "c1-node1",
        "addr": "192.168.2.211"
    },
    {
        "name": "c1-node2",
        "addr": "192.168.2.212"
    },
    {
        "name": "c1-node3",
        "addr": "192.168.2.213"
    },
]
```

Not only this, but we can create our Ansible inventory file with this data!

All we need to do is capture the Ouput from Pulumi with

```python
pulumi.Output.all(
    name=vm.name,
    interfaces=vm.network_interface_names,
    ip_addresses=vm.ipv4_addresses
).apply(
    lambda args: create_inventory(args['name'], args['interfaces'], args['ip_addresses'])
```

And then build our inventory file

```python
def create_inventory(vm_name, interfaces, ip_addresses):
    # Get the IP address
    vm_ip: str
    for index, interface in enumerate(interfaces):
        if interface == "eth0":
            vm_ip = ip_addresses[index][0]
            break

    with open('inventory.jinja2', 'r') as file:
        content = file.read()
        template = Template(content)
        rendered_form = template.render(vm_name=vm_name, vm_ip=vm_ip, vm_user=vm_user)

        output = open('../ansible/inventory.yml', 'w')
        output.write(rendered_form)
        output.close()
```

Now this is cool and all, but running this from my workstation, or laptop poses issues. For one, dependencies can be different across each system, and if I make a change one place, and don't change it somewhere else, I could end up messing up my state. Here's where we tie it all together into our CI/CD platform.

## Tying It Together With Git 

I use Gitea as my own source control, and it has compatibility with Act. If you've ever used Github Actions or GitLab CI/CD, Act is the same thing. It executes actions on your behalf via runners, using Github Action's yaml syntax.

Let's take a look at my deploy workflow as an example:

```yaml
name: Deploy kubernetes-cluster to Proxmox 
on:
  push:
  workflow_dispatch:

jobs:
  create-vms:
    name: "Create the VMs"
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v5

      - name: Refresh Pulumi
        uses: pulumi/actions@v6.6.1
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.PULUMI_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.PULUMI_ACCESS_KEY_SECRET }}
          AWS_REGION: 'us-east-1'
          PROXMOX_NODE: ${{ vars.PROXMOX_NODE }} 
          PROXMOX_USER: ${{ vars.PROXMOX_USER }}
          [REDACTED]: [REDACTED] 
          PROXMOX_PUB_KEY_BASE64: ${{ secrets.PROXMOX_PUB_KEY_BASE64 }}
          [REDACTED]: [REDACTED] 
        with:
          work-dir: ./pulumi
          command: refresh 
          stack-name: "organization/kubernetes-cluster/dev" # Insert stack name here
          cloud-url: [REDACTED] 
          parallel: 1

      - name: Preview Pulumi Changes
        uses: pulumi/actions@v6.6.1
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.PULUMI_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.PULUMI_ACCESS_KEY_SECRET }}
          AWS_REGION: 'us-east-1'
          PROXMOX_NODE: ${{ vars.PROXMOX_NODE }} 
          PROXMOX_USER: ${{ vars.PROXMOX_USER }}
          [REDACTED]: [REDACTED] 
          PROXMOX_PUB_KEY_BASE64: ${{ secrets.PROXMOX_PUB_KEY_BASE64 }}
          [REDACTED]: [REDACTED] 
        with:
          work-dir: ./pulumi
          command: preview 
          stack-name: "organization/kubernetes-cluster/dev" # Insert stack name here
          cloud-url: [REDACTED] 
          parallel: 1
          
      - name: Run Pulumi
        uses: pulumi/actions@v6.6.1
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.PULUMI_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.PULUMI_ACCESS_KEY_SECRET }}
          AWS_REGION: 'us-east-1'
          PROXMOX_NODE: ${{ vars.PROXMOX_NODE }} 
          PROXMOX_USER: ${{ vars.PROXMOX_USER }}
          cloud-url: [REDACTED] 
          PROXMOX_PUB_KEY_BASE64: ${{ secrets.PROXMOX_PUB_KEY_BASE64 }}
          cloud-url: [REDACTED] 
        with:
          work-dir: ./pulumi
          command: up
          stack-name: "organization/kubernetes-cluster/dev" # Insert stack name here
          cloud-url: [REDACTED] 
          parallel: 1

  provision-vms:
    name: "Provision the VMs"
    needs: create-vms
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v5
        
      - name: Add Proxmox Key To Runner
        run: |
          echo "${{ secrets.PROXMOX_PRIV_KEY }}" > /tmp/proxmox_key
          chmod 600 /tmp/proxmox_key
      
      - name: Install Ansible
        uses: alex-oleshkevich/setup-ansible@v1.0.1 
        with:
          version: "13.0.0"
          
      - name: Install proxmoxer & requests
        run: |
          sudo apt install python3-pip -y
          pip3 install proxmoxer --break-system-packages
          pip3 install requests --break-system-packages
            
      - name: Provision the environment
        uses: dawidd6/action-ansible-playbook@v5
        with:
          playbook: provision.yml
          directory: ansible
          options: |
            -i inventory.yml
            --private-key /tmp/proxmox_key
            -v
```

And there we go, our CI/CD pipeline that ties together Ansible, and Pulumi all in one file.
In short, this pipeline:

```md
* Refreshes the Pulumi state to make sure it is up to date
* Previews the changes that Pulumi would make
* Runs the Pulumi script
* Adds my administration key to the runner
* Runs my Ansible provisioning script
```

And in just 5 minutes, I could have a 4 node Kubernetes cluster up and running.

Additionally, Gitea can handle all of my secrets and environment variables, which makes this pipeline very portable.
As a matter of fact, I have a repository template which includes this YAML file, and I update it only to change the project name, SSH keys, etc.

## Some Considerations 

Brining it back to my laptop entering the cluster. Here are some things to watch out for:

```md
* If you are working with "Linked Clones" in Proxmox, be sure to convert them into "Full Clones" before you attempt to migrate with Pulumi. If you do not do this, Pulumi will automatically delete your current clone, and will fail to make a new one.
* If you ever make an out-of-band change, please please please, do a `pulumi refresh`. If you fail to do this, you risk erasing all of your data.
* Make note of which Pulumi options trigger recreations. This will be a quick way to lose your data.
* Make sure your backend is highly available. There is nothing worse than pulumi being mid operation, and losing access to its state.
```

Most of these apply to other IaC tools such as Terraform, but Pulumi makes it kinda easy to mess these things up.

Of course, I've experienced all 4 of these things when adding my new laptop to the cluster... So don't be like me.

If you can, please give Pulumi a try! You will not be disappointed.