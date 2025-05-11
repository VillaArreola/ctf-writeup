---
title: "Test2"
platform: "HTB"
publishedAt: 2025-05-10
cover: "/images/ctf/Mi primer wt.webp"
---

## 🗓️ Fecha


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/5e19dbac-6f69-4b8e-8f73-8ef638bf2a2c/029dc9b3-ea79-4ddd-a86e-16d617e49114/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SQPKVDZ5%2F20250511%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250511T034510Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAsaCXVzLXdlc3QtMiJIMEYCIQD%2FL7Hbyo4uysqCy3M44W7gsfy5QIz1FUiH12vrtc2DaAIhAKKGTOqgmRoAiwpIf0CKFQT7hEjVDBvDVrVNjyOt%2FTpPKogECLT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyqMX%2B%2F8QQVgAxtXDIq3AOTH9J4eHj19%2FwkUEqr6%2F0sUWXVTEKQCF1eCuKwMB6%2BxdgQAAIXJFs0xPpdT42QNxALz3TgJHoE5SL6GLUL63L7o4aR%2FLwkV3ya4nEq4Yu%2F8YevqtKxYJrP70AFswwH%2F9uv9iHjZS0XFpxNrk3Jm4%2B%2FNUX8sWjjF9CYi5%2BwDzrw95uK6qR%2F2TKPrYZYOPMcM6PyM3w%2FqVOQjQe2ieKZKqS77ea%2B8zdk65ISv6mGU8Pc5a1x20DLg8YuLRkVt%2BTLSjbC1J%2B2Cu1ozGPDi04UYaDL8JzSTLHmYJBWtEfpQGSHxH614xxyYJSY3sl46nxWRgqhVM3yWRaB8OUvJ0iJfobjiOdLyve6YTMX%2BGsLBQdjYSiQExXP8rQfWdpEpkmR%2FltsURpMb0i7CrZLMyzoSaVUulbeAzECi1AlbGjGn8XldtcoaBvk9bHCivcOu5LpjgmqodsCY035WTD%2FMViL3V9OWNWGJZCO%2B04lCWQFMltDQSNyj%2B8%2BI4C0GkWzk6oS2quulAtwHKqiBCKVVUfEX2XBt6ARrgHog6l3l%2B1d3a0lHKXa%2FS%2FjdLI8zXNPj2ZXkiA1mZRyDQ%2BBzB4d1z8PnSV9Z6rW5c71MrZ%2FmKXvewQz9drenOQntQC7nFxKtTCEnYDBBjqkAZZWDj57nJFcXlCxjsw9e48aCw3hfGGG49xKmyaX6aioqw%2B%2BiPTwPGTfo6aKRj7TeT8QnSoyVku53x8ML%2Ftrc8ze6tuu4d%2FoRcHlCVnzcLz%2FkRBOdcGwP9BHLXZdvx99dTjPYp%2FRxBqN6jwM9N9a5VMZrk4xxdxgclQ1jZbplbCQUUxuMBh19TSF2gf%2FM1cfFIoOPnbL5RUr9xvWP%2B%2FASqssxg59&X-Amz-Signature=e978eccc7e26e289b1b1a4930af8753043a26c9478a7f032a68b4615e9bb168c&X-Amz-SignedHeaders=host&x-id=GetObject)


[Coloca la fecha o nombre de la plataforma: TryHackMe, HTB, etc.]


---


## 🎯 Objetivo


Breve descripción del reto:

- ¿Qué se busca? (ej. recuperar flags, escalar privilegios, rastrear malware, etc.)
- ¿Cuál es el entorno? (WordPress, Linux, web app, red, etc.)

---


## 🛠️ Herramientas utilizadas

- `nmap`, `hydra`, `gobuster`, `ffuf`
- `curl`, `wpscan`, `sqlmap`
- Scripts de GitHub o exploits públicos
- `grep`, `find`, `ps`, `systemctl`, etc.
- [Otras herramientas relevantes]

---


## 🔍 Reconocimiento


### Escaneo de puertos


```shell
nmap -sCV -p- [TARGET IP]
```


Resultados clave:

- [Puerto] – [Servicio] – [Versión]
- [Puerto] – ...

---


## 🔐 Enumeración

- [Tecnologías detectadas]
- Usuarios encontrados
- Vulnerabilidades conocidas
- Temas/plugins si es WordPress

---


## 💣 Explotación

- CVE explotado (si aplica): [CVE-XXXX-XXXX]
- Enlace al exploit
- Comando utilizado:

```shell
python3 exploit.py --target ... --cmd ...
```


---


## 🐚 Acceso obtenido

- Tipo de acceso: [Shell, Reverse Shell, etc.]
- Usuario: [www-data, ubuntu, root...]
- Flag obtenida (si aplica):

```plain text
THM{flag_aqui}
```


---


## 🧪 Post-explotación

- Procesos sospechosos detectados
- Servicios no documentados
- Directorios maliciosos
- Backdoors o miners activos

---


## 💰 Análisis de malware / miner

- Ruta del binario o script: `/lib/NetworkManager/...`
- Archivo de log: `xxxx.xxxx`
- Wallet address: `[dirección]`
- Indicadores encontrados

---


## 🕵️ OSINT / Attribution

- Wallet rastreada en: [blockchain explorer]
- Relacionado con: **[Grupo de amenazas]**

---


## 🧩 Indicadores de compromiso (IOCs)


| Tipo     | Valor            |
| -------- | ---------------- |
| Wallet   | `bc1...`         |
| Archivo  | `inet.conf`      |
| Servicio | `ubuntu.service` |
| Binario  | `nm-inet-dialog` |


---


## 📌 Lecciones aprendidas

- Siempre identificar tecnologías antes de forzar accesos
- Buscar CVEs asociadas a plugins/temas detectados
- Validar credenciales con `Location:` en lugar de mensajes de error
- Rastrear artefactos con `find`, `grep`, `strings` y `base64`

---


## 🏁 Conclusión


Un reto completo que combinó técnicas reales de:

- Pentesting web
- Explotación de CVE
- Análisis de malware
- Investigación OSINT

Ideal para practicar habilidades ofensivas y forenses.

