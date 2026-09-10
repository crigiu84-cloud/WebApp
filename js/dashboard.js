// --- CAMBIO SEZIONE (Menu Sidebar) ---
function cambiaSezione(nomeSezione) {
    // nascondo tutte le sezioni
    let sezioni = document.getElementsByClassName('tab-content');
    for (let i = 0; i < sezioni.length; i++) {
        sezioni[i].classList.remove('active');
    }

    // tolgo la selezione a tutti i pulsanti del menu
    let menuItems = document.getElementsByClassName('menu-item');
    for (let j = 0; j < menuItems.length; j++) {
        menuItems[j].classList.remove('active');
    }

    // mostro la sezione scelta
    let sezioneScelta = document.getElementById('sezione-' + nomeSezione);
    if (sezioneScelta != null) {
        sezioneScelta.classList.add('active');
    }

    // evidenzio l'elemento del menu cliccato
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    // se l'utente apre il vault, si caricano i dati salvati nell'account
    if (nomeSezione === 'vault') {
        caricaVaultSolaLettura();
    }
}

// --- AGGIORNA IL NUMERO DELLA LUNGHEZZA ---
function aggiornaLunghezza(valore) {
    // aggiorno il testo nell'HTML con il valore attuale dello slider
    document.getElementById('length-val').innerText = valore;
}

// --- GENERA PASSWORD CASUALE ---
function generaPassword() {
    // prendo i valori dello slider e dei vari checkbox
    let lunghezza = document.getElementById('length-slider').value;
    let usaMaiuscole = document.getElementById('chk-uppercase').checked;
    let usaMinuscole = document.getElementById('chk-lowercase').checked;
    let usaNumeri = document.getElementById('chk-numbers').checked;
    let usaSimboli = document.getElementById('chk-symbols').checked;

    /* creo una stringa unica contenente tutti i caratteri 
       disponibili in base ai checkbox selezionati */
    let caratteri = '';
    if (usaMaiuscole == true) {
        caratteri = caratteri + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (usaMinuscole == true) {
        caratteri = caratteri + 'abcdefghijklmnopqrstuvwxyz';
    }
    if (usaNumeri == true) {
        caratteri = caratteri + '0123456789';
    }
    if (usaSimboli == true) {
        caratteri = caratteri + '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }

    // se nessun checkbox è spuntato, blocco la funzione e avviso l'utente
    if (caratteri == '') {
        alert('Seleziona almeno un tipo di carattere!');
        return;
    }

    // genero la password prendendo caratteri a caso dal pool creato prima
    let password = '';
    for (let i = 0; i < lunghezza; i++) {
        let posizione = Math.floor(Math.random() * caratteri.length);
        password = password + caratteri.charAt(posizione);
    }

    // mostro la password generata a schermo
    document.getElementById('output-password').innerText = password;
}

// --- COPIA PASSWORD NEGLI APPUNTI ---
function copiaGenerata() {
    // prendo il testo della password generata e lo salvo negli appunti di sistema
    let testo = document.getElementById('output-password').innerText;
    navigator.clipboard.writeText(testo);
    alert('Password copiata!');
}

// --- ANALISI DELLA ROBUSTEZZA PASSWORD ---
function analizzaPassword(password) {
    let punteggio = 0;

    // controllo se la password rispetta la lunghezza minima di 8 caratteri
    let haMinimo8 = false;
    if (password.length >= 8) {
        haMinimo8 = true;
        punteggio = punteggio + 25;
    }

    // controllo se contiene almeno una lettera maiuscola
    let haMaiuscola = /[A-Z]/.test(password);
    if (haMaiuscola == true) {
        punteggio = punteggio + 25;
    }

    // controllo se contiene almeno un numero
    let haNumero = /[0-9]/.test(password);
    if (haNumero == true) {
        punteggio = punteggio + 25;
    }

    // controllo se contiene almeno un carattere speciale
    let haSimbolo = /[!@#$%^&*(),.?":{}|<>_\-\[\]]/.test(password);
    if (haSimbolo == true) {
        punteggio = punteggio + 25;
    }

    // imposto il colore dell'arco in base alla percentuale raggiunta
    let colore = 'rgba(255, 255, 255, 0.1)';

    if (punteggio > 0 && punteggio < 25) {
        colore = '#ef4444'; // rosso se è molto debole
    } else if (punteggio >= 25 && punteggio < 50) {
        colore = '#f97316'; // arancione se è sufficiente
    } else if (punteggio >= 50 && punteggio < 75) {
        colore = '#eab308'; // giallo se è media
    } else if (punteggio >= 75) {
        colore = '#22c55e'; // verde se è forte
    }

    // aggiorno la percentuale nel testo centrale
    document.getElementById('strength-percentage').innerText = punteggio + '%';

    // applico lo sfondo conic-gradient per disegnare l'arco colorato
    let cerchio = document.getElementById('gauge-circle');
    cerchio.style.background = 'conic-gradient(' + colore + ' ' + punteggio + '%, rgba(255, 255, 255, 0.1) ' + punteggio + '% 100%)';

    // aggiorno il testo dell'etichetta (WEAK / MEDIUM / STRONG)
    let label = document.getElementById('strength-label');
    label.style.color = (punteggio == 0) ? '#64748b' : colore;

    if (punteggio < 50) {
        label.innerText = 'WEAK';
    } else if (punteggio < 75) {
        label.innerText = 'MEDIUM';
    } else {
        label.innerText = 'STRONG';
    }

    // aggiorno la lista dei requisiti (Sì/No) da mostrare nell'HTML
    let testo8 = haMinimo8 ? 'Sì' : 'No';
    let testoMaiuscola = haMaiuscola ? 'Sì' : 'No';
    let testoNumero = haNumero ? 'Sì' : 'No';
    let testoSimbolo = haSimbolo ? 'Sì' : 'No';

    let lista = document.getElementById('analysis-list');
    lista.innerHTML = 
        '<li>Lunghezza minima ok: <span>' + testo8 + '</span></li>' +
        '<li>Maiuscole incluse: <span>' + testoMaiuscola + '</span></li>' +
        '<li>Numeri inclusi: <span>' + testoNumero + '</span></li>' +
        '<li>Caratteri speciali: <span>' + testoSimbolo + '</span></li>';
}

// Variabile globale per capire se stiamo creando una nuova credenziale o modificandone una esistente
// Se è null -> Creazione | Se contiene un ID -> Modifica
let idCredenzialeInModifica = null;

// --- CARICAMENTO INIZIALE DELLA PAGINA ---
window.onload = function() {
    let utenteLoggato = sessionStorage.getItem('sessioneAttiva');
    
    if (utenteLoggato == null) {
        window.location.href = 'login.html';
        return;
    }

    let elementoNome = document.getElementById('nome-utente-loggato');
    if (elementoNome != null) {
        elementoNome.innerText = utenteLoggato;
    }

    caricaCredenziali();
};


// --- GESTIONE SALVATAGGIO / AGGIORNAMENTO CREDENZIALE ---
function salvaCredenziale(event) {
    event.preventDefault();

    let utenteLoggato = sessionStorage.getItem('sessioneAttiva');

    let sito = document.getElementById('sito-web').value;
    let usernameSito = document.getElementById('username-sito').value;
    let passwordSito = document.getElementById('password-sito').value;

    if (sito == '' || usernameSito == '' || passwordSito == '') {
        alert('Compila tutti i campi!');
        return;
    }

    let chiaveVault = 'vault_' + utenteLoggato;
    let datiSalvati = localStorage.getItem(chiaveVault);
    let listaCredenziali = [];

    if (datiSalvati != null) {
        listaCredenziali = JSON.parse(datiSalvati);
    }

    // CONTROLLO: Stiamo modificando una credenziale esistente o ne stiamo aggiungendo una nuova?
    if (idCredenzialeInModifica != null) {
        // --- MODALITÀ AGGIORNAMENTO ---
        for (let i = 0; i < listaCredenziali.length; i++) {
            if (listaCredenziali[i].id == idCredenzialeInModifica) {
                listaCredenziali[i].sito = sito;
                listaCredenziali[i].username = usernameSito;
                listaCredenziali[i].password = passwordSito;
                break;
            }
        }
        alert('Credenziale aggiornata con successo!');
    } else {
        // --- MODALITÀ NUOVO INSERIMENTO ---
        let nuovaCredenziale = {
            id: Date.now(),
            sito: sito,
            username: usernameSito,
            password: passwordSito
        };
        listaCredenziali.push(nuovaCredenziale);
        alert('Password salvata con successo!');
    }

    // Salviamo la lista aggiornata nel localStorage
    localStorage.setItem(chiaveVault, JSON.stringify(listaCredenziali));

    // Resettiamo il form e ripristiniamo lo stato iniziale
    resetForm();

    // Ricarichiamo la tabella
    caricaCredenziali();
}


// --- VISUALIZZAZIONE DELLE CREDENZIALI IN TABELLA ---
function caricaCredenziali() {
    let utenteLoggato = sessionStorage.getItem('sessioneAttiva');
    let tbody = document.getElementById('lista-password');
    
    if (tbody == null) return;

    let chiaveVault = 'vault_' + utenteLoggato;
    let datiSalvati = localStorage.getItem(chiaveVault);
    let listaCredenziali = [];

    if (datiSalvati != null) {
        listaCredenziali = JSON.parse(datiSalvati);
    }

    tbody.innerHTML = '';

    if (listaCredenziali.length == 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nessuna credenziale salvata.</td></tr>';
        return;
    }

    for (let i = 0; i < listaCredenziali.length; i++) {
        let elemento = listaCredenziali[i];

        let urlCompleto = elemento.sito;
        if (urlCompleto.indexOf('http://') !== 0 && urlCompleto.indexOf('https://') !== 0) {
            urlCompleto = 'https://' + urlCompleto;
        }

        let riga = document.createElement('tr');
        
        // Aggiungiamo un cursore a puntatore per far capire che la riga è cliccabile
        riga.style.cursor = 'pointer';

        // Evento click sulla riga per caricare i dati nel form a sinistra
        riga.setAttribute('onclick', 'selezionaPerModifica(' + elemento.id + ')');

        riga.innerHTML = 
            '<td><strong><a href="' + urlCompleto + '" target="_blank" onclick="event.stopPropagation();" style="color: inherit; text-decoration: underline;">' + elemento.sito + '</a></strong></td>' +
            '<td>' + elemento.username + '</td>' +
            '<td>' +
                '<input type="password" value="' + elemento.password + '" id="pass-' + elemento.id + '" readonly style="border:none; background:transparent; color:inherit;">' +
            '</td>' +
            '<td>' +
                '<button type="button" onclick="event.stopPropagation(); mostraNascondiPassword(' + elemento.id + ')" class="btn-icon" title="Mostra/Nascondi">' +
                    '<i class="fa-solid fa-eye" id="icona-' + elemento.id + '"></i>' +
                '</button> ' +
                '<button type="button" onclick="event.stopPropagation(); copiaTesto(\'' + elemento.password + '\')" class="btn-icon" title="Copia Password">' +
                    '<i class="fa-regular fa-copy"></i>' +
                '</button> ' +
                '<button type="button" onclick="event.stopPropagation(); eliminaCredenziale(' + elemento.id + ')" class="btn-icon btn-danger" title="Elimina">' +
                    '<i class="fa-solid fa-trash"></i>' +
                '</button>' +
            '</td>';

        tbody.appendChild(riga);
    }
}


// --- CARICA I DATI DELLA RIGA SELEZIONATA NEL FORM ---
function selezionaPerModifica(id) {
    let utenteLoggato = sessionStorage.getItem('sessioneAttiva');
    let chiaveVault = 'vault_' + utenteLoggato;
    let datiSalvati = localStorage.getItem(chiaveVault);
    let listaCredenziali = JSON.parse(datiSalvati);

    // Cerchiamo l'elemento selezionato tramite l'ID
    for (let i = 0; i < listaCredenziali.length; i++) {
        if (listaCredenziali[i].id == id) {
            // Popoliamo i campi input nel form a sinistra
            document.getElementById('sito-web').value = listaCredenziali[i].sito;
            document.getElementById('username-sito').value = listaCredenziali[i].username;
            document.getElementById('password-sito').value = listaCredenziali[i].password;

            // Salva l'ID dell'elemento che stiamo modificando nella variabile globale
            idCredenzialeInModifica = id;

            // Modifichiamo il testo del pulsante per indicare che siamo in modifica
            let btnSalva = document.getElementById('btn-salva');
            if (btnSalva != null) {
                btnSalva.innerText = 'Aggiorna Credenziale';
                btnSalva.style.backgroundColor = '#f59e0b';
            }
            break;
        }
    }
}


// --- RESET DEL FORM E DELLO STATO ---
function resetForm() {
    document.getElementById('sito-web').value = '';
    document.getElementById('username-sito').value = '';
    document.getElementById('password-sito').value = '';
    
    idCredenzialeInModifica = null;

    let btnSalva = document.getElementById('btn-salva');
    if (btnSalva != null) {
        btnSalva.innerText = 'Salva Credenziale';
        btnSalva.style.backgroundColor = '';
    }
}


// --- MOSTRA O NASCONDI PASSWORD ---
function mostraNascondiPassword(id) {
    let inputPassword = document.getElementById('pass-' + id);
    let icona = document.getElementById('icona-' + id);

    if (inputPassword.type == 'password') {
        inputPassword.type = 'text';
        icona.className = 'fa-solid fa-eye-slash';
    } else {
        inputPassword.type = 'password';
        icona.className = 'fa-solid fa-eye';
    }
}


// --- COPIA LA PASSWORD NEGLI APPUNTI ---
function copiaTesto(testo) {
    navigator.clipboard.writeText(testo);
    alert('Password copiata negli appunti!');
}


// --- ELIMINAZIONE DI UNA CREDENZIALE ---
function eliminaCredenziale(id) {
    let conferma = confirm('Sei sicuro di voler eliminare questa credenziale?');
    if (conferma == false) return;

    let utenteLoggato = sessionStorage.getItem('sessioneAttiva');
    let chiaveVault = 'vault_' + utenteLoggato;
    let datiSalvati = localStorage.getItem(chiaveVault);
    let listaCredenziali = JSON.parse(datiSalvati);

    let nuovaLista = [];
    for (let i = 0; i < listaCredenziali.length; i++) {
        if (listaCredenziali[i].id != id) {
            nuovaLista.push(listaCredenziali[i]);
        }
    }

    localStorage.setItem(chiaveVault, JSON.stringify(nuovaLista));

    if (idCredenzialeInModifica == id) {
        resetForm();
    }

    caricaCredenziali();
}


// --- LOGOUT ---
function effettuaLogout() {
    sessionStorage.removeItem('sessioneAttiva');
    window.location.href = 'login.html';
}


// --- GESTIONE LOGOUT ---
function effettuaLogout() {
    // Rimuoviamo la sessione attiva ed effettuiamo il reindirizzamento
    sessionStorage.removeItem('sessioneAttiva');
    window.location.href = 'login.html';
}

// --- CARICAMENTO DELLA TABELLA VAULT ---
function caricaVaultSolaLettura() {
    // Recupero il nome dell'utente attualmente collegato dalla sessione
    let utenteLoggato = sessionStorage.getItem('sessioneAttiva');
    
    // Recupero l'elemento tbody della tabella del Vault
    let tbody = document.getElementById('lista-vault-sola-lettura');
    
    // Se la tabella non esiste nella pagina corrente, interrompo l'esecuzione
    if (tbody == null) return;

    // Costruisco la chiave univoca usata nel localStorage per l'utente loggato
    let chiaveVault = 'vault_' + utenteLoggato;
    
    // Leggo la stringa JSON salvata nel localStorage
    let datiSalvati = localStorage.getItem(chiaveVault);
    let listaCredenziali = [];

    // Se ci sono dati salvati, converto la stringa JSON in un array JavaScript
    if (datiSalvati != null) {
        listaCredenziali = JSON.parse(datiSalvati);
    }

    // Svuoto il contenuto della tabella prima di ripopolarla
    tbody.innerHTML = '';

    // Se non ci sono credenziali salvate, mostro un messaggio informativo in tabella
    if (listaCredenziali.length == 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Nessuna credenziale salvata nel Vault.</td></tr>';
        return;
    }

    // Ciclo attraverso l'array per generare ciascuna riga della tabella
    for (let i = 0; i < listaCredenziali.length; i++) {
        let elemento = listaCredenziali[i];

        // Verifico se l'URL contiene già il protocollo (http/https); se manca, aggiungo https://
        let urlCompleto = elemento.sito;
        if (urlCompleto.indexOf('http://') !== 0 && urlCompleto.indexOf('https://') !== 0) {
            urlCompleto = 'https://' + urlCompleto;
        }

        // Creo un nuovo elemento di tipo riga (tr) per la tabella
        let riga = document.createElement('tr');
        
        // Assegno un ID univoco alla riga (utile per nasconderla/mostrarla durante la ricerca)
        riga.id = 'riga-vault-' + elemento.id;

        // Inserisco il contenuto HTML all'interno della riga (colonne con link, username, password nascosta e pulsanti)
        riga.innerHTML = 
            '<td><strong><a href="' + urlCompleto + '" target="_blank" style="color: inherit; text-decoration: underline;">' + elemento.sito + '</a></strong></td>' +
            '<td>' + elemento.username + '</td>' +
            '<td>' +
                '<input type="password" value="' + elemento.password + '" id="vault-pass-' + elemento.id + '" readonly style="border:none; background:transparent; color:inherit;">' +
            '</td>' +
            '<td>' +
                '<button type="button" onclick="mostraNascondiPasswordVault(' + elemento.id + ')" class="btn-icon" title="Mostra/Nascondi">' +
                    '<i class="fa-solid fa-eye" id="vault-icona-' + elemento.id + '"></i>' +
                '</button> ' +
                '<button type="button" onclick="copiaTesto(\'' + elemento.password + '\')" class="btn-icon" title="Copia Password">' +
                    '<i class="fa-regular fa-copy"></i>' +
                '</button>' +
            '</td>';

        // Aggiungo la riga creata all'interno del body della tabella
        tbody.appendChild(riga);
    }
}


// --- RICERCA IN TEMPO REALE NEL VAULT ---
function cercaNelVault() {
    // Recupero il valore digitato nella barra di ricerca e lo converto in minuscolo (case-insensitive)
    let testoRicerca = document.getElementById('input-ricerca-vault').value.toLowerCase();
    
    // Recupero le credenziali dal localStorage per fare il confronto
    let utenteLoggato = sessionStorage.getItem('sessioneAttiva');
    let chiaveVault = 'vault_' + utenteLoggato;
    let datiSalvati = localStorage.getItem(chiaveVault);
    
    // Se non ci sono dati salvati, interrompo la funzione
    if (datiSalvati == null) return;
    let listaCredenziali = JSON.parse(datiSalvati);

    // Scorro ogni elemento dell'array per verificare se corrisponde alla ricerca
    for (let i = 0; i < listaCredenziali.length; i++) {
        let elemento = listaCredenziali[i];
        
        // Recupero la riga HTML corrispondente all'elemento tramite il suo ID univoco
        let riga = document.getElementById('riga-vault-' + elemento.id);

        if (riga != null) {
            // Converto nome sito e username in minuscolo per il confronto
            let nomeSito = elemento.sito.toLowerCase();
            let nomeUtente = elemento.username.toLowerCase();

            // Controllo se il testo cercato è presente nel nome del sito O nell'username
            if (nomeSito.indexOf(testoRicerca) !== -1 || nomeUtente.indexOf(testoRicerca) !== -1) {
                riga.style.display = ''; // Rendo visibile la riga
            } else {
                riga.style.display = 'none'; // Nascondo la riga se non corrisponde
            }
        }
    }
}

// --- MOSTRA O NASCONDI PASSWORD NELLA TABELLA VAULT ---
function mostraNascondiPasswordVault(id) {
    // Recupero l'input password e l'icona dell'occhio specifici tramite l'ID dell'elemento
    let inputPassword = document.getElementById('vault-pass-' + id);
    let icona = document.getElementById('vault-icona-' + id);

    // Se l'input è in modalità 'password', lo cambio in 'text' per renderla visibile
    if (inputPassword.type == 'password') {
        inputPassword.type = 'text';
        icona.className = 'fa-solid fa-eye-slash'; // Icona occhio sbarrato
    } else {
        // Altrimenti rimetto il tipo 'password' per nasconderla nuovamente
        inputPassword.type = 'password';
        icona.className = 'fa-solid fa-eye'; // Icona occhio normale
    }
}