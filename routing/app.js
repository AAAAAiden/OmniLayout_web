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
  { id: "claude-opus-4-8", label: "Claude Opus 4.8", type: "Commercial" },
  { id: "gemini-3-1-pro-preview", label: "Gemini 3.1 Pro-Preview", type: "Commercial" },
  { id: "gemini-2-5-flash-lite", label: "Gemini 2.5 Flash-lite", type: "Commercial" },
  { id: "llama-4-maverick", label: "LLaMA 4 Maverick", type: "Open source" },
  { id: "ministral-14b", label: "Ministral 14B", type: "Open source" },
  { id: "qwen3-5-9b", label: "Qwen3.5-9B", type: "Open source" },
  { id: "qwen3-235b-a22b", label: "Qwen3-235B-A22B", type: "Open source" },
];

const frameCounts = {
  exp0: {
    "claude-opus-4-8": 9,
    "gemini-2-5-flash-lite": 25,
    "gemini-3-1-pro-preview": 10,
    "gpt-5-5": 24,
    "gpt-5-mini": 25,
    "llama-4-maverick": 25,
    "ministral-14b": 24,
    "qwen3-5-9b": 5,
  },
};

const emptyRow = () => Array(15).fill(null);

const results = {
  exp0: {
    "gpt-5-5": ["21.71", "24.78", "57.70", "39.53", "0.39", "48.06", "42.87", "5.19", "0.00", "578.95", "29.11", "1.97", "1.000", "1060.60", "16.97"],
    "gpt-5-mini": ["9.86", "7.63", "56.73", "56.91", "8.10", "91.75", "88.98", "2.77", "0.00", "289.96", "11.16", "1.78", "1.000", "368.76", "18.38"],
    "claude-opus-4-8": ["10.65", "9.27", "52.63", "62.76", "14.59", "104.32", "101.89", "2.43", "0.00", "332.91", "5.64", "1.71", "1.000", "73.85", "8.61"],
    "gemini-3-1-pro-preview": ["2.20", "3.12", "10.24", "10.47", "0.17", "116.24", "111.00", "5.24", "0.00", "897.01", "35.19", "1.95", "0.188", "1312.46", "6.40"],
    "gemini-2-5-flash-lite": ["0.27", "0.20", "47.17", "8.88", "4.55", "216.17", "215.06", "1.11", "0.00", "98.94", "2.58", "1.10", "0.540", "65.48", "22.51"],
    "llama-4-maverick": ["0.33", "0.59", "32.53", "25.77", "22.28", "191.07", "187.68", "3.39", "0.00", "210.01", "2.50", "1.31", "0.472", "576.45", "9.09"],
    "ministral-14b": ["0.39", "0.72", "70.68", "43.24", "23.94", "230.99", "226.89", "4.10", "0.22", "230.00", "4.40", "1.58", "0.896", "399.42", "9.60"],
    "qwen3-5-9b": ["1.40", "0.95", "20.28", "15.71", "6.75", "130.87", "129.93", "0.94", "0.76", "264.21", "1.47", "1.16", "0.262", "477.12", "18.81"],
    "qwen3-235b-a22b": ["0.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.00", "0.002", "63.67", "1.00"],
  },
  exp1: {
    "gpt-5-5": ["24.78", "20.99", "59.62", "10.07", "0.27", "9.59", "5.58", "4.01", "0.00", "332.51", "15.50", "1.96", "1.000", "779.40", "20.26"],
    "gpt-5-mini": ["9.85", "6.35", "69.29", "29.86", "2.22", "21.16", "19.92", "1.24", "0.00", "113.28", "4.56", "1.75", "0.998", "355.64", "23.88"],
    "claude-opus-4-8": ["13.44", "7.49", "67.22", "30.18", "5.08", "19.51", "18.17", "1.35", "0.00", "131.14", "3.27", "1.74", "1.000", "83.79", "9.75"],
    "gemini-3-1-pro-preview": ["0.44", "0.41", "1.71", "1.36", "0.00", "45.72", "41.61", "4.11", "0.00", "448.71", "24.61", "1.94", "0.036", "2034.23", "14.39"],
    "gemini-2-5-flash-lite": ["0.23", "0.17", "67.86", "12.45", "4.97", "30.44", "29.39", "1.05", "0.00", "40.20", "0.99", "1.03", "0.740", "64.33", "24.71"],
    "llama-4-maverick": ["0.20", "0.29", "36.78", "11.20", "7.54", "18.51", "18.05", "0.47", "0.00", "47.03", "0.70", "1.30", "0.446", "531.87", "9.94"],
    "ministral-14b": ["0.79", "0.76", "84.30", "26.63", "10.04", "34.13", "31.97", "2.15", "0.00", "85.78", "1.25", "1.47", "0.972", "388.79", "9.97"],
    "qwen3-5-9b": ["1.39", "0.76", "21.80", "14.80", "4.78", "79.42", "78.95", "0.48", "0.00", "200.14", "1.17", "1.35", "0.266", "506.80", "21.29"],
    "qwen3-235b-a22b": [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
  },
  exp2: {
    "gpt-5-5": ["20.96", "24.46", "58.40", "36.99", "0.39", "37.81", "32.90", "4.91", "0.00", "549.45", "26.34", "1.97", "1.000", "1139.14", "17.09"],
    "gpt-5-mini": ["9.91", "7.40", "57.86", "53.31", "7.34", "80.85", "78.95", "1.91", "0.00", "247.67", "8.61", "1.75", "1.000", "385.25", "20.00"],
    "claude-opus-4-8": ["11.18", "9.50", "54.48", "58.21", "12.64", "87.85", "85.02", "2.83", "0.00", "305.63", "5.64", "1.76", "1.000", "75.09", "9.13"],
    "gemini-3-1-pro-preview": ["1.82", "2.61", "9.40", "8.69", "0.06", "111.13", "106.18", "4.95", "1.28", "925.45", "36.41", "1.96", "0.156", "1692.32", "12.09"],
    "gemini-2-5-flash-lite": ["0.11", "0.13", "51.94", "8.39", "4.62", "111.09", "110.52", "0.57", "0.00", "61.98", "0.27", "0.86", "0.620", "92.98", "23.34"],
    "llama-4-maverick": ["0.26", "0.47", "37.71", "17.48", "13.20", "64.76", "63.61", "1.15", "0.00", "99.09", "0.88", "1.21", "0.476", "509.38", "9.68"],
    "ministral-14b": ["0.49", "0.78", "80.50", "37.75", "18.75", "130.51", "127.31", "3.20", "0.42", "161.60", "2.10", "1.39", "0.960", "296.62", "9.71"],
    "qwen3-5-9b": ["1.85", "1.00", "25.54", "17.57", "6.82", "98.55", "97.20", "1.35", "0.00", "226.80", "1.06", "1.19", "0.330", "436.80", "20.53"],
    "qwen3-235b-a22b": [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
  },
  exp3: {
    "gpt-5-5": ["21.75", "25.64", "56.88", "38.24", "0.62", "41.91", "36.82", "5.09", "0.00", "554.48", "28.10", "1.96", "1.000", "1037.56", "16.58"],
    "gpt-5-mini": ["9.08", "7.15", "54.25", "54.24", "7.76", "89.13", "86.92", "2.21", "0.00", "255.54", "6.86", "1.69", "0.992", "413.85", "19.42"],
    "claude-opus-4-8": ["11.28", "9.50", "53.16", "55.27", "12.63", "85.30", "82.57", "2.73", "0.00", "280.41", "4.01", "1.61", "1.000", "74.36", "8.83"],
    "gemini-3-1-pro-preview": ["2.59", "3.79", "12.36", "15.54", "0.40", "135.57", "131.56", "4.01", "4.10", "864.10", "32.11", "1.92", "0.244", "1198.73", "6.05"],
    "gemini-2-5-flash-lite": ["0.09", "0.12", "55.21", "5.37", "2.62", "58.78", "55.76", "3.02", "0.00", "40.81", "0.38", "0.40", "0.658", "35.78", "24.36"],
    "llama-4-maverick": ["0.27", "0.73", "46.07", "30.20", "24.21", "123.89", "122.23", "1.67", "0.00", "153.30", "1.94", "1.25", "0.644", "490.12", "9.41"],
    "ministral-14b": ["0.27", "0.50", "52.18", "29.91", "15.70", "205.97", "203.78", "2.20", "1.06", "177.15", "2.03", "1.30", "0.754", "352.02", "9.67"],
    "qwen3-5-9b": ["0.09", "0.10", "2.66", "1.75", "0.43", "81.18", "80.95", "0.23", "0.00", "144.77", "3.55", "1.45", "0.044", "241.65", "4.86"],
    "qwen3-235b-a22b": [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
  },
  exp4: {
    "gpt-5-5": ["22.61", "30.34", "51.10", "43.11", "0.42", "63.43", "57.92", "5.51", "0.00", "606.21", "30.81", "1.98", "0.996", "988.91", "15.80"],
    "gpt-5-mini": ["9.15", "10.47", "36.99", "43.89", "5.35", "77.59", "74.60", "2.99", "0.00", "309.55", "15.49", "1.92", "0.892", "360.66", "17.66"],
    "claude-opus-4-8": ["14.12", "17.27", "54.66", "56.60", "11.39", "90.01", "86.00", "4.01", "0.00", "411.87", "14.29", "1.96", "1.000", "72.88", "8.08"],
    "gemini-3-1-pro-preview": ["4.08", "5.28", "12.08", "14.12", "0.14", "109.10", "105.89", "3.20", "2.21", "725.41", "30.71", "1.96", "0.272", "1131.42", "6.42"],
    "gemini-2-5-flash-lite": ["0.47", "1.10", "16.92", "13.37", "8.14", "255.80", "249.48", "6.33", "0.00", "222.90", "14.61", "1.62", "0.342", "79.62", "14.63"],
    "llama-4-maverick": ["1.40", "3.75", "31.08", "18.74", "13.20", "139.05", "136.93", "2.11", "0.00", "236.45", "9.42", "1.81", "0.454", "550.79", "9.20"],
    "ministral-14b": ["0.80", "2.68", "58.08", "43.45", "24.30", "234.28", "230.20", "4.09", "0.00", "258.26", "14.73", "1.82", "0.840", "356.41", "9.34"],
    "qwen3-5-9b": ["0.15", "0.28", "3.56", "4.17", "2.08", "332.02", "331.86", "0.16", "0.00", "371.58", "5.27", "1.66", "0.088", "322.00", "10.80"],
    "qwen3-235b-a22b": [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
  },
  exp5: {
    "gpt-5-5": ["27.98", "25.60", "56.54", "9.12", "0.26", "9.35", "5.27", "4.08", "0.00", "326.57", "17.88", "1.96", "0.998", "737.76", "20.78"],
    "gpt-5-mini": ["6.82", "5.68", "57.36", "24.57", "2.02", "22.57", "20.77", "1.80", "0.00", "118.84", "7.49", "1.74", "0.914", "410.83", "23.65"],
    "claude-opus-4-8": ["14.89", "13.71", "63.06", "32.30", "5.32", "26.36", "23.84", "2.52", "0.00", "200.93", "10.02", "1.80", "1.000", "85.43", "9.77"],
    "gemini-3-1-pro-preview": ["1.17", "1.01", "4.65", "3.14", "0.15", "55.07", "51.63", "3.44", "0.00", "551.93", "22.27", "1.76", "0.090", "1876.04", "15.40"],
    "gemini-2-5-flash-lite": ["0.46", "0.71", "32.99", "12.37", "5.07", "80.73", "76.97", "3.76", "0.00", "101.73", "8.81", "1.38", "0.494", "59.99", "23.20"],
    "llama-4-maverick": ["1.11", "2.77", "49.11", "13.59", "7.59", "21.78", "21.20", "0.58", "0.00", "83.54", "4.48", "1.48", "0.620", "506.25", "9.97"],
    "ministral-14b": ["0.96", "2.20", "54.63", "18.12", "6.54", "28.53", "27.77", "0.77", "0.00", "92.23", "4.45", "1.62", "0.818", "345.07", "10.00"],
    "qwen3-5-9b": ["0.12", "0.15", "2.56", "1.70", "0.72", "102.32", "102.09", "0.23", "0.00", "178.20", "5.55", "1.77", "0.044", "149.93", "4.95"],
    "qwen3-235b-a22b": [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
  },
};

const activeSetup = "exp0";
const galleryModelIds = [
  "gpt-5-5",
  "gpt-5-mini",
  "claude-opus-4-8",
  "gemini-3-1-pro-preview",
  "gemini-2-5-flash-lite",
  "llama-4-maverick",
  "ministral-14b",
  "qwen3-5-9b",
];


function renderModelGrid() {
  const grid = document.getElementById("modelGrid");
  const counts = frameCounts[activeSetup] || {};
  const galleryModels = galleryModelIds
    .map((id) => models.find((model) => model.id === id))
    .filter(Boolean);
  const groundTruthCard = `
    <article class="model-card model-card-reference">
      <div class="model-card-header">
        <h3>Human Engineer Reference Design</h3>
        <span class="model-tag">Ground truth</span>
      </div>
      <div class="trajectory">
        <img src="gifs/ground-truth.png?v=adafruit-bluefruit-uart-v18" alt="Ground-truth Adafruit Bluefruit LE UART Friend PCB routing with top and bottom layers shown vertically">
      </div>
      <div class="model-card-footer">
        <span class="status-ready">Reference</span><span>Top and bottom layers</span>
      </div>
    </article>
  `;
  const modelCards = galleryModels
    .map((model) => {
      const count = counts[model.id];
      if (!count) return "";
      return `
        <article class="model-card">
          <div class="model-card-header">
            <h3>${model.label}</h3>
            <span class="model-tag">${model.type}</span>
          </div>
          <div class="trajectory">
            <div class="trajectory-loading" aria-hidden="true">Loading synchronized animation...</div>
            <img data-gif-src="gifs/${activeSetup}--${model.id}.gif?v=adafruit-bluefruit-uart-v17" alt="${model.label} No Tools routing iterations with Net RR and Pin RR metrics baked into each frame" hidden>
          </div>
          <div class="model-card-footer">
            <span class="status-ready">Available</span>
          </div>
        </article>
      `;
    })
    .join("");
  grid.innerHTML = groundTruthCard + modelCards;
}

function showDataModal() {
  document.getElementById("dataModal").classList.add("open");
}

function closeDataModal() {
  document.getElementById("dataModal").classList.remove("open");
}

function showCodeModal() {
  document.getElementById("codeModal").classList.add("open");
}

function closeCodeModal() {
  document.getElementById("codeModal").classList.remove("open");
}

document.addEventListener("click", (event) => {
  if (event.target === document.getElementById("dataModal")) closeDataModal();
  if (event.target === document.getElementById("codeModal")) closeCodeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDataModal();
    closeCodeModal();
  }
});

const ROUTING_GIF_LOOP_MS = 30_000;
let routingGifLoopId = 0;
let routingGifRestartTimer = null;

async function synchronizeGifs() {
  const images = [...document.querySelectorAll("img[data-gif-src]")];
  const loaded = await Promise.all(
    images.map((image) => new Promise((resolve) => {
      const preload = new Image();
      preload.onload = () => resolve({ image, source: image.dataset.gifSrc, ok: true });
      preload.onerror = () => resolve({ image, source: image.dataset.gifSrc, ok: false });
      preload.src = image.dataset.gifSrc;
    })),
  );

  const ready = [];
  loaded.forEach(({ image, source, ok }) => {
    const loading = image.previousElementSibling;
    if (!ok) {
      loading.textContent = "Animation unavailable";
      return;
    }
    ready.push({ image, source, loading });
  });

  function restartGifs() {
    const syncId = `${Date.now()}-${routingGifLoopId + 1}`;
    routingGifLoopId += 1;

    requestAnimationFrame(() => {
      ready.forEach(({ image, source, loading }) => {
        image.src = `${source}#sync-${syncId}`;
        image.hidden = false;
        if (loading.isConnected) loading.remove();
      });
    });

    window.clearTimeout(routingGifRestartTimer);
    routingGifRestartTimer = window.setTimeout(restartGifs, ROUTING_GIF_LOOP_MS);
  }

  restartGifs();
}

renderModelGrid();
synchronizeGifs();
