class Utente {
    constructor(username, password, isSospeso = false) {
        this.username = username;
        this.password = btoa(password); // Codifica la password in Base64
        this.isSospeso = isSospeso; //attributo che serve per sospendere l'account in caso di troppi tentativi falliti, di default è false
    }
}

//variabile cntatore per i tentativi errati di accesso, se supera 3 blocca l'account per 30 secondi
let tentativiErrati = 0;
let volteBloccato = 0;
let isUtenteInAttesa = false; //variabile per evitare che l'utente possa fare più tentativi durante il periodo di blocco

function gestisciAccesso() {

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    //se l'utente è in attesa, non permetto la login
    if (isUtenteInAttesa) {
        alert("Il sistema è temporaneamente bloccato. Attendi che il timer scada.");
        return;
    }

    //se ci sono errori nei campi, non permetto la login
    if (!controllaCampi(usernameInput, passwordInput,false)) {
        return; 
    }

    /*cerchiamo nel local storage se esiste un utentecon quell'username,
      se lo trova restituisce i dati in formato JSON
      se non lo trova restituisce null*/
    const utenteEsistente = localStorage.getItem(usernameInput);

    /*se l'utente esiste, converto l'utente trovato da JSON a un oggetto javascript */
    if (utenteEsistente) {
        const datiUtente = JSON.parse(utenteEsistente);

        //controllo se l'account è sospeso, in caso affermativo mostro un messaggio e blocco l'accesso
        if (datiUtente.isSospeso === true) {
            alert('Account sospeso definitivamente per troppi tentativi falliti. Contatta l\'amministratore per assistenza.');
            return;
        }

        /*se la password codificata in base 64 coincide con quella archiviata
            allora l'accesso è consentito, salvando la sessione e reindirizzando alla pagina principale
            altrimenti viene mostrato un messaggio di errore, incrementando il contatore dei tentativi errati 
            e mostrando i tentativi rimasti
        */
        if (btoa(passwordInput) === datiUtente.password) {
            alert('Accesso eseguito con successo!');
            tentativiErrati = 0;
            volteBloccato = 0;
            sessionStorage.setItem('sessioneAttiva', usernameInput);
            window.location.href = 'dashboard.html'; 
            return;
        } else {
            tentativiErrati++;
            alert(`Password errata. Tentativi rimasti: ${3 - tentativiErrati}`);
        }
    } else {
        tentativiErrati++; 
        alert(`Username non trovato. Tentativi rimasti: ${3 - tentativiErrati}`);
    }

    if (tentativiErrati >= 3) {
        volteBloccato++;

        //se è la prima volta che viene bloccato, l'account viene bloccato per 30 secondi
        if (volteBloccato === 1) {
            isUtenteInAttesa = true;
            alert('Account temporaneamente bloccato per troppi tentativi falliti. Ricarica la pagina per riprovare.');
            
            setTimeout(() => {
                tentativiErrati = 0;
                isUtenteInAttesa = false;
            }, 30000);
            return; 
        }

        //se è la seconda volta che viene bloccato, l'account viene bloccato per 1 minuto
        if (volteBloccato === 2) {
            isUtenteInAttesa = true;
            alert('Account temporaneamente bloccato per troppi tentativi falliti. Ricarica la pagina per riprovare.');

            setTimeout(() => {
                tentativiErrati = 0;
                isUtenteInAttesa = false;
            }, 60000);
            return;
        }

        //se è la terza volta che viene bloccato, l'account viene bloccato per 5 minuti
        if (volteBloccato === 3) {
            isUtenteInAttesa = true;
            alert('Account temporaneamente bloccato per troppi tentativi falliti. Ricarica la pagina per riprovare.');
             
            setTimeout(() => {
                tentativiErrati = 0;
                isUtenteInAttesa = false;
            }, 300000);
            return;
        }

        if (volteBloccato >= 4) {
            //è la quarta volta che viene bloccato, l'account viene sospeso definitivamente
            //sospendo l'account, aggiornando l'oggetto utente nel local storage
            isUtenteInAttesa = true; 
            
            if (utenteEsistente) {
                const datiUtente = JSON.parse(utenteEsistente);
                datiUtente.isSospeso = true;
                localStorage.setItem(usernameInput, JSON.stringify(datiUtente));
            }
            
            alert('Account sospeso definitivamente per troppi tentativi falliti. Contatta l\'amministratore per assistenza.');
            return; 
        }
    }
}

function gestisciRegistrazione() {
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    if (!controllaCampi(usernameInput, passwordInput,true)) {
        return;
    }
    
    const utenteEsistente = localStorage.getItem(usernameInput);

    if (utenteEsistente) {
        alert('Utente già esistente. Scegli un username diverso o accedi con quello esistente.');
    } else {
        const nuovoUtente = new Utente(usernameInput, passwordInput);
        localStorage.setItem(usernameInput, JSON.stringify(nuovoUtente));
        alert('Registrazione avvenuta con successo. Ora puoi accedere.');
    }
}

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

    if(!isRegistrazione) {
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
    if(passwordInput.length < 8) {
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
        if(passwordInput[i] >= '0' && passwordInput[i] <= '9') {
            pswContainsNumber = true;
        }
        //controllo per almeno una lettera maiuscola
        if(passwordInput[i] >= 'A' && passwordInput[i] <= 'Z') {
            pswContainsUpper = true;
        }
        //controllo per almeno una lettera minuscola
        if(passwordInput[i] >= 'a' && passwordInput[i] <= 'z') {
            pswContainsLower = true;
        }
        //controllo per almeno un carattere speciale
        if (specialChars.includes(passwordInput[i])) {
            pswContainsSpecial = true;
        }
    }
   
    if(!pswContainsNumber) {
        alert('La password deve contenere almeno un numero.');
        return false;
    }

    if(!pswContainsSpecial) {
        alert('La password deve contenere almeno un carattere speciale.');
        return false;
    }

    if(!pswContainsUpper) {
        alert('La password deve contenere almeno una lettera maiuscola.');
        return false;
    }

    if(!pswContainsLower) {
        alert('La password deve contenere almeno una lettera minuscola.');
        return false;
    }

    return true;
}
