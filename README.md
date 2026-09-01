# 🎥 CineForum | Movie Review App
**Projekt iz kolegija: Web programiranje**

CineForum je moderna full-stack web aplikacija namijenjena ljubiteljima filmova i serija. Korisnicima omogućuje pretraživanje i otkrivanje filmova ili serija, pregled detaljnih informacija, ocjenjivanje i pisanje recenzija te pregled profila drugih korisnika. Aplikacija koristi podatke iz **TMDb** i **OMDb** servisa, dok se recenzije i korisnički podaci spremaju u MongoDB bazu.

---

## 🚀 Ključne funkcionalnosti

* **Otkrivanje filmova:** Početna stranica prikazuje nove, popularne i najbolje ocijenjene filmove dohvaćene putem TMDb API-ja.
* **Pretraživanje filmova:** Pretraga filmova po naslovu uz dohvat rezultata i detaljnih podataka putem OMDb API-ja.
* **Detalji filma:** Prikaz naslova, godine izlaska, trajanja, žanrova, opisa, IMDb ocjene, glumaca, redatelja i ostalih dostupnih podataka.
* **Recenzije i ocjenjivanje:** Prijavljeni korisnici mogu dodavati, uređivati i brisati vlastite recenzije te ocijeniti film ocjenom od 1 do 10.
* **Download recenzija:** Korisnik može preuzeti vlastite recenzije u JSON datoteci.

---

## 🛠 Tech Stack

### Frontend (Client)
* **React (Vite)** – izrada brzog i reaktivnog korisničkog sučelja.
* **TypeScript** – tipizacija i sigurnije održavanje frontend koda.
* **React Router** – navigacija između stranica unutar SPA aplikacije.
* **Bootstrap / React-Bootstrap** – responzivni dizajn i UI komponente.
* **React Bootstrap Icons** – ikone korištene kroz aplikaciju.
* **Socket.IO Client** – komunikacija sa serverom u stvarnom vremenu.

### Backend (Server)
* **Node.js** – runtime okruženje za izvršavanje JavaScripta na poslužitelju.
* **Express** – REST API, middleware i obrada HTTP zahtjeva.
* **MongoDB** – baza podataka za korisnike i recenzije.
* **JSON Web Token (JWT)** – autentifikacija i zaštita privatnih API ruta.
* **Node.js Crypto / PBKDF2** – hashiranje i provjera korisničkih lozinki.
* **Socket.IO** – real-time sinkronizacija recenzija između korisnika.

### Vanjski servisi
* **TMDb API** – novi, popularni i najbolje ocijenjeni filmovi te povezivanje TMDb i IMDb identifikatora.
* **OMDb API** – pretraživanje filmova i dohvat detaljnih filmskih podataka.
* **Vercel** – deployment frontend i backend aplikacije.

---

## 🌐 Deployment

Aplikacija je deployana pomoću Vercela.

### Frontend

https://cine-forum.vercel.app/

### Backend

https://cine-forum-server.vercel.app/

---


### Stranica se nalazi na https://cine-forum.vercel.app/
