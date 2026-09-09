class Utente {
    constructor(username, password, isSospeso = false) {
        this.username = username;
        this.password = btoa(password); // Codifica la password in Base64
        this.isSospeso = isSospeso; //attributo che serve per sospendere l'account in caso di troppi tentativi falliti, di default è false

        //variabile contatore per i tentativi errati di accesso, se supera 3 blocca l'account per 30 secondi
        this.tentativiErrati = 0;
        //variabile contatore per le volte che l'utente ha sbagliato 3 volte la login, se supera le 3 volte l'account viene sospeso
        this.volteBloccato = 0;

        this.tempoBloccoFinoA = 0;
    }
}

// Legge i tentativi dal localStorage; se non esistono, parte da 0, se l'utente riesce a fare la login si azzerano


// --- GESTIONE DELL'ACCESSO (In index.html) ---
function gestisciAccesso() {

    const usernameInput = document.getElementById('username-text').value.trim();
    const passwordInput = document.getElementById('password-text').value;

    // se ci sono errori nei campi, non permetto la login
    if (!controllaCampi(usernameInput, passwordInput, false)) {
        return; 
    }

    /* cerchiamo nel local storage se esiste un utente con quel prefisso ed username,
       se lo trova restituisce i dati in formato JSON
       se non lo trova restituisce null */
    const utenteEsistente = localStorage.getItem(`user_${usernameInput}`);

    if (utenteEsistente) {
        /* se l'utente esiste, converto l'utente trovato da JSON a un oggetto javascript */
        let datiUtente = JSON.parse(utenteEsistente);

        // controllo se l'account è sospeso, in caso affermativo mostro un messaggio e blocco l'accesso
        if (datiUtente.isSospeso === true) {
            alert('Account sospeso definitivamente per troppi tentativi falliti. Contatta l\'amministratore per assistenza.');
            return;
        }

        // Controllo se questo specifico account è attualmente in blocco temporaneo
        const adesso = Date.now();
        const tempoBloccoFinoA = datiUtente.tempoBloccoFinoA || 0;

        // se manca ancora tempo per sbloccare l'account, non permetto la login
        if (adesso < tempoBloccoFinoA) {
            const secondiRimanenti = Math.ceil((tempoBloccoFinoA - adesso) / 1000);
            alert(`Questo account è temporaneamente bloccato. Attendi ancora ${secondiRimanenti} secondi.`);
            return;
        }

        /* se la password codificata in base 64 coincide con quella archiviata
            allora l'accesso è consentito, salvando la sessione e reindirizzando alla pagina principale
            altrimenti viene mostrato un messaggio di errore, incrementando il contatore dei tentativi errati 
            e mostrando i tentativi rimasti
        */
        if (btoa(passwordInput) === datiUtente.password) {
            alert('Accesso eseguito con successo!');
            
            // Azzeramento dei contatori dell'utente e aggiornamento del localStorage
            datiUtente.tentativiErrati = 0;
            datiUtente.volteBloccato = 0;
            datiUtente.tempoBloccoFinoA = 0;
            localStorage.setItem(`user_${usernameInput}`, JSON.stringify(datiUtente));

            sessionStorage.setItem('sessioneAttiva', usernameInput);
            window.location.href = 'dashboard.html'; 
            return;
        } else {
            // Password errata: incremento la variabile contatore dell'utente per i tentativi errati di accesso
            datiUtente.tentativiErrati = (datiUtente.tentativiErrati || 0) + 1;
            alert(`Password errata. Tentativi rimasti per questo account: ${Math.max(0, 3 - datiUtente.tentativiErrati)}`);
        }

        // se sono stati fatti 3 o più tentativi errati di accesso su questo account, si blocca temporaneamente
        if (datiUtente.tentativiErrati >= 3) {
            // variabile contatore per le volte che l'utente ha sbagliato 3 volte la login
            datiUtente.volteBloccato = (datiUtente.volteBloccato || 0) + 1;

            // Azzeriamo i tentativi errati dell'utente al momento del blocco temporaneo
            datiUtente.tentativiErrati = 0;

            // variabile che indica la durata del blocco dell'account (in millisecondi)
            let durataBloccoMs = 0;

            if (datiUtente.volteBloccato === 1) {
                durataBloccoMs = 30000; // 30 secondi
                alert('Account temporaneamente bloccato per 30 secondi per troppi tentativi falliti.');
            } else if (datiUtente.volteBloccato === 2) {
                durataBloccoMs = 60000; // 1 minuto
                alert('Account temporaneamente bloccato per 1 minuto per troppi tentativi falliti.');
            } else if (datiUtente.volteBloccato === 3) {
                durataBloccoMs = 300000; // 5 minuti
                alert('Account temporaneamente bloccato per 5 minuti per troppi tentativi falliti.');
            } else if (datiUtente.volteBloccato >= 4) {
                // se supera le 3 volte l'account viene sospeso definitivamente
                datiUtente.isSospeso = true;
                alert('Account sospeso definitivamente per troppi tentativi falliti. Contatta l\'amministratore.');
            }

            // Salvo il timestamp futuro fino a cui il login per questo utente sarà bloccato
            if (!datiUtente.isSospeso) {
                datiUtente.tempoBloccoFinoA = Date.now() + durataBloccoMs;
            }
        }

        // Salvo nel localStorage lo stato aggiornato dell'utente
        localStorage.setItem(`user_${usernameInput}`, JSON.stringify(datiUtente));

    } else {
        // Se l'username non esiste nel sistema
        alert('Username non trovato.');
    }
}


// --- REINDIRIZZAMENTO ALLA REGISTRAZIONE ---
function vaiAllaRegistrazione() {
    window.location.href = 'registrazione.html';
}


// --- GESTIONE DELLA REGISTRAZIONE (In registrazione.html) ---
function gestisciRegistrazione() {
    const usernameInput = document.getElementById('username-text').value;
    const passwordInput = document.getElementById('password-text').value;

    // Evita di registrare utenti con il nome di variabili usate nello storage
    if (usernameInput === 'tentativiErrati' || usernameInput === 'volteBloccato' || usernameInput === 'tempoBloccoFinoA') {
        alert('Nome utente non disponibile. Scegli un altro username.');
        return;
    }

    if (!controllaCampi(usernameInput, passwordInput, true)) {
        return;
    }
    
    const utenteEsistente = localStorage.getItem(`user_${usernameInput}`);

    if (utenteEsistente) {
        alert('Utente già esistente. Scegli un username diverso o accedi con quello esistente.');
    } else {
        const nuovoUtente = new Utente(usernameInput, passwordInput);
        localStorage.setItem(`user_${usernameInput}`, JSON.stringify(nuovoUtente));
        alert('Registrazione avvenuta con successo. Ora verrai reindirizzato al login.');
        window.location.href = 'index.html'; // Reindirizza al login dopo aver creato l'account
    }
}


// --- CONTROLLO DEI CAMPI DI INPUT ---
function controllaCampi(usernameInput, passwordInput, isRegistrazione) {
    //variabili per i controlli sulla password
    let pswContainsNumber = false;
    let pswContainsSpecial = false;
    let pswContainsUpper = false;
    let pswContainsLower = false;

    //stringa con i caratteri speciali consentiti per la password
    const specialChars = "!@#$%^&*(),.?\":{}|<>-_[]";

    //controlli per l'username
    if (usernameInput === '' || passwordInput === '') {
        alert('Per favore, inserisci sia username che password.');
        return false;
    }

    if (!isRegistrazione) {
        return true; //se è una login, non faccio ulteriori controlli sui campi
    }
    
    //---CONTROLLI PER L'USERNAME NELLA REGISTRAZIONE---
    if (usernameInput.length < 5) {
        alert('L\'username deve contenere almeno 5 caratteri.');
        return false;
    }

    for (let i = 0; i < usernameInput.length; i++) {
        //controllo per gli spazi
        if (usernameInput[i] === ' ') {
            alert('L\'username non può contenere spazi.');
            return false;
        }
    }

    //---CONTROLLI PER LA PASSWORD NELLA REGISTRAZIONE---
    if (passwordInput.length < 8) {
        alert('La password deve contenere almeno 8 caratteri.');
        return false;
    }

    for (let i = 0; i < passwordInput.length; i++) {
        //controllo per gli spazi
        if (passwordInput[i] === ' ') {
            alert('La password non può contenere spazi.');
            return false;
        }
        //controllo per almeno un numero
        if (passwordInput[i] >= '0' && passwordInput[i] <= '9') {
            pswContainsNumber = true;
        }
        //controllo per almeno una lettera maiuscola
        if (passwordInput[i] >= 'A' && passwordInput[i] <= 'Z') {
            pswContainsUpper = true;
        }
        //controllo per almeno una lettera minuscola
        if (passwordInput[i] >= 'a' && passwordInput[i] <= 'z') {
            pswContainsLower = true;
        }
        //controllo per almeno un carattere speciale
        if (specialChars.includes(passwordInput[i])) {
            pswContainsSpecial = true;
        }
    }
   
    if (!pswContainsNumber) {
        alert('La password deve contenere almeno un numero.');
        return false;
    }

    if (!pswContainsSpecial) {
        alert('La password deve contenere almeno un carattere speciale.');
        return false;
    }

    if (!pswContainsUpper) {
        alert('La password deve contenere almeno una lettera maiuscola.');
        return false;
    }

    if (!pswContainsLower) {
        alert('La password deve contenere almeno una lettera minuscola.');
        return false;
    }

    return true;
}