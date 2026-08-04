const oneShotExperiments = [
  "Base",
  "Netclass detail",
  "Unlimited layer",
  "Fewshot",
  "Prerouter",
];

const unavailableOneShot = () => Array(14).fill(null);

const oneShotModels = [
  {
    label: "GPT-5.5", size: "-", type: "commercial", rows: [
      ["Base", ["9.13", "12.26", "20.09", "75.37", "1.00", "431.29", "427.21", "4.08", "0.00", "791.66", "20.53", "1.74", "0.860", "133.79"]],
      ["Netclass detail", ["9.87", "12.83", "20.66", "75.12", "1.14", "401.31", "397.07", "4.24", "0.00", "774.93", "21.02", "1.79", "0.864", "133.02"]],
      ["Unlimited layer", ["9.00", "11.66", "31.46", "71.24", "0.92", "367.08", "362.50", "4.58", "0.00", "781.98", "22.79", "4.91", "0.854", "130.22"]],
      ["Fewshot", ["9.42", "13.11", "19.03", "80.07", "1.39", "346.63", "342.61", "4.03", "0.00", "685.34", "10.56", "1.75", "0.958", "117.35"]],
      ["Prerouter", ["9.99", "14.23", "22.38", "77.95", "1.51", "354.44", "349.52", "4.92", "0.00", "735.99", "27.25", "1.88", "0.900", "127.46"]],
    ],
  },
  {
    label: "GPT-5-mini", size: "-", type: "commercial", rows: [
      ["Base", ["5.75", "6.74", "31.20", "75.49", "3.11", "372.07", "368.80", "3.28", "0.00", "648.43", "15.25", "1.38", "0.989", "69.89"]],
      ["Netclass detail", ["5.57", "6.02", "38.91", "68.96", "4.58", "294.29", "291.18", "3.11", "0.00", "552.48", "8.95", "1.27", "0.993", "62.52"]],
      ["Unlimited layer", ["5.12", "5.26", "43.15", "68.87", "4.30", "303.77", "301.08", "2.69", "0.00", "567.12", "11.13", "2.15", "0.990", "62.61"]],
      ["Fewshot", ["4.09", "4.37", "61.91", "53.70", "10.18", "150.67", "148.81", "1.87", "0.00", "323.94", "3.11", "1.26", "0.991", "55.87"]],
      ["Prerouter", ["5.91", "6.12", "40.08", "66.69", "4.93", "272.69", "269.96", "2.73", "0.00", "511.56", "14.44", "1.31", "0.992", "66.19"]],
    ],
  },
  {
    label: "Claude Opus 4.8", size: "-", type: "commercial", rows: [
      ["Base", ["12.60", "15.41", "55.05", "73.71", "3.61", "150.53", "147.72", "2.80", "0.00", "494.41", "13.27", "1.95", "0.990", "42.06"]],
      ["Netclass detail", ["12.38", "14.16", "55.73", "71.59", "4.11", "136.28", "133.27", "3.01", "0.00", "469.17", "11.12", "1.95", "0.988", "39.62"]],
      ["Unlimited layer", ["12.09", "13.39", "59.06", "69.82", "3.31", "124.32", "121.41", "2.91", "0.00", "468.88", "15.35", "4.63", "0.989", "39.99"]],
      ["Fewshot", ["10.36", "11.32", "44.03", "62.32", "4.09", "126.28", "123.83", "2.45", "0.00", "424.89", "7.72", "1.89", "0.945", "37.76"]],
      ["Prerouter", ["12.54", "14.42", "53.13", "72.44", "4.35", "141.07", "137.74", "3.33", "0.00", "480.48", "15.77", "1.95", "0.991", "41.43"]],
    ],
  },
  {
    label: "Gemini 3.1 Pro-Preview", size: "-", type: "commercial", rows: [
      ["Base", ["0.71", "0.86", "1.71", "3.45", "0.05", "157.63", "155.64", "1.99", "0.00", "428.92", "20.82", "1.89", "0.060", "260.00"]],
      ["Netclass detail", ["0.37", "0.51", "1.12", "2.47", "0.05", "183.78", "178.71", "5.07", "0.00", "442.01", "20.16", "1.92", "0.046", "307.41"]],
      ["Unlimited layer", [null, null, null, null, null, null, null, null, null, null, null, null, null, null]],
      ["Fewshot", [null, null, null, null, null, null, null, null, null, null, null, null, null, null]],
      ["Prerouter", [null, null, null, null, null, null, null, null, null, null, null, null, null, null]],
    ],
  },
  {
    label: "Gemini 2.5 Flash-lite", size: "-", type: "commercial", rows: [
      ["Base", ["1.37", "1.30", "16.09", "25.07", "9.27", "419.47", "414.89", "4.58", "0.00", "427.48", "42.48", "1.41", "0.376", "21.20"]],
      ["Netclass detail", ["1.33", "1.26", "18.16", "23.77", "9.72", "385.07", "379.96", "5.11", "0.00", "370.20", "34.88", "1.41", "0.367", "22.62"]],
      ["Unlimited layer", ["1.12", "1.03", "18.16", "23.57", "9.50", "363.90", "358.39", "5.50", "0.00", "361.86", "31.00", "1.39", "0.362", "21.67"]],
      ["Fewshot", ["0.09", "0.05", "6.80", "6.37", "3.49", "856.26", "834.67", "21.59", "0.00", "419.05", "0.03", "1.71", "0.132", "25.66"]],
      ["Prerouter", ["0.77", "0.67", "15.40", "18.74", "7.82", "439.41", "433.26", "6.16", "0.00", "370.76", "37.42", "1.50", "0.315", "27.05"]],
    ],
  },
  {
    label: "LLaMA 4 Maverick", size: "400B", type: "open", rows: [
      ["Base", ["4.28", "5.14", "28.70", "55.76", "26.75", "235.45", "231.39", "4.07", "0.00", "420.04", "11.34", "1.74", "0.834", "20.18"]],
      ["Netclass detail", ["3.37", "3.75", "33.63", "55.58", "34.47", "238.21", "234.30", "3.91", "0.00", "382.55", "11.29", "1.69", "0.839", "25.13"]],
      ["Unlimited layer", ["3.58", "3.70", "33.30", "55.89", "33.74", "238.16", "234.65", "3.51", "0.00", "382.18", "10.75", "1.59", "0.846", "24.99"]],
      ["Fewshot", ["0.44", "0.60", "21.37", "22.38", "14.57", "152.29", "145.79", "6.50", "0.00", "219.58", "3.32", "1.61", "0.510", "33.16"]],
      ["Prerouter", ["3.03", "3.25", "32.70", "52.61", "33.16", "225.96", "222.23", "3.73", "0.00", "368.43", "14.35", "1.75", "0.821", "25.91"]],
    ],
  },
  {
    label: "Mistral Large 3", size: "-", type: "open", rows: [
      ["Base", ["3.67", "4.25", "31.45", "52.32", "21.57", "257.39", "252.77", "4.62", "0.00", "432.39", "9.16", "1.95", "0.835", "84.54"]],
      ["Netclass detail", ["3.67", "3.86", "30.38", "54.34", "23.26", "276.19", "272.08", "4.10", "0.00", "438.33", "8.57", "1.87", "0.842", "86.26"]],
      ["Unlimited layer", ["3.68", "3.95", "30.70", "56.57", "24.70", "290.65", "286.56", "4.09", "0.00", "452.39", "6.25", "1.58", "0.853", "86.75"]],
      ["Fewshot", ["3.13", "3.31", "25.50", "43.42", "18.80", "225.35", "221.55", "3.80", "0.00", "361.71", "1.31", "1.54", "0.782", "102.77"]],
      ["Prerouter", ["3.63", "3.87", "33.36", "57.63", "24.33", "283.54", "278.88", "4.67", "0.00", "447.21", "19.13", "1.91", "0.856", "89.05"]],
    ],
  },
  {
    label: "Qwen3.5-9B", size: "9B", type: "open", rows: [
      ["Base", ["1.24", "1.61", "62.69", "20.45", "6.48", "69.77", "63.86", "5.91", "0.00", "131.34", "0.09", "1.01", "0.725", null]],
      ["Netclass detail", ["1.10", "2.37", "60.58", "25.37", "5.00", "78.15", "74.33", "3.83", "0.00", "161.32", "0.09", "1.03", "0.725", null]],
      ["Unlimited layer", ["1.28", "2.36", "60.81", "24.48", "4.93", "73.28", "69.29", "3.99", "0.00", "158.99", "0.08", "1.02", "0.730", null]],
      ["Fewshot", ["1.08", "1.06", "27.31", "12.44", "3.94", "128.02", "124.18", "3.84", "0.00", "185.32", "0.00", "1.03", "0.444", null]],
      ["Prerouter", ["1.07", "1.74", "54.98", "23.43", "4.97", "90.30", "85.76", "4.55", "0.00", "163.74", "0.41", "1.06", "0.656", null]],
    ],
  },
  {
    label: "Qwen3-235B-A22B", size: "235B-A22B", type: "open", rows: [
      ["Base", ["5.23", "7.14", "32.50", "78.25", "21.21", "375.97", "371.62", "4.35", "0.00", "611.40", "5.82", "1.52", "0.991", null]],
      ["Netclass detail", ["4.16", "5.68", "33.53", "64.74", "17.36", "331.31", "327.14", "4.16", "0.00", "540.49", "5.38", "1.46", "0.942", null]],
      ["Unlimited layer", ["4.40", "5.74", "32.41", "63.75", "17.93", "341.12", "335.54", "5.58", "0.00", "540.17", "5.13", "1.44", "0.932", null]],
      ["Fewshot", ["2.90", "3.09", "26.06", "39.65", "19.63", "357.20", "350.44", "6.76", "0.00", "429.82", "1.41", "1.43", "0.749", null]],
      ["Prerouter", ["3.64", "4.48", "35.36", "53.93", "16.55", "270.98", "266.62", "4.35", "0.00", "443.68", "7.07", "1.50", "0.910", null]],
    ],
  },
];

const agenticSizes = {
  "gpt-5-5": "-",
  "gpt-5-mini": "-",
  "claude-opus-4-8": "-",
  "gemini-3-1-pro-preview": "-",
  "gemini-2-5-flash-lite": "-",
  "llama-4-maverick": "400B",
  "ministral-14b": "14B",
  "qwen3-5-9b": "9B",
  "qwen3-235b-a22b": "235B-A22B",
};

const agenticSetupOrder = ["exp0", "exp2", "exp1", "exp3", "exp4", "exp5"];

function paperValue(value) {
  return value === null || value === undefined
    ? '<span class="dash">-</span>'
    : value;
}

function filterModels(items, filter) {
  if (filter === "all") return items;
  return items.filter((item) => {
    const type = item.type.toLowerCase().startsWith("commercial") ? "commercial" : "open";
    return type === filter;
  });
}

function rankModelsByNrr(items, getRows) {
  return items
    .map((item) => {
      const nrrValues = getRows(item)
        .map((values) => Number.parseFloat(values[0]))
        .filter(Number.isFinite);
      return {
        ...item,
        bestNrr: nrrValues.length ? Math.max(...nrrValues) : null,
      };
    })
    .sort((a, b) => (b.bestNrr ?? -Infinity) - (a.bestNrr ?? -Infinity))
    .map((item, index) => ({
      ...item,
      rank: item.bestNrr === null ? null : index + 1,
    }));
}

function rankTag(rank) {
  if (rank === 1) return '<span class="rank-tag rank-first">1st</span>';
  if (rank === 2) return '<span class="rank-tag rank-second">2nd</span>';
  if (rank === 3) return '<span class="rank-tag rank-third">3rd</span>';
  return "";
}

function renderOneShotTable(filter = "all") {
  const body = document.getElementById("oneShotBody");
  const rankedModels = rankModelsByNrr(
    oneShotModels,
    (model) => model.rows.map(([, values]) => values),
  );
  body.innerHTML = filterModels(rankedModels, filter)
    .map((model) => model.rows.map(([experiment, values], rowIndex) => `
      <tr class="${rowIndex === 0 ? "model-group-start" : ""}">
        ${rowIndex === 0 ? `<td class="model-col" rowspan="${model.rows.length}">${model.label}${rankTag(model.rank)}<span class="model-type">${model.type === "commercial" ? "Commercial" : "Open source"}</span></td><td class="size-col" rowspan="${model.rows.length}">${model.size}</td>` : ""}
        <td class="configuration-col">${experiment}</td>
        ${values.map((value, valueIndex) => `<td class="${valueIndex === 0 ? "nrr-rank-col" : ""}">${paperValue(value)}</td>`).join("")}
      </tr>
    `).join(""))
    .join("");
}

function renderAgenticTable(filter = "all") {
  const body = document.getElementById("agenticBody");
  const rankedModels = rankModelsByNrr(
    models,
    (model) => agenticSetupOrder.map((setupId) => results[setupId][model.id] || emptyRow()),
  );
  body.innerHTML = filterModels(rankedModels, filter)
    .map((model) => agenticSetupOrder.map((setupId, rowIndex) => {
      const setup = setups.find((item) => item.id === setupId);
      const values = results[setupId][model.id] || emptyRow();
      return `
        <tr class="${rowIndex === 0 ? "model-group-start" : ""}">
          ${rowIndex === 0 ? `<td class="model-col" rowspan="${agenticSetupOrder.length}">${model.label}${rankTag(model.rank)}<span class="model-type">${model.type}</span></td><td class="size-col" rowspan="${agenticSetupOrder.length}">${agenticSizes[model.id]}</td>` : ""}
          <td class="configuration-col">${setup.label}</td>
          ${values.map((value, valueIndex) => `<td class="${valueIndex === 0 ? "nrr-rank-col" : ""}">${paperValue(value)}</td>`).join("")}
        </tr>
      `;
    }).join(""))
    .join("");
}

function initializeTableFilters() {
  document.querySelectorAll(".leader-filter").forEach((group) => {
    group.querySelectorAll(".filter-button").forEach((button) => {
      button.addEventListener("click", () => {
        group.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        const filter = button.dataset.filter;
        if (group.dataset.table === "one-shot") renderOneShotTable(filter);
        if (group.dataset.table === "agentic") renderAgenticTable(filter);
      });
    });
  });
}

renderOneShotTable();
renderAgenticTable();
initializeTableFilters();
