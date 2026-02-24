+++
date = '2026-02-21'
draft = true
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

[Services](#self-hosted-services)

## Intro To CI/CD

Since adding this laptop to the cluster, I've had to re-evaluate how some of my CI/CD pipelines work. Nothing too big, but I would have to change some portions. I figured this would be a good time to go over what CI/CD is, and how you can use it in your homelabs.

In short, CI/CD stands for Continuous Integration/Continuous Delivery. In other words, the principal behind achieving CI/CD is to make chagnes frequently, catch bugs early, and have a deliverable product as soon as possible. Now, remember I said Continuous **Delivery**, not Continuous **Deployment**. These are two different things, delivery ensures you have a deliverable product, I.E. something that could be deployed, while deployment automates deployments. Automated deployments can be done, and to an extent I do them in my own projects, but do realize is it much more risky than continuous delivery.

There exist multiple tools that are used in CI/CD pipelines, but the main ones I'm going to go over are [Ansible](https://docs.ansible.com/projects/ansible/latest/getting_started/introduction.html), and [Pulumi](https://www.pulumi.com/docs/iac/concepts/). I've gone over Ansible & Terraform in my [cloud migration post](/posts/homelab-cloud-migration), however Pulumi is a little bit different. Pulumi is a declaritive IaC tool just like Terraform however, it supports more than 1 programming language! That's right, if you hate HCL, now you can write your IaC with TypeScript, Python, Go, C#, Java, or YAML! Seriously moving to Pulumi has been sooo much better, and you'll see what I mean shortly.

So that's the introduction of the tools, but let me go over Pulumi a little bit more.

## A Look At Pulumi

If you're familiar with Terraform and state management for these IaC tools Pulumi works very similarly.
I have my own S3 storage on my homelab, so I use that for my backend. If you're following along please look at [this article](https://www.pulumi.com/docs/iac/concepts/state-and-backends/) to get a good understanding of how state management works for Pulumi.

So, where do we begin?

First, you'll need to install pulumi, so follow [this link](https://www.pulumi.com/docs/get-started/download-install/) for your OS.
Then, you'll need to setup a backend. I will assume that you're using the local backend for this test project.

Finally, we do a 

```bash
pulumi new
```

and this will give you a lot of templates for Pulumi, but we're gonna select just "Python".

```bash
-> % pulumi new      
Please choose a template (184 total):
 python  [Use arrows to move, type to filter]
  aiven-python                       A minimal Aiven Python Pulumi program
  alicloud-python                    A minimal AliCloud Python Pulumi program
  auth0-python                       A minimal Auth0 Python Pulumi program
  aws-python                         A minimal AWS Python Pulumi program
  azure-python                       A minimal Azure Native Python Pulumi program
  azuredevops-python                 A minimal Azure DevOps Python Pulumi program to create an AzureDevOps Project
  container-aws-python               A Python program to deploy a containerized service on AWS
  container-azure-python             A Python program to deploy a containerized service on Azure
  container-gcp-python               A Python program to deploy a containerized service on Google Cloud
  digitalocean-python                A minimal DigitalOcean Python Pulumi program
  gcp-python                         A minimal Google Cloud Python Pulumi program
  github-python                      A minimal GitHub Python Pulumi program
  helm-kubernetes-python             A Python program to deploy a Helm chart onto a Kubernetes cluster
  kubernetes-aws-python              A Python program to deploy a Kubernetes cluster on AWS
  kubernetes-azure-python            A Python program to deploy a Kubernetes cluster on Azure
  kubernetes-gcp-python              A Python program to deploy a Kubernetes cluster on Google Cloud
  kubernetes-ovh-python              A Python program to deploy a Kubernetes cluster on OVHcloud
  kubernetes-python                  A minimal Kubernetes Python Pulumi program
  linode-python                      A minimal Linode Python Pulumi program
  oci-python                         A minimal OCI Python Pulumi program
  ovh-python                         A minimal OVHcloud Python Pulumi program
  pinecone-python                    A minimal Pinecone Python Pulumi program
> python                             A minimal Python Pulumi program
  random-python                      A minimal Random Python Pulumi program.
  rediscloud-python                  A minimal RedisCloud Python Pulumi program
  sagemaker-aws-python               A Python program to deploy a Huggingface LLM model to Amazon SageMaker with CloudWatch monitoring
  serverless-aws-python              A Python program to deploy a serverless application on AWS
  serverless-azure-python            A Python program to deploy a serverless application on Azure
  serverless-gcp-python              A Python program to deploy a serverless application on Google Cloud
  static-website-aws-python          A Python program to deploy a static website on AWS
  static-website-azure-python        A Python program to deploy a static website on Azure
  static-website-gcp-python          A Python program to deploy a static website on Google Cloud
  vm-aws-python                      A Python program to deploy a virtual machine on Amazon EC2
  vm-azure-python                    A Python program to deploy a virtual machine on Azure
  vm-gcp-python                      A Python program to deploy a virtual machine on Google Cloud
  webapp-kubernetes-python           A Python program to deploy a web application onto a Kubernetes cluster
```

You'll then be prompted for a project name, description, and stack.
Name and description is self-explainatory, but stack iss pretty interesting. It essentially allows you to switch quickly between environments. If you run a dev/prod split environment this would be very helpful.

So lets dive into a Pulumi file and I'll explain as I go.

