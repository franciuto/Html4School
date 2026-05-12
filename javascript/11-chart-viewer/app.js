google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(startApp);

class MathFunction {
  constructor(key, label, paramDefs) {
    this.key = key;
    this.label = label;
    this.paramDefs = paramDefs;
  }
}

class LinearFunction extends MathFunction {
  constructor() {
    super("lineare", "Retta", [
      { key: "m", label: "m", value: 1, step: 0.1 },
      { key: "q", label: "q", value: 0, step: 0.1 },
    ]);
  }

  evaluate(x, params) {
    return params.m * x + params.q;
  }
}

class QuadraticFunction extends MathFunction {
  constructor() {
    super("parabola", "Parabola", [
      { key: "a", label: "a", value: 1, step: 0.1 },
      { key: "b", label: "b", value: 0, step: 0.1 },
      { key: "c", label: "c", value: 0, step: 0.1 },
    ]);
  }

  evaluate(x, params) {
    return params.a * x * x + params.b * x + params.c;
  }
}

class ChartController {
  constructor() {
    this.registry = {
      lineare: new LinearFunction(),
      parabola: new QuadraticFunction(),
    };
    this.chart = new google.visualization.LineChart(document.getElementById("chart"));
    this.controls = {
      functionSelect: document.getElementById("function-select"),
      xMin: document.getElementById("x-min"),
      xMax: document.getElementById("x-max"),
      xStep: document.getElementById("x-step"),
      paramsContainer: document.getElementById("function-params"),
      message: document.getElementById("message"),
    };
    this.bindEvents();
    this.renderParameterInputs();
    this.draw();
  }

  bindEvents() {
    this.controls.functionSelect.addEventListener("change", () => {
      this.renderParameterInputs();
      this.draw();
    });
    this.controls.xMin.addEventListener("input", () => this.draw());
    this.controls.xMax.addEventListener("input", () => this.draw());
    this.controls.xStep.addEventListener("input", () => this.draw());
    window.addEventListener("resize", () => this.draw());
  }

  currentFunction() {
    return this.registry[this.controls.functionSelect.value];
  }

  renderParameterInputs() {
    const fn = this.currentFunction();
    this.controls.paramsContainer.innerHTML = "";

    for (const definition of fn.paramDefs) {
      const label = document.createElement("label");
      label.textContent = definition.label;

      const input = document.createElement("input");
      input.type = "number";
      input.name = definition.key;
      input.value = String(definition.value);
      input.step = String(definition.step);
      input.addEventListener("input", () => this.draw());

      label.appendChild(input);
      this.controls.paramsContainer.appendChild(label);
    }
  }

  parseRange() {
    const xMin = Number(this.controls.xMin.value);
    const xMax = Number(this.controls.xMax.value);
    const step = Number(this.controls.xStep.value);

    if (Number.isNaN(xMin) || Number.isNaN(xMax) || Number.isNaN(step)) {
      throw new Error("Inserisci solo valori numerici.");
    }
    if (step <= 0) {
      throw new Error("Il passo deve essere maggiore di 0.");
    }
    if (xMin >= xMax) {
      throw new Error("x min deve essere minore di x max.");
    }
    if ((xMax - xMin) / step > 3000) {
      throw new Error("Troppi punti: aumenta il passo o riduci il range.");
    }

    return { xMin, xMax, step };
  }

  readParams() {
    const fn = this.currentFunction();
    const params = {};

    for (const definition of fn.paramDefs) {
      const input = this.controls.paramsContainer.querySelector(`input[name="${definition.key}"]`);
      const value = Number(input.value);
      if (Number.isNaN(value)) {
        throw new Error(`Parametro ${definition.label} non valido.`);
      }
      params[definition.key] = value;
    }

    return params;
  }

  buildRows(fn, params, range) {
    const rows = [];
    for (let x = range.xMin; x <= range.xMax + range.step / 2; x += range.step) {
      const y = fn.evaluate(x, params);
      rows.push([x, y]);
    }
    return rows;
  }

  draw() {
    try {
      const fn = this.currentFunction();
      const range = this.parseRange();
      const params = this.readParams();
      const rows = this.buildRows(fn, params, range);

      const data = new google.visualization.DataTable();
      data.addColumn("number", "x");
      data.addColumn("number", "y");
      data.addRows(rows);

      const options = {
        title: fn.label,
        hAxis: { title: "x" },
        vAxis: { title: "y" },
        legend: "none",
        curveType: "none",
      };

      this.chart.draw(data, options);
      this.controls.message.textContent = "";
    } catch (error) {
      this.controls.message.textContent = error.message;
      const empty = new google.visualization.DataTable();
      empty.addColumn("number", "x");
      empty.addColumn("number", "y");
      this.chart.draw(empty, { title: "Errore nei parametri", legend: "none" });
    }
  }
}

function startApp() {
  new ChartController();
}
