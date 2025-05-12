---
title: "Test2"
platform: "HTB"
publishedAt: 2025-05-10
cover: "/images/ctf/nota6-cover.webp"
preview: "btrbrtbtrbrtbt"
tags: [rockyou]
link: "Sin link"
---

## 🗓️ Fecha


![image.png](/images/ctf/nota6-0.webp)


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

