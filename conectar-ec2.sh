#!/bin/bash
# Script para conectarse a EC2
chmod 400 cyafibertechclave.pem
ssh -i cyafibertechclave.pem ec2-user@3.14.73.208

