const setups = [
  {
    id: "exp0",
    label: "No Tools",
    description: "Direct agentic routing without external visualization, scoring, or semantic feedback.",
  },
  {
    id: "exp1",
    label: "Routing Score",
    description: "The agent receives routing-quality and design-rule scoring feedback after each iteration.",
  },
  {
    id: "exp2",
    label: "Visualization",
    description: "The custom EDA renderer supplies visual feedback for iterative route refinement.",
  },
  {
    id: "exp3",
    label: "Semantic Input",
    description: "The agent receives schematic-level semantic context about nets and functional roles.",
  },
  {
    id: "exp4",
    label: "Prerouting / Remake",
    description: "The agent starts from a prerouted state and can revise or remake the proposed routing.",
  },
  {
    id: "exp5",
    label: "All Tools",
    description: "Visualization, routing scores, semantic input, and refinement tools are provided together.",
  },
];

const models = [
  { id: "gpt-5-5", label: "GPT-5.5", type: "Commercial" },
  { id: "gpt-5-mini", label: "GPT-5-mini", type: "Commercial" },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", type: "Commercial" },
  { id: "gemini-3-1-pro-preview", label: "Gemini 3.1 Pro-Preview", type: "Commercial" },
  { id: "gemini-2-5-flash-lite", label: "Gemini 2.5 Flash-lite", type: "Commercial" },
  { id: "llama-4-maverick", label: "LLaMA 4 Maverick", type: "Open source" },
  { id: "ministral-14b", label: "Ministral 14B", type: "Open source" },
  { id: "qwen3-5-9b", label: "Qwen3.5-9B", type: "Open source" },
  { id: "qwen3-235b-a22b", label: "Qwen3-235B-A22B", type: "Open source" },
];

const frameCounts = {
  exp0: { "gpt-5-5": 25, "gpt-5-mini": 18, "ministral-14b": 10 },
  exp1: { "gpt-5-5": 25, "gpt-5-mini": 25, "gemini-2-5-flash-lite": 23, "ministral-14b": 10 },
  exp2: { "gpt-5-5": 20, "gpt-5-mini": 25, "gemini-2-5-flash-lite": 25, "ministral-14b": 10 },
  exp3: {
    "gpt-5-5": 11,
    "gpt-5-mini": 25,
    "gemini-3-1-pro-preview": 1,
    "gemini-2-5-flash-lite": 25,
    "ministral-14b": 10,
  },
  exp4: {
    "gpt-5-5": 15,
    "gpt-5-mini": 14,
    "gemini-2-5-flash-lite": 1,
    "ministral-14b": 10,
    "qwen3-5-9b": 1,
  },
  exp5: { "gpt-5-5": 25, "gpt-5-mini": 25, "gemini-2-5-flash-lite": 25, "ministral-14b": 10 },
};

const emptyRow = () => Array(15).fill(null);

const results = {
  exp0: {
    "gpt-5-5": ["0.217", "0.248", "55.96", "39.53", "0.39", "48.06", "42.87", "5.19", "0.00", "578.95", "29.11", "1.97", "1.000", "1060.60", "16.97"],
    "gpt-5-mini": ["0.099", "0.076", "53.33", "56.91", "8.10", "91.75", "88.98", "2.77", "0.00", "289.96", "11.16", "1.78", "1.000", "368.76", "18.38"],
    "claude-sonnet-4-6": emptyRow(),
    "gemini-3-1-pro-preview": ["0.022", "0.031", "10.06", "10.47", "0.17", "116.24", "111.00", "5.24", "0.00", "897.01", "35.19", "1.95", "0.188", "1312.46", "6.40"],
    "gemini-2-5-flash-lite": ["0.003", "0.002", "44.97", "8.88", "4.55", "216.17", "215.06", "1.11", "0.00", "98.94", "2.58", "1.10", "0.540", "65.48", "22.51"],
    "llama-4-maverick": emptyRow(),
    "ministral-14b": ["0.004", "0.007", "68.31", "43.24", "23.94", "230.99", "226.89", "4.10", "0.22", "230.00", "4.40", "1.58", "0.896", "399.42", "9.60"],
    "qwen3-5-9b": ["0.014", "0.009", "19.84", "15.71", "6.75", "130.87", "129.93", "0.94", "0.76", "264.21", "1.47", "1.16", "0.262", "477.12", "18.81"],
    "qwen3-235b-a22b": ["0.000", "0.000", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.002", "63.67", "1.00"],
  },
  exp1: {
    "gpt-5-5": ["0.248", "0.210", "58.10", "10.07", "0.27", "9.59", "5.58", "4.01", "0.00", "332.51", "15.50", "1.96", "1.000", "779.40", "20.26"],
    "gpt-5-mini": ["0.099", "0.064", "67.40", "29.86", "2.22", "21.16", "19.92", "1.24", "0.00", "113.28", "4.56", "1.75", "0.998", "355.64", "23.88"],
    "claude-sonnet-4-6": emptyRow(),
    "gemini-3-1-pro-preview": ["0.004", "0.004", "1.71", "1.36", "0.00", "45.72", "41.61", "4.11", "0.00", "448.71", "24.61", "1.94", "0.036", "2034.23", "14.39"],
    "gemini-2-5-flash-lite": ["0.002", "0.002", "63.35", "12.45", "4.97", "30.44", "29.39", "1.05", "0.00", "40.20", "0.99", "1.03", "0.740", "64.33", "24.71"],
    "llama-4-maverick": emptyRow(),
    "ministral-14b": ["0.008", "0.008", "81.70", "26.63", "10.04", "34.13", "31.97", "2.15", "0.00", "85.78", "1.25", "1.47", "0.972", "388.79", "9.97"],
    "qwen3-5-9b": ["0.014", "0.008", "21.48", "14.80", "4.78", "79.42", "78.95", "0.48", "0.00", "200.14", "1.17", "1.35", "0.266", "506.80", "21.29"],
    "qwen3-235b-a22b": emptyRow(),
  },
  exp2: {
    "gpt-5-5": ["0.210", "0.245", "56.89", "36.99", "0.39", "37.81", "32.90", "4.91", "0.00", "549.45", "26.34", "1.97", "1.000", "1139.14", "17.09"],
    "gpt-5-mini": ["0.099", "0.074", "54.50", "53.31", "7.34", "80.85", "78.95", "1.91", "0.00", "247.67", "8.61", "1.75", "1.000", "385.25", "20.00"],
    "claude-sonnet-4-6": emptyRow(),
    "gemini-3-1-pro-preview": ["0.018", "0.026", "9.27", "8.69", "0.06", "111.13", "106.18", "4.95", "1.28", "925.45", "36.41", "1.96", "0.156", "1692.32", "12.09"],
    "gemini-2-5-flash-lite": ["0.001", "0.001", "48.55", "8.39", "4.62", "111.09", "110.52", "0.57", "0.00", "61.98", "0.27", "0.86", "0.620", "92.98", "23.34"],
    "llama-4-maverick": emptyRow(),
    "ministral-14b": ["0.005", "0.008", "77.99", "37.75", "18.75", "130.51", "127.31", "3.20", "0.42", "161.60", "2.10", "1.39", "0.960", "296.62", "9.71"],
    "qwen3-5-9b": ["0.018", "0.010", "24.82", "17.57", "6.82", "98.55", "97.20", "1.35", "0.00", "226.80", "1.06", "1.19", "0.330", "436.80", "20.53"],
    "qwen3-235b-a22b": emptyRow(),
  },
  exp3: {
    "gpt-5-5": ["0.218", "0.256", "55.39", "38.24", "0.62", "41.91", "36.82", "5.09", "0.00", "554.48", "28.10", "1.96", "1.000", "1037.56", "16.58"],
    "gpt-5-mini": ["0.091", "0.072", "52.70", "54.24", "7.76", "89.13", "86.92", "2.21", "0.00", "255.54", "6.86", "1.69", "0.992", "413.85", "19.42"],
    "claude-sonnet-4-6": emptyRow(),
    "gemini-3-1-pro-preview": ["0.026", "0.038", "12.36", "15.54", "0.40", "135.57", "131.56", "4.01", "4.10", "864.10", "32.11", "1.92", "0.244", "1198.73", "6.05"],
    "gemini-2-5-flash-lite": ["0.001", "0.001", "51.96", "5.37", "2.62", "58.78", "55.76", "3.02", "0.00", "40.81", "0.38", "0.40", "0.658", "35.78", "24.36"],
    "llama-4-maverick": emptyRow(),
    "ministral-14b": ["0.003", "0.005", "50.18", "29.91", "15.70", "205.97", "203.78", "2.20", "1.06", "177.15", "2.03", "1.30", "0.754", "352.02", "9.67"],
    "qwen3-5-9b": ["0.001", "0.001", "2.66", "1.75", "0.43", "81.18", "80.95", "0.23", "0.00", "144.77", "3.55", "1.45", "0.044", "241.65", "4.86"],
    "qwen3-235b-a22b": emptyRow(),
  },
  exp4: {
    "gpt-5-5": ["0.226", "0.303", "49.74", "43.11", "0.42", "63.43", "57.92", "5.51", "0.00", "606.21", "30.81", "1.98", "0.996", "988.91", "15.80"],
    "gpt-5-mini": ["0.092", "0.105", "35.89", "43.89", "5.35", "77.59", "74.60", "2.99", "0.00", "309.55", "15.49", "1.92", "0.892", "360.66", "17.66"],
    "claude-sonnet-4-6": emptyRow(),
    "gemini-3-1-pro-preview": ["0.041", "0.053", "11.91", "14.12", "0.14", "109.10", "105.89", "3.20", "2.21", "725.41", "30.71", "1.96", "0.272", "1131.42", "6.42"],
    "gemini-2-5-flash-lite": ["0.005", "0.011", "15.56", "13.37", "8.14", "255.80", "249.48", "6.33", "0.00", "222.90", "14.61", "1.62", "0.342", "79.62", "14.63"],
    "llama-4-maverick": emptyRow(),
    "ministral-14b": ["0.008", "0.027", "56.63", "43.45", "24.30", "234.28", "230.20", "4.09", "0.00", "258.26", "14.73", "1.82", "0.840", "356.41", "9.34"],
    "qwen3-5-9b": ["0.001", "0.003", "3.43", "4.17", "2.08", "332.02", "331.86", "0.16", "0.00", "371.58", "5.27", "1.66", "0.088", "322.00", "10.80"],
    "qwen3-235b-a22b": emptyRow(),
  },
  exp5: {
    "gpt-5-5": ["0.280", "0.256", "54.66", "9.12", "0.26", "9.35", "5.27", "4.08", "0.00", "326.57", "17.88", "1.96", "0.998", "737.76", "20.78"],
    "gpt-5-mini": ["0.068", "0.057", "55.91", "24.57", "2.02", "22.57", "20.77", "1.80", "0.00", "118.84", "7.49", "1.74", "0.914", "410.83", "23.65"],
    "claude-sonnet-4-6": emptyRow(),
    "gemini-3-1-pro-preview": ["0.012", "0.010", "4.65", "3.14", "0.15", "55.07", "51.63", "3.44", "0.00", "551.93", "22.27", "1.76", "0.090", "1876.04", "15.40"],
    "gemini-2-5-flash-lite": ["0.005", "0.007", "32.16", "12.37", "5.07", "80.73", "76.97", "3.76", "0.00", "101.73", "8.81", "1.38", "0.494", "59.99", "23.20"],
    "llama-4-maverick": emptyRow(),
    "ministral-14b": ["0.010", "0.022", "53.01", "18.12", "6.54", "28.53", "27.77", "0.77", "0.00", "92.23", "4.45", "1.62", "0.818", "345.07", "10.00"],
    "qwen3-5-9b": ["0.001", "0.001", "2.56", "1.70", "0.72", "102.32", "102.09", "0.23", "0.00", "178.20", "5.55", "1.77", "0.044", "149.93", "4.95"],
    "qwen3-235b-a22b": emptyRow(),
  },
};

let activeSetup = setups[0].id;

function renderSetupPicker() {
  const picker = document.getElementById("setupPicker");
  picker.innerHTML = setups
    .map(
      (setup, index) => `
        <button
          class="setup-button${setup.id === activeSetup ? " active" : ""}"
          id="tab-${setup.id}"
          type="button"
          role="tab"
          aria-selected="${setup.id === activeSetup}"
          aria-controls="modelGrid"
          tabindex="${setup.id === activeSetup ? "0" : "-1"}"
          data-setup="${setup.id}"
        >${setup.label}</button>
      `,
    )
    .join("");

  picker.querySelectorAll(".setup-button").forEach((button, index, buttons) => {
    button.addEventListener("click", () => selectSetup(button.dataset.setup));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let targetIndex = index;
      if (event.key === "ArrowLeft") targetIndex = (index - 1 + buttons.length) % buttons.length;
      if (event.key === "ArrowRight") targetIndex = (index + 1) % buttons.length;
      if (event.key === "Home") targetIndex = 0;
      if (event.key === "End") targetIndex = buttons.length - 1;
      buttons[targetIndex].focus();
      selectSetup(buttons[targetIndex].dataset.setup);
    });
  });
}

function renderSummary() {
  const setup = setups.find((item) => item.id === activeSetup);
  const available = Object.keys(frameCounts[activeSetup] || {}).length;
  document.getElementById("selectedSetupName").textContent = setup.label;
  document.getElementById("selectedSetupDescription").textContent = setup.description;
  document.getElementById("availabilityCount").textContent = `${available} of ${models.length} GIFs available`;
}

function renderModelGrid() {
  const grid = document.getElementById("modelGrid");
  const counts = frameCounts[activeSetup] || {};
  grid.innerHTML = models
    .map((model) => {
      const count = counts[model.id];
      const trajectory = count
        ? `<img src="gifs/${activeSetup}--${model.id}.gif?v=omnilayout-format" alt="${model.label} routing iterations for ${setups.find((item) => item.id === activeSetup).label}" loading="lazy">`
        : `<div class="trajectory-empty" aria-label="Result pending">Result pending</div>`;
      const status = count
        ? `<span class="status-ready">Available</span><span>${count} iteration${count === 1 ? "" : "s"}</span>`
        : `<span class="status-pending">Pending</span><span>&nbsp;</span>`;
      return `
        <article class="model-card">
          <div class="model-card-header">
            <h3>${model.label}</h3>
            <span class="model-tag">${model.type}</span>
          </div>
          <div class="trajectory">${trajectory}</div>
          <div class="model-card-footer">${status}</div>
        </article>
      `;
    })
    .join("");
}

function selectSetup(setupId) {
  activeSetup = setupId;
  renderSetupPicker();
  renderSummary();
  renderModelGrid();
}

renderSetupPicker();
renderSummary();
renderModelGrid();
