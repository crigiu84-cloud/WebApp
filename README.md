#VAULT - Secure Password Hub

**Vault** è una Web Application per la gestione sicura e l'archiviazione locale delle credenziali di accesso. L'applicazione offre un'interfaccia responsive e include moduli per la registrazione/login, un generatore avanzato di password casuali, un analizzatore di robustezza in tempo reale e un archivio personalizzato per ciascun utente.

---

##Caratteristiche Principali

* **Gestione Autenticazione & Sicurezza Accessi:**
  * Validazione dei requisiti password in tempo reale (lunghezza, maiuscole, minuscole, numeri, caratteri speciali e assenza di spazi).
  * Offuscamento base64 delle password utente prima del salvataggio nel database locale.
  * Meccanismo di blocco temporaneo progressivo (30s, 1m, 5m) dopo 3 tentativi di login falliti.
  * Sospensione permanente dell'account al superamento dei 4 blocchi temporanei.

* **Dashboard Overview:**
  * Form dinamico per la creazione e la modifica (CRUD) delle credenziali salvate.
  * Tabella interattiva per visualizzare, mostrare/nascondere, copiare negli appunti o eliminare le credenziali.

* **Password Generator & Strength Analyzer:**
  * Generatore casuale configurabile tramite slider (lunghezza 8-32 caratteri) e selettori per tipologie di caratteri.
  * Grafico circolare dinamico (*conic-gradient*) che assegna un punteggio di sicurezza (0-100%) con etichette visive (WEAK, MEDIUM, STRONG).

* **Vault Completo:**
  * Sezione dedicata alla consultazione rapida con barra di ricerca in tempo reale per sito web o username.

---

##Architettura e Struttura File

```text
├── login.html              # Interfaccia di autenticazione (Login)
├── registrazione.html      # Form di creazione nuovo account
├── dashboard.html          # Layout principale (Dashboard, Generator, Vault)
├── styleLogin.css          # Stili per la schermata di Login e Registrazione
├── styleDashboard.css      # Stili per la Dashboard e la Sidebar
├── js/
│   ├── auth.js             # Logica di autenticazione, sicurezza e validazione
│   └── dashboard.js        # Gestione UI tab, generatore password, CRUD vault e ricerca
└── immagini/
    └── logoSenzaSfondo.png # Logo dell'applicazione

**Persistenza Dati (Web Storage)**
L'applicazione non richiede un backend e utilizza esclusivamente le API del browser:

localStorage: Utilizzato per archiviare gli account utenti (user_<username>) e le tabelle di credenziali individuali (vault_<username>).

sessionStorage: Mantiene la chiave sessioneAttiva per controllare la sessione di navigazione corrente dell'utente loggato.

**Guida all'Uso**
Apri il file login.html in qualsiasi browser web moderno.

Clicca su Registrati per creare un nuovo account verificando i requisiti di sicurezza.

Effettua il login per accedere alla Dashboard Overview.

Naviga attraverso la sidebar laterale per generare nuove password o consultare l'archivio completo.
