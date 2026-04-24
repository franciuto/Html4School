document.addEventListener("DOMContentLoaded", () => {
    const inputRighe = document.getElementById("righe");
    const inputColonne = document.getElementById("colonne");
    const bottoneGenera = document.getElementById("generaTabella");
    const bottoneNegativi = document.getElementById("evidenziaNegativi");
    const tabellaCasuale = document.getElementById("tabellaCasuale");

    function numeroCasuale() {
        return Math.floor(Math.random() * 101) - 50;
    }

    function generaTabella() {
        const righe = parseInt(inputRighe.value, 10);
        const colonne = parseInt(inputColonne.value, 10);

        if (Number.isNaN(righe) || Number.isNaN(colonne) || righe < 1 || colonne < 1) {
            return;
        }

        let tabellaHtml = "<tbody>";
        for (let riga = 0; riga < righe; riga++) {
            tabellaHtml += "<tr>";
            for (let colonna = 0; colonna < colonne; colonna++) {
                const valore = numeroCasuale();
                tabellaHtml += `<td data-value="${valore}">${valore}</td>`;
            }
            tabellaHtml += "</tr>";
        }
        tabellaHtml += "</tbody>";

        tabellaCasuale.innerHTML = tabellaHtml;
    }

    function coloraNegativi() {
        const celle = tabellaCasuale.querySelectorAll("td");
        celle.forEach((cella) => {
            const valore = parseInt(cella.dataset.value, 10);
            if (valore < 0) {
                cella.classList.add("cella-negativa");
            } else {
                cella.classList.remove("cella-negativa");
            }
        });
    }

    bottoneGenera.addEventListener("click", generaTabella);
    bottoneNegativi.addEventListener("click", coloraNegativi);

    generaTabella();
});
