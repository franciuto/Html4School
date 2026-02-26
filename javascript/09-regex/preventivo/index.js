document.addEventListener("DOMContentLoaded", () => {
    function validateField(field, regex) {
        if (regex.test(field.value)) {
            field.classList.remove("is-invalid");
            field.classList.add("is-valid");
            return true;
        } else {
            field.classList.remove("is-valid");
            field.classList.add("is-invalid");
            return false;
        }
    }

    let username = document.getElementById("name");
    let email = document.getElementById("email");
    let phone = document.getElementById("phone");
    let budget = document.getElementById("budget");
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let output = document.getElementById("output");
    let button = document.getElementById("button");

    // Funzione per validare i checkbox
    function validateCheckboxes() {
        const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
        const checkboxContainer = document.querySelector('.mb-3:has(.form-check)');
        const errorMsg = checkboxContainer?.querySelector('.invalid-feedback');

        if (anyChecked) {
            checkboxContainer?.classList.remove("is-invalid");
            checkboxContainer?.classList.add("is-valid");
            if (errorMsg) errorMsg.textContent = "";
            return true;
        } else {
            checkboxContainer?.classList.remove("is-valid");
            checkboxContainer?.classList.add("is-invalid");
            if (errorMsg) errorMsg.textContent = "Seleziona almeno una competenza";
            return false;
        }
    }

    function calcolaPreventivo() {
        const checked = Array.from(checkboxes).filter(cb => cb.checked);
        let ids = checked.map(cb => cb.value);
        let cost = 0;
        ids.forEach(id => {
            cost += Number(id);
        });
        console.log(cost);
        return cost * 10;
    }

    function checkAll() {
        const isNameValid = validateField(username, /^.{3,}$/);
        const isEmailValid = validateField(email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        const isPhoneValid = validateField(phone, /^\d{10}$/);
        const isBudgetValid = validateField(budget, /^\d+$/);
        const isCheckboxValid = validateCheckboxes();
        
        return isNameValid && isEmailValid && isPhoneValid && isBudgetValid && isCheckboxValid;
    }

    checkboxes.forEach(cb => {
        cb.addEventListener("change", validateCheckboxes);
    });

    username.addEventListener("input", () => {
        validateField(username, /^.{3,}$/);
    });

    email.addEventListener("input", () => {
        validateField(email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    });

    phone.addEventListener("input", () => {
        validateField(phone, /^\d{10}$/);
    });

    budget.addEventListener("input", () => {
        validateField(budget, /^\d+$/);
    });

    button.addEventListener("click", () => {
        if (checkAll()) {
        let costoFinale = calcolaPreventivo();
        let budgetValue = Number(budget.value);

        output.innerHTML = `<h4>Costo finale operazione: <strong>${costoFinale}€</strong></h4>`;
        output.innerHTML += costoFinale <= budgetValue
            ? `<p class="text-success">Budget sufficiente ✅</p>`
            : `<p class="text-danger">Budget insufficiente 🔴</p>`;
        }
    })
});