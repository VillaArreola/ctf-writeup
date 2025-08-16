---
title: "W1seGu"
platform: "THM"
publishedAt: 2025-05-15
cover: "/images/ctf/w1seguy-cover.webp"
preview: "Un hombre sabio dijo una vez que la respuesta suele ser tan clara como el día."
tags: []
link: "https://tryhackme.com/room/"
toc:
  - text: "🧱 TryHackMe – XOR CTF | Write-up Técnico"
    id: "tryhackme-xor-ctf-write-up-tecnico"
  - text: "🔍 Análisis del servicio"
    id: "analisis-del-servicio"
  - text: "🛠️ Técnica utilizada: Ataque de texto claro conocido (Known-Plaintext Attack)"
    id: "tecnica-utilizada-ataque-de-texto-claro-conocido-known-plaintext-attack"
  - text: "🔓 Script utilizado"
    id: "script-utilizado"
  - text: "✅ Flags obtenidas"
    id: "flags-obtenidas"
  - text: "🧠 Lecciones aprendidas"
    id: "lecciones-aprendidas"
  - text: "💡 Recursos útiles"
    id: "recursos-utiles"
---

## 🧱 TryHackMe – XOR CTF | Write-up Técnico


### 🖥️ Descripción del reto


Nos enfrentamos a un servidor remoto que entrega un mensaje cifrado con XOR cada vez que nos conectamos por el puerto **1337**. El mensaje contiene una flag cifrada y nos reta a encontrar la clave XOR usada. Una vez que ingresamos la clave correcta, nos entrega la **flag 1**. Posteriormente, al repetir el proceso, conseguimos la **flag 2**.


---


## 🔍 Análisis del servicio


Puerto detectado:


```shell
bash
CopyEdit
1337/tcp open unknown
```


Banner recibido por `nc`:


```plain text
vbnet
CopyEdit
This XOR encoded text has flag 1: 383f193d485d1638284c290f20074c1843372d5b2d19267559003b2d2e6d1e032d764d1e0f1b3445
What is the encryption key?
```


---


## 🛠️ Técnica utilizada: Ataque de texto claro conocido (Known-Plaintext Attack)


Sabemos que los flags de TryHackMe siempre comienzan con `"THM{"`, lo que nos permite aplicar una inversión del XOR:


```python
python
CopyEdit
clave[i] = cifrado[i] ^ texto_claro[i]
```


Esto nos permitió deducir 4 caracteres de la clave sin fuerza bruta completa.


---


## 🔓 Script utilizado


```python
python
CopyEdit
from binascii import unhexlify

xor_output = "383f193d485d1638284c290f20074c1843372d5b2d19267559003b2d2e6d1e032d764d1e0f1b3445"
known_plain = "THM{"

cipher = unhexlify(xor_output)

# Obtener los primeros caracteres de la clave
key = ''.join(chr(cipher[i] ^ ord(known_plain[i])) for i in range(len(known_plain)))

# Probar todas las opciones para el último carácter
import string
for last in string.ascii_letters + string.digits:
    full_key = (key + last)
    decrypted = ''.join(chr(cipher[i] ^ ord(full_key[i % len(full_key)])) for i in range(len(cipher)))
    if decrypted.startswith("THM{"):
        print("Clave encontrada:", full_key)
        print("Flag:", decrypted)
        break
```


---


## ✅ Flags obtenidas


### Flag 1:


```plain text
CopyEdit
THM{p1alntExtAtt4ckcAnr3alLyhUrty0urxOr}
```


### Flag 2:


```plain text
CopyEdit
THM{BrUt3_ForC1nG_XOR_cAn_B3_FuN_nO?}
```


---


## 🧠 Lecciones aprendidas

- Si el cifrado XOR usa una clave corta y repetida, es muy vulnerable si conocemos parte del texto plano.
- No siempre hace falta fuerza bruta total. Si usás lo que sabés (como la estructura de un flag), podés resolverlo en segundos.
- Automatizar con Python ahorra muchísimo tiempo.

---


## 💡 Recursos útiles

- [Ataque de texto claro conocido (Wikipedia)](https://en.wikipedia.org/wiki/Known-plaintext_attack)
- `binascii.unhexlify` y `ord/chr` en Python para manipular bytes
- Herramientas como `nc`, `vim`, y `sshpass` para pruebas rápidas

---

