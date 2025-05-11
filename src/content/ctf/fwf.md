---
title: "trikc"
platform: "THM"
publishedAt: 2025-05-24
cover: "/images/ctf/fwf.webp"
---

# 🧱 TryHackMe – Bricks Heist | Write-up técnico


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/5e19dbac-6f69-4b8e-8f73-8ef638bf2a2c/8415f495-a0a4-4a8d-b258-ce28be57dfa6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4666EPL37V6%2F20250511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250511T034512Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQDrJBeRVEklcL07CzWPi4ycpAUx85fRlH1ktmiU%2BH4zXQIhALt0p68A7V85v6qil0en6Epn8jZEyVsH0zG09oy89HMJKogECLT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxDsJqjQDsJpRt0uXUq3APtAeBtLl42TedtSggHMmEh4Bs8CkMLdwz2tf6NnkfFDTOMBUsxs9sGBNuvU6FQahwP66%2FbsnOogOWC1VwEY8prmndQIuJxHFK31SBMzZfGgGG8mk9X3jwO%2B%2BCziOOgFhhuBurfyn34GfCXUFr3nP9obEmBrjpaUYpniISc0mT2NMjNZvJi1ly5Am9KmuMh5Cmc3iU9DCizRxFowIfkpb76pyGYl%2B35vc%2BgVdBJKMIwIvZXC247XZnfGcytXI%2FFigOHtO0G%2BHgMTvV47F821b4vTbXHOlB6aYryQN%2BTQRH920v9vV70S2NowZYvgOGkDMEd78Rqt45G9MpLsg7nFqFar2emRfGmSkYy1T8SVDjaLCIwN52azE4h0X4fL8Pi%2FwtEt1X2Q7q4IGaGMlImB%2BXDWi2DMvtda1lz4ZEbhy%2BCFcqjDR1fYlvjAsoKtz02lWF3A7Kf8hblfoCoxw%2FiELzUvfK1rxkYUeOUCea%2B0%2FYQuzNPAxpk4vlMKG0hFEpMh%2F5Ya3wI7wW4EK9KJPQEVa%2F2IduAsNxn9tk1NNCpVPDWKZl1PPpVh096rzg8J0fwrUvkcslvD56JG4C3EjXyimqmiQumhkAqFNIRYBs9OLSwJVG5OnbTOB7rOGaUUTDanIDBBjqkAZOtOZoz7ybwNgbgLXDolFI49Jz3H7BHfTkyDMK8DE%2FerEsoPKRGbjELJpUzthUxvEh60d7%2BNNfqu5ms3HEcWW%2FiNyB1y%2FzVM7g7Zbxv68P7eQpTxZkQLH%2BDcxwCrZcxmM2RMIUTa1rASR0KJOOtqw7fwUe55vu5Vpnv4Npequj%2FqEIQvEY7fBkKS3SO6%2BRQ4Kd0hZlfnTtcGuhQpndxAX0%2B5yKw&X-Amz-Signature=d3c1b959e4a6c89c08e83dd45d0576946ba5ea1405f845b1d3ba1de69d5a54e7&X-Amz-SignedHeaders=host&x-id=GetObject)


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

