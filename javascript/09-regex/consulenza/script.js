document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('consultingForm');
    const riepilogo = document.getElementById('riepilogo');

    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const telefono = document.getElementById('telefono');
    const sito = document.getElementById('sito');
    const ente = document.getElementById('ente');
    const dataRichiesta = document.getElementById('dataRichiesta');
    const ambitiError = document.getElementById('ambitiError');

    // Regex
    const regexUsername = /^.{3,}$/;
    const regexPassword = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    const regexTelefono = /^\d{10}$/;
    const regexSito = /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/;
    const regexData = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    // Funzione generica di validazione
    function valida(campo, condizione, messaggio) {
        const feedback = campo.parentElement.querySelector('.invalid-feedback');
        campo.classList.remove('is-invalid', 'is-valid');

        if (!condizione) {
            campo.classList.add('is-invalid');
            feedback.textContent = messaggio;
            return false;
        }

        campo.classList.add('is-valid');
        return true;
    }

    // Validazione ambiti (almeno uno selezionato)
    function validaAmbiti() {
        const selezionati = document.querySelectorAll('.ambito:checked');
        if (selezionati.length === 0) {
            ambitiError.textContent = 'Seleziona almeno un ambito di consulenza';
            ambitiError.style.display = 'block';
            return false;
        }
        ambitiError.style.display = 'none';
        ambitiError.textContent = '';
        return true;
    }

    // Validazione data reale (es. 2024-02-30 non esiste)
    function dataValida(str) {
        if (!regexData.test(str)) return false;
        const [y, m, d] = str.split('-').map(Number);
        const data = new Date(y, m - 1, d);
        return data.getFullYear() === y && data.getMonth() === m - 1 && data.getDate() === d;
    }

    // Calcola appuntamento: data + 7 giorni, salta sabato/domenica -> lunedi
    function calcolaAppuntamento(str) {
        const [y, m, d] = str.split('-').map(Number);
        const data = new Date(y, m - 1, d);
        data.setDate(data.getDate() + 7);

        const giorno = data.getDay(); // 0=dom, 6=sab
        if (giorno === 6) data.setDate(data.getDate() + 2);
        if (giorno === 0) data.setDate(data.getDate() + 1);

        return data.toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Validazione in tempo reale
    username.addEventListener('blur', () =>
        valida(username, regexUsername.test(username.value.trim()), 'Il nome deve contenere almeno 3 caratteri')
    );

    password.addEventListener('blur', () =>
        valida(password, regexPassword.test(password.value), 'La password deve avere almeno 8 caratteri, con lettere e numeri')
    );

    telefono.addEventListener('blur', () =>
        valida(telefono, regexTelefono.test(telefono.value.trim()), 'Il numero deve essere composto da 10 cifre')
    );

    sito.addEventListener('blur', () =>
        valida(sito, regexSito.test(sito.value.trim()), 'URL non valido (es. https://esempio.com)')
    );

    ente.addEventListener('blur', () =>
        valida(ente, ente.value.trim().length >= 2, "Inserisci il nome dell'ente o azienda")
    );

    dataRichiesta.addEventListener('blur', () =>
        valida(dataRichiesta, dataValida(dataRichiesta.value.trim()), 'Data non valida, usa il formato AAAA-MM-GG')
    );

    document.querySelectorAll('.ambito').forEach(cb =>
        cb.addEventListener('change', validaAmbiti)
    );

    // Submit
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const ambiti = validaAmbiti();
        const validazioni = [
            valida(username, regexUsername.test(username.value.trim()), 'Il nome deve contenere almeno 3 caratteri'),
            valida(password, regexPassword.test(password.value), 'La password deve avere almeno 8 caratteri, con lettere e numeri'),
            valida(telefono, regexTelefono.test(telefono.value.trim()), 'Il numero deve essere composto da 10 cifre'),
            valida(sito, regexSito.test(sito.value.trim()), 'URL non valido (es. https://esempio.com)'),
            valida(ente, ente.value.trim().length >= 2, "Inserisci il nome dell'ente o azienda"),
            valida(dataRichiesta, dataValida(dataRichiesta.value.trim()), 'Data non valida, usa il formato AAAA-MM-GG'),
            ambiti
        ];

        if (!validazioni.every(v => v)) return;

        // Raccoglie ambiti selezionati
        const ambitiSelezionati = [...document.querySelectorAll('.ambito:checked')].map(cb => cb.value);

        // Popola riepilogo
        const lista = document.getElementById('riepilogoLista');
        lista.innerHTML = `
            <li class="list-group-item"><strong>Nome utente:</strong> ${username.value.trim()}</li>
            <li class="list-group-item"><strong>Password:</strong> ${'*'.repeat(password.value.length)}</li>
            <li class="list-group-item"><strong>Telefono:</strong> ${telefono.value.trim()}</li>
            <li class="list-group-item"><strong>Sito web:</strong> ${sito.value.trim()}</li>
            <li class="list-group-item"><strong>Ente/Azienda:</strong> ${ente.value.trim()}</li>
            <li class="list-group-item"><strong>Ambiti:</strong> ${ambitiSelezionati.join(', ')}</li>
            <li class="list-group-item"><strong>Data richiesta:</strong> ${dataRichiesta.value.trim()}</li>
        `;

        document.getElementById('valoreAggiunto').textContent =
            'Affidarsi a una consulenza IT professionale significa ottimizzare processi, ridurre rischi e guadagnare un vantaggio competitivo concreto nel mercato digitale.';

        document.getElementById('dataAppuntamento').textContent = calcolaAppuntamento(dataRichiesta.value.trim());

        // Mostra riepilogo, nascondi form
        form.classList.add('d-none');
        riepilogo.classList.remove('d-none');
    });

    // Nuova richiesta
    document.getElementById('btnNuova').addEventListener('click', function () {
        form.reset();
        [username, password, telefono, sito, ente, dataRichiesta].forEach(c =>
            c.classList.remove('is-valid', 'is-invalid')
        );
        ambitiError.style.display = 'none';
        riepilogo.classList.add('d-none');
        form.classList.remove('d-none');
    });
});
