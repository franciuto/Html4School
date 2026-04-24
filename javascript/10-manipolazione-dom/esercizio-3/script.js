document.addEventListener("DOMContentLoaded", () => {
    const tabellaPitagorica = document.getElementById("tabellaPitagorica");
    const ultimoValore = document.getElementById("ultimoValore");
    const totaleValori = document.getElementById("totaleValori");
    const dimensione = 10;
    let totale = 0;

    function creaTabella() {
        let tabellaHtml = "<thead><tr><th>x</th>";
        for (let colonna = 1; colonna <= dimensione; colonna++) {
            tabellaHtml += `<th>${colonna}</th>`;
        }
        tabellaHtml += "</tr></thead><tbody>";

        for (let riga = 1; riga <= dimensione; riga++) {
            tabellaHtml += `<tr><th>${riga}</th>`;
            for (let colonna = 1; colonna <= dimensione; colonna++) {
                const prodotto = riga * colonna;
                tabellaHtml += `<td data-value="${prodotto}">${prodotto}</td>`;
            }
            tabellaHtml += "</tr>";
        }
        tabellaHtml += "</tbody>";

        tabellaPitagorica.innerHTML = tabellaHtml;
    }

    function gestisciClickCella(event) {
        const cella = event.target.closest("td");
        if (!cella || cella.dataset.selezionata === "true") {
            return;
        }

        const valore = parseInt(cella.dataset.value, 10);
        totale += valore;

        cella.dataset.selezionata = "true";
        cella.style.backgroundColor = "#ffffff";
        cella.style.color = "#000000";

        ultimoValore.value = String(valore);
        totaleValori.value = String(totale);
    }

    creaTabella();
    tabellaPitagorica.addEventListener("click", gestisciClickCella);
});
