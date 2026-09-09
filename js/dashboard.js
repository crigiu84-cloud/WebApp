// --- CAMBIO SEZIONE (Menu Sidebar) ---
function cambiaSezione(nomeSezione) {
    // nascondo tutte le sezioni
    var sezioni = document.getElementsByClassName('tab-content');
    for (var i = 0; i < sezioni.length; i++) {
        sezioni[i].classList.remove('active');
    }

    // tolgo la selezione a tutti i pulsanti del menu
    var menuItems = document.getElementsByClassName('menu-item');
    for (var j = 0; j < menuItems.length; j++) {
        menuItems[j].classList.remove('active');
    }

    // mostro la sezione scelta
    var sezioneScelta = document.getElementById('sezione-' + nomeSezione);
    if (sezioneScelta != null) {
        sezioneScelta.classList.add('active');
    }

    // evidenzio l'elemento del menu cliccato
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
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
    var lunghezza = document.getElementById('length-slider').value;
    var usaMaiuscole = document.getElementById('chk-uppercase').checked;
    var usaMinuscole = document.getElementById('chk-lowercase').checked;
    var usaNumeri = document.getElementById('chk-numbers').checked;
    var usaSimboli = document.getElementById('chk-symbols').checked;

    /* creo una stringa unica contenente tutti i caratteri 
       disponibili in base ai checkbox selezionati */
    var caratteri = '';
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
    var password = '';
    for (var i = 0; i < lunghezza; i++) {
        var posizione = Math.floor(Math.random() * caratteri.length);
        password = password + caratteri.charAt(posizione);
    }

    // mostro la password generata a schermo
    document.getElementById('output-password').innerText = password;
}

// --- COPIA PASSWORD NEGLI APPUNTI ---
function copiaGenerata() {
    // prendo il testo della password generata e lo salvo negli appunti di sistema
    var testo = document.getElementById('output-password').innerText;
    navigator.clipboard.writeText(testo);
    alert('Password copiata!');
}

// --- ANALISI DELLA ROBUSTEZZA PASSWORD ---
function analizzaPassword(password) {
    var punteggio = 0;

    // controllo se la password rispetta la lunghezza minima di 8 caratteri
    var haMinimo8 = false;
    if (password.length >= 8) {
        haMinimo8 = true;
        punteggio = punteggio + 25;
    }

    // controllo se contiene almeno una lettera maiuscola
    var haMaiuscola = /[A-Z]/.test(password);
    if (haMaiuscola == true) {
        punteggio = punteggio + 25;
    }

    // controllo se contiene almeno un numero
    var haNumero = /[0-9]/.test(password);
    if (haNumero == true) {
        punteggio = punteggio + 25;
    }

    // controllo se contiene almeno un carattere speciale
    var haSimbolo = /[!@#$%^&*(),.?":{}|<>_\-\[\]]/.test(password);
    if (haSimbolo == true) {
        punteggio = punteggio + 25;
    }

    // imposto il colore dell'arco in base alla percentuale raggiunta
    var colore = 'rgba(255, 255, 255, 0.1)';

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
    var cerchio = document.getElementById('gauge-circle');
    cerchio.style.background = 'conic-gradient(' + colore + ' ' + punteggio + '%, rgba(255, 255, 255, 0.1) ' + punteggio + '% 100%)';

    // aggiorno il testo dell'etichetta (WEAK / MEDIUM / STRONG)
    var label = document.getElementById('strength-label');
    label.style.color = (punteggio == 0) ? '#64748b' : colore;

    if (punteggio < 50) {
        label.innerText = 'WEAK';
    } else if (punteggio < 75) {
        label.innerText = 'MEDIUM';
    } else {
        label.innerText = 'STRONG';
    }

    // aggiorno la lista dei requisiti (Sì/No) da mostrare nell'HTML
    var testo8 = haMinimo8 ? 'Sì' : 'No';
    var testoMaiuscola = haMaiuscola ? 'Sì' : 'No';
    var testoNumero = haNumero ? 'Sì' : 'No';
    var testoSimbolo = haSimbolo ? 'Sì' : 'No';

    var lista = document.getElementById('analysis-list');
    lista.innerHTML = 
        '<li>Lunghezza minima ok: <span>' + testo8 + '</span></li>' +
        '<li>Maiuscole incluse: <span>' + testoMaiuscola + '</span></li>' +
        '<li>Numeri inclusi: <span>' + testoNumero + '</span></li>' +
        '<li>Caratteri speciali: <span>' + testoSimbolo + '</span></li>';
}