document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    const rules = {
        nome:    { regex: /^[a-zA-ZÀ-ù]{3,}$/, msg: "Minimo 3 lettere, solo caratteri alfabetici" },
        cognome: { regex: /^[a-zA-ZÀ-ù]{3,}$/, msg: "Minimo 3 lettere, solo caratteri alfabetici" },
        Classe:  { regex: /^[1-5][Aa]$/,        msg: "Formato non valido, es. 1A" },
    };

    const answers = { q1: "c", q2: "a", q3: "b" };

    function validateField(input) {
        const rule = rules[input.name];
        if (!rule) return true;

        const valid = rule.regex.test(input.value);
        input.setAttribute("aria-invalid", String(!valid));

        const errorEl = document.getElementById(`${input.id}-error`);
        if (errorEl) errorEl.textContent = valid ? "" : rule.msg;

        return valid;
    }

    function validateRadio(name) {
        const valid = form.elements[name].value === answers[name];

        const fieldset = form.elements[name][0].closest("fieldset");
        fieldset.setAttribute("aria-invalid", String(!valid));

        return valid;
    }

    form.querySelectorAll("input[type='text']").forEach(input => {
        input.addEventListener("blur", (e) => validateField(e.target));
    });

    ["q1", "q2", "q3"].forEach(name => {
        form.elements[name].forEach(radio => {
            radio.addEventListener("change", () => validateRadio(name));
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const textValid = [...form.querySelectorAll("input[type='text']")]
            .every(input => validateField(input));

        const radioNames = ["q1", "q2", "q3"];
        radioNames.forEach(name => validateRadio(name));

        const radioResults = radioNames.map(name => form.elements[name].value === answers[name]);
        const punteggio = radioResults.filter(Boolean).length;

        if (!textValid) return;

        const risultati = document.getElementById("risultati");
        risultati.innerHTML = `
            <hr>
            <h3>Risultati di ${form.elements["nome"].value} ${form.elements["cognome"].value}</h3>
            <p>Domanda 1 (Capitale Francia): ${radioResults[0] ? "✅ Corretta" : "❌ Sbagliata"}</p>
            <p>Domanda 2 (Pianeta Rosso): ${radioResults[1] ? "✅ Corretta" : "❌ Sbagliata"}</p>
            <p>Domanda 3 (5 x 6): ${radioResults[2] ? "✅ Corretta" : "❌ Sbagliata"}</p>
            <p><strong>Punteggio: ${punteggio}/3</strong></p>
        `;
    });
})