document.addEventListener("DOMContentLoaded", () => {
    const inputElemento = document.getElementById("nuovoElemento");
    const bottoneAggiungi = document.getElementById("aggiungiElemento");
    const listaElementi = document.getElementById("listaElementi");

    function creaElemento(testo) {
        const listItem = document.createElement("li");
        const spanTesto = document.createElement("span");
        const bottoneElimina = document.createElement("button");

        spanTesto.textContent = testo;
        bottoneElimina.type = "button";
        bottoneElimina.textContent = "Elimina";
        bottoneElimina.style.marginLeft = "0.75rem";

        bottoneElimina.addEventListener("click", () => {
            listItem.remove();
        });

        listItem.appendChild(spanTesto);
        listItem.appendChild(bottoneElimina);
        listaElementi.appendChild(listItem);
    }

    function aggiungiElemento() {
        const testoElemento = inputElemento.value.trim();
        if (testoElemento === "") {
            return;
        }

        creaElemento(testoElemento);
        inputElemento.value = "";
        inputElemento.focus();
    }

    bottoneAggiungi.addEventListener("click", aggiungiElemento);
    inputElemento.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            aggiungiElemento();
        }
    });
});
