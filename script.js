// ----------------------------------- GLOBALS ----------------------------------- //
const screenThoughts = document.querySelector(".screen-2-thoughts")
const screenEmotions = document.querySelector(".screen-3-emotions");
const screenAnalyze = document.querySelector(".screen-4-analyze");

const MAX_THOUGHTS = 8;
const thoughtCounter = document.getElementById("thought-counter");
const cloudsContainer = document.getElementById("clouds-container");
const cloudDropZone = document.getElementById("cloud-drop-zone");
const cloudMoveButton = document.getElementById("cloud-move-button");
const thoughtInput = document.getElementById("thought-input");


const MAX_EMOTIONS = 18;
const DEFAULT_EMOTIONS = ["Happy", "Lonely", "Calm", "Ashamed", "Proud", "Anxious", "Hopeful", "Angry", "Loved", "Sad", "Excited", "Guilty"]
const emotionsContainer = document.getElementById("emotions-container");
const INPUT_EMOJIS = ["(≧◡≦)", "(*＾▽＾)／", "(≧ω≦)", "(=^･ω･^=)", "(* ´ ▽ ` *)"]
const emotionInput = document.getElementById("emotions-input");
let totalEmotions = [];


let saveButtonOn = false;
let isSaving = false;


const sparkleEffekt = document.querySelector(".sparkle-effect");


let thoughtsAndEmotions = [];
let savedThoughtsAndEmotions = [];


// Start position -> clouds
const CLOUD_TOP_SPACING = 0;
const CLOUD_LEFT_SPACING = 15;
const CLOUD_GAP = 25;

// position on specific box
let offsetX = 0;
let offsetY = 0;
let offsetXEmotionsContainer = 0;
let offsetYEmotionsContainer = 0;
let offsetXThoughtsPanel = 0;
let offsetYThoughtsPanel = 0;


// Default Object state
let activeObject = null;
let cloudInZone = null;
let isDragging = false;

const DEFAULT_CUTOFF = 7;
let myBarChart = null;

// ----------------------------------- FUNCTIONS ----------------------------------- //
// ===== Navigations ===== //
function menuNavigation() {
  const homeButton = document.getElementById("home-button");
  if (homeButton) {
    homeButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  const homeColoredButton = document.querySelector(".home-colored-button");
  if (homeColoredButton) {
    homeColoredButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  const thoughtsButton = document.getElementById("thoughts-button");
  if (thoughtsButton) {
    thoughtsButton.addEventListener("click", () => {
      window.location.href = "thoughts.html";
    });
  }

  const emotionsButton = document.getElementById("emotions-button");
  if (emotionsButton) {
    emotionsButton.addEventListener("click", () => {
      window.location.href = "emotions.html";
    })
  }

  const analyzeButton = document.getElementById("analyze-button");
  if (analyzeButton) {
    analyzeButton.addEventListener("click", () => {
      window.location.href = "analyze.html";
    })
  }
}


// ===== Page feature ===== //
function featureThoughts() {
  const thoughtsContainer = document.getElementById("thoughts-container");

  if (thoughtInput) {
    const addThoughtButton = document.getElementById("add-thought-button");
    hoverSparkleEffect(addThoughtButton, sparkleEffekt, "rgb(204, 73, 255)")

    let savedThoughtsJson = localStorage.getItem("thoughtsAndEmotions")
    thoughtsAndEmotions = JSON.parse(savedThoughtsJson) || [];

    updateThoughtCounter();

    function addThought() {
      const cleanValue = thoughtInput.value.trim();
      if (cleanValue === "" || thoughtsAndEmotions.length >= MAX_THOUGHTS) return;

      createFloatingClouds(cleanValue, thoughtsContainer);

      thoughtsAndEmotions.push({ thought: cleanValue, emotions: [] });
      localStorage.setItem("thoughtsAndEmotions", JSON.stringify(thoughtsAndEmotions));

      thoughtInput.value = "";
      updateThoughtCounter();
    }

    thoughtsAndEmotions.forEach(entry => createFloatingClouds(entry.thought, thoughtsContainer));

    thoughtInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") addThought();
    });

    addThoughtButton.addEventListener("click", addThought);
  }
}
function thoughtsRecreateOnDocEmotions() {
  if (cloudsContainer) {
    let thoughtsJson = localStorage.getItem("thoughtsAndEmotions");
    thoughtsAndEmotions = JSON.parse(thoughtsJson) || [];

    function resetZone(cloudWasSaved) {
      if (!cloudWasSaved) {
        cloudInZone.style.top = cloudInZone.dataset.positionTop;
        cloudInZone.style.left = cloudInZone.dataset.positionLeft;

        cloudInZone.classList.remove("active-cloud", "shiny");

        cloudsSyncAnimation(cloudsContainer);
      }

      cloudInZone.style.transform = "";
      cloudDropZone.style.visibility = "";
      cloudMoveButton.style.visibility = "";
      cloudInZone = null;

      cloudMoveButton.textContent = "Release";
    }

    if (cloudMoveButton) {
      cloudMoveButton.addEventListener("click", () => {
        if (isSaving) return;
        const emotionBoxes = document.querySelectorAll(".emotion-box");
        if (saveButtonOn) {
          saveButtonOn = false;
          isSaving = true;

          cloudMoveButton.classList.add("consumed");

          const saveCloud = cloudInZone
          saveCloud.classList.add("consumed");
          saveCloud.classList.remove("shiny");

          let savedThoughtsJson = localStorage.getItem("savedThoughtsAndEmotions");
          savedThoughtsAndEmotions = JSON.parse(savedThoughtsJson) || [];

          const thoughtToSave = thoughtsAndEmotions[saveCloud.dataset.thoughtNumber];
          const todaysDate = new Date().toISOString().split("T")[0];
          thoughtToSave.savedDate = todaysDate;
          savedThoughtsAndEmotions.push(thoughtToSave);
          localStorage.setItem("savedThoughtsAndEmotions", JSON.stringify(savedThoughtsAndEmotions));

          thoughtsAndEmotions.splice(saveCloud.dataset.thoughtNumber, 1);
          localStorage.setItem("thoughtsAndEmotions", JSON.stringify(thoughtsAndEmotions));

          resetCloudLayout();

          saveCloud.addEventListener("animationend", (event) => {
            if (event.animationName !== "consumed") return;
            saveCloud.remove();

            resetZone(true);
            isSaving = false;
            cloudMoveButton.classList.remove("consumed");
          })
        } else {
          resetZone(false);
          resetCloudLayout();
        }
        emotionRebuild(emotionBoxes, "visible");
      })
    }

    for (let thoughtIndex = 0; thoughtIndex < thoughtsAndEmotions.length; thoughtIndex++) {

      const cloud = createFloatingClouds(thoughtsAndEmotions[thoughtIndex].thought, cloudsContainer);
      cloud.dataset.thoughtNumber = thoughtIndex

      if (thoughtIndex > 3) {
        cloud.style.visibility = "hidden";
      }

      positionObject(thoughtIndex, cloud, CLOUD_TOP_SPACING, CLOUD_LEFT_SPACING, CLOUD_GAP);

      pressObject("mousedown", cloud);
      pressObject("touchstart", cloud);
    }
    dropObjectCloud("mouseup", cloudDropZone, cloudMoveButton, "active-cloud");
    dropObjectCloud("touchend", cloudDropZone, cloudMoveButton, "active-cloud");
  }
}

// ===== Creation ===== //
function createFloatingClouds(input, container) {
  const cloud = document.createElement("div");
  cloud.classList.add("thought-cloud");

  const cloudImg = document.createElement("img");
  cloudImg.src = "assets/images/ai-generated/thought.png";

  const cloudText = document.createElement("span");
  cloudText.classList.add("cloud-text");

  cloudText.textContent = input;

  const cloudRemoveButton = document.createElement("button");
  cloudRemoveButton.classList.add("cloud-remove-button");
  cloudRemoveButton.textContent = "X";

  cloudRemoveButton.addEventListener("click", () => {
    cloud.remove();
    const cloudPosition = thoughtsAndEmotions.findIndex(
      (entry) => entry.thought === cloudText.textContent
    );

    if (cloudPosition !== -1) thoughtsAndEmotions.splice(cloudPosition, 1);
    localStorage.setItem("thoughtsAndEmotions", JSON.stringify(thoughtsAndEmotions));

    updateThoughtCounter();
    resetCloudLayout();
  })

  let inputLength = input.replace(/ +/g, " ").length;

  // cloud font size scales based on input length
  const startSize = 14;
  const shrinkFactor = 0.865;
  let cloudFontSize = Math.max(5, startSize - (Math.sqrt(inputLength) * shrinkFactor));

  cloudText.style.fontSize = cloudFontSize + "cqw";

  cloud.appendChild(cloudImg);
  cloud.appendChild(cloudText);
  cloud.appendChild(cloudRemoveButton);
  container.appendChild(cloud);

  cloudsSyncAnimation(container);

  return cloud;
}
function cloudsSyncAnimation(scope) {
  const clouds = scope.querySelectorAll(".thought-cloud");

  if (clouds.length === 0) return;
  reflowAnimation(clouds, "float-cloud");
}
function createEmotions() {
  // Set start position
  let EMOTION_LEFT_SPACING = 0;
  const EMOTION_TOP_SPACING = 5;
  const EMOTION_GAP = 15;

  const savedEmotions = localStorage.getItem("addEmotions")

  hoverSparkleEffect(screenEmotions, sparkleEffekt, "rgba(255, 255, 255, 0.35)")

  if (savedEmotions === null) {
    totalEmotions = [...DEFAULT_EMOTIONS]
    localStorage.setItem("addEmotions", JSON.stringify(totalEmotions));
  } else {
    totalEmotions = JSON.parse(savedEmotions);
  }

  if (emotionsContainer) {
    const emotionsAmount = totalEmotions.length;

    for (let emotionCounter = 0; emotionCounter < emotionsAmount; emotionCounter++) {
      if (emotionCounter < MAX_EMOTIONS) {


        const emotionBox = document.createElement("div");
        emotionBox.classList.add("emotion-box");

        const emotionText = document.createElement("span");
        emotionText.classList.add("emotion-text");
        emotionText.textContent = totalEmotions[emotionCounter];

        const emotionRemove = document.createElement("button");
        emotionRemove.classList.add("emotion-remove");
        emotionRemove.textContent = "X";

        emotionRemove.addEventListener("click", () => {
          emotionBox.remove();
          const emotionPosition = totalEmotions.indexOf(emotionText.textContent);
          totalEmotions.splice(emotionPosition, 1);
          localStorage.setItem("addEmotions", JSON.stringify(totalEmotions));

          recreateEmotions();
        })

        emotionBox.appendChild(emotionText);
        emotionBox.appendChild(emotionRemove);
        emotionsContainer.appendChild(emotionBox);

        emotionBox.classList.add("pulse");

        const PER_COLUMN = 6;
        const COLUMN_WIDTH = 40;

        const column = Math.floor(emotionCounter / PER_COLUMN);
        const rowInColumn = emotionCounter % PER_COLUMN;
        const EMOTION_LEFT_SPACING = column * COLUMN_WIDTH;

        positionObject(rowInColumn, emotionBox, EMOTION_TOP_SPACING, EMOTION_LEFT_SPACING, EMOTION_GAP)

        pressObject("mousedown", emotionBox);
        pressObject("touchstart", emotionBox);
      }
    }
  }
}
function barChart(days) {
  if (screenAnalyze) {
    if (myBarChart) myBarChart.destroy();
    const emotionTally = {};

    let savedThoughtsAndEmotionsJson = localStorage.getItem("savedThoughtsAndEmotions")
    savedThoughtsAndEmotions = JSON.parse(savedThoughtsAndEmotionsJson) || [];

    const cutoff = cutoffFromDays(days);
    const keptEntries = savedThoughtsAndEmotions.filter(entry => entry.savedDate >= cutoff);

    for (let entryEmotionsNumber = 0; entryEmotionsNumber < keptEntries.length; entryEmotionsNumber++) {
      const currentEmotions = keptEntries[entryEmotionsNumber].emotions

      for (let emotionNumber = 0; emotionNumber < currentEmotions.length; emotionNumber++) {
        const thatEmotion = currentEmotions[emotionNumber]
        if (!emotionTally[thatEmotion]) {
          emotionTally[thatEmotion] = 1;
        } else {
          emotionTally[thatEmotion] += 1;
        }
      }
    }

    const sorted = Object.entries(emotionTally).sort((entryA, entryB) => entryB[1] - entryA[1]);
    const labels = sorted.map(entry => entry[0]);
    const numbers = sorted.map(entry => entry[1]);
    const barChartElement = document.getElementById("bar-chart");
    const emptyMessage = document.getElementById("bar-chart-empty");

    if (labels.length === 0) {
      barChartElement.style.display = "none";
      emptyMessage.style.display = "block";
      return;
    }
    barChartElement.style.display = "block";
    emptyMessage.style.display = "none";

    const responsiveFont = () => Math.round(window.innerWidth * 0.015);

    const barConfig = {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Times picked",
          data: numbers,
          backgroundColor: ["rgba(255, 0, 234, 0.85)", "rgba(195, 0, 255, 0.85)"],
          borderRadius: 6
        }]
      },

      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },

        animations: {
          x: {
            duration: 900,
            easing: "easeOutQuad",
            from: (context) => context.chart.scales.x.getPixelForValue(0),
            delay: (context) => context.dataIndex * 450
          }
        },

        scales: {
          x: {
            border: { color: "rgba(255, 255, 255, 0.6)" },
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: "rgba(255, 255, 255, 0.85)",
              font: () => ({ size: responsiveFont() })
            },
            grid: { color: "rgba(255, 255, 255, 0.6)" }
          },
          y: {
            ticks: {
              color: "rgba(255, 255, 255, 0.85)",
              autoSkip: false,
              font: () => ({ size: responsiveFont() })
            },
            grid: { display: false }
          }
        }
      }
    }
    myBarChart = new Chart(barChartElement, barConfig)
  }
}

function updateEmotion() {
  const emotionsInput = document.getElementById("emotions-input");
  const addEmotionButton = document.getElementById("add-emotion-button");

  if (emotionsInput) {
    function triggerAddEmotions() {
      const cleanValue = emotionsInput.value.trim();

      const alreadyThere = totalEmotions.some(
        (emotion) => emotion.toLowerCase() === cleanValue.toLowerCase()
      )

      if (totalEmotions.length < MAX_EMOTIONS && cleanValue !== "" && !alreadyThere) {

        totalEmotions.push(cleanValue);
        localStorage.setItem("addEmotions", JSON.stringify(totalEmotions));

        emotionsInput.value = "";

        recreateEmotions();
      }
    }

    emotionsInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") triggerAddEmotions();
    })

    addEmotionButton.addEventListener("click", triggerAddEmotions);
    addEmotionButton.addEventListener("touchstart", triggerAddEmotions);
  }
}

// ===== Position Objects ===== //
function positionObject(counterObject, rawObject, topSpacing, leftSpacing, gapBetween) {

  const gapHeight = gapBetween * counterObject;

  // dataset = home position, drag-and-drop reset snaps back to it
  rawObject.dataset.positionTop = topSpacing + gapHeight + "%";
  rawObject.style.top = rawObject.dataset.positionTop;

  rawObject.dataset.positionLeft = leftSpacing + "%";
  rawObject.style.left = rawObject.dataset.positionLeft;
}
function resetCloudLayout() {
  if (!cloudsContainer) return;
  const clouds = cloudsContainer.querySelectorAll(".thought-cloud:not(.consumed)");
  for (let cloudNumber = 0; cloudNumber < clouds.length; cloudNumber++) {
    clouds[cloudNumber].dataset.thoughtNumber = cloudNumber;
    clouds[cloudNumber].style.visibility = cloudNumber > 3 ? "hidden" : "visible";
    if (!clouds[cloudNumber].classList.contains("active-cloud")) {
      positionObject(cloudNumber, clouds[cloudNumber], CLOUD_TOP_SPACING, CLOUD_LEFT_SPACING, CLOUD_GAP);
    }
  }
}
function emotionRebuild(emotionBoxes, visibility) {

  for (let emotionNumber = 0; emotionNumber < emotionBoxes.length; emotionNumber++) {
    emotionBoxes[emotionNumber].style.visibility = visibility
    emotionBoxes[emotionNumber].style.animation = "";
    emotionBoxes[emotionNumber].classList.remove("consumed");

    reflowAnimation(emotionBoxes[emotionNumber], "pulse");

    emotionBoxes[emotionNumber].style.top = emotionBoxes[emotionNumber].dataset.positionTop;
    emotionBoxes[emotionNumber].style.left = emotionBoxes[emotionNumber].dataset.positionLeft;
  }
}

// ===== Dragging Objects ===== //
function pressObject(on, rawObject) {
  rawObject.addEventListener(on, (event) => {
    activeObject = rawObject;
    isDragging = true;

    activeObject.style.cursor = "grabbing";

    // disable "can't drop here-Symbol" for dragging
    event.preventDefault();

    // Every press changes position -> new dimensions needed
    const rectObject = rawObject.getBoundingClientRect();
    const rectEmotionsContainer = emotionsContainer.getBoundingClientRect();
    const rectThoughtsPanel = cloudsContainer.getBoundingClientRect();

    const point = getPoint(event);
    offsetX = point.x - rectObject.left;
    offsetY = point.y - rectObject.top;

    offsetXEmotionsContainer = rectEmotionsContainer.left;
    offsetYEmotionsContainer = rectEmotionsContainer.top;

    offsetXThoughtsPanel = rectThoughtsPanel.left;
    offsetYThoughtsPanel = rectThoughtsPanel.top;
  });
}
function moveObject(move) {
  // keep grab point under cursor while dragging
  document.addEventListener(move, (event) => {
    if (!isDragging) return;

    const point = getPoint(event);
    if (activeObject.classList.contains("emotion-box")) {
      const rectEmotionsContainer = emotionsContainer.getBoundingClientRect();
      activeObject.style.left = ((point.x - offsetX - offsetXEmotionsContainer) / rectEmotionsContainer.width) * 100 + "%";
      activeObject.style.top = ((point.y - offsetY - offsetYEmotionsContainer) / rectEmotionsContainer.height) * 100 + "%";
    } else {
      const rectThoughtsPanel = cloudsContainer.getBoundingClientRect();
      activeObject.style.left = ((point.x - offsetX - offsetXThoughtsPanel) / rectThoughtsPanel.width) * 100 + "%";
      activeObject.style.top = ((point.y - offsetY - offsetYThoughtsPanel) / rectThoughtsPanel.height) * 100 + "%";
    }
  })
}
function dropObjectCloud(offCloud, dropZone, releaseButton, activeClass) {
  document.addEventListener(offCloud, (event) => {
    if (!isDragging || !activeObject.classList.contains("thought-cloud")) return;

    isDragging = false;
    activeObject.style.cursor = "grab";

    if (!dropZone) return;

    function invadeZoneCloud(indicatorIsInZone) {
      if (indicatorIsInZone) {
        if (cloudInZone) {
          activeObject.style.top = activeObject.dataset.positionTop;
          activeObject.style.left = activeObject.dataset.positionLeft;
          return;
        }
        if (releaseButton) {
          releaseButton.style.visibility = "visible";
        }
        dropZone.style.visibility = "hidden";

        cloudInZone = activeObject
        cloudInZone.classList.add(activeClass);

        const rectCloudDropZone = cloudDropZone.getBoundingClientRect();
        const centerX = rectCloudDropZone.left + (rectCloudDropZone.width / 2);
        const centerY = rectCloudDropZone.top + (rectCloudDropZone.height / 2);


        cloudInZone.classList.remove("float-cloud")

        const rectThoughtsPanel = cloudsContainer.getBoundingClientRect();
        cloudInZone.style.left = ((centerX - rectThoughtsPanel.left) / rectThoughtsPanel.width) * 100 + "%";
        cloudInZone.style.top = ((centerY - rectThoughtsPanel.top) / rectThoughtsPanel.height) * 100 + "%";
        // centering
        cloudInZone.style.transform = "translate(-50%, -50%)";

        resetCloudLayout();

        const emotionBoxes = document.querySelectorAll(".emotion-box");
        // emotions exist -> reset to default state
        if (emotionBoxes.length > 0) {
          emotionRebuild(emotionBoxes, "visible")
        } else {
          // first visit -> create emotions
          createEmotions();
        }
      }
    }
    invadeZoneCloud(isInZone(getPoint(event), dropZone));
  })
}
function dropObjectEmotion(offEmotion) {
  document.addEventListener(offEmotion, (event) => {
    if (!isDragging || !activeObject.classList.contains("emotion-box")) return;
    isDragging = false;

    activeObject.style.cursor = "grab"

    if (cloudInZone && !isSaving && !activeObject.classList.contains("consumed")) {
      if (isInZone(getPoint(event), cloudDropZone)) consumeEmotion();
    }
  })
}

// ===== Visual effects ===== //
function appearingInputText(scope, texts, time) {
  if (scope) {
    const fullText = texts[Math.floor(Math.random() * texts.length)];
    let letters = 0;

    const typing = setInterval(() => {
      scope.placeholder = fullText.slice(0, letters);
      letters++

      if (letters > fullText.length) {
        clearInterval(typing);
      }
    }, time);
  }
}
function hoverSparkleEffect(scope, sparkleing, color) {

  if (!scope || !sparkleing) return;
  if (sparkleing.dataset.sparkle) return
  sparkleing.dataset.sparkle = true;
  let sparkleInterval = null;

  sparkleing.addEventListener("mouseenter", () => {
    sparkleInterval = setInterval(() => {
      const particleDot = document.createElement("div");
      particleDot.classList.add("particle")

      // spread particles randomly across the width, rising from the bottom
      particleDot.style.left = Math.random() * 100 + "%";
      particleDot.style.bottom = "0px";
      particleDot.style.background = color;
      sparkleing.appendChild(particleDot);
      setTimeout(() => particleDot.remove(), 1000);
    }, 50);
  });

  sparkleing.addEventListener("mouseleave", () => {
    clearInterval(sparkleInterval);
  })
}
function updateThoughtCounter() {
  if (!thoughtCounter) return;

  thoughtCounter.textContent = thoughtsAndEmotions.length + "/" + MAX_THOUGHTS;

  if (thoughtsAndEmotions.length >= MAX_THOUGHTS) {
    thoughtCounter.style.filter = "brightness(1.3)";
    thoughtCounter.classList.add("wobble");
  } else {
    thoughtCounter.style.filter = "";
    thoughtCounter.classList.remove("wobble");
  }
}
function consumeEmotion() {
  const cloudReadyToEat = cloudInZone
  const eatEmotion = activeObject;
  const emotionTextCollected = eatEmotion.querySelector(".emotion-text").textContent;

  eatEmotion.classList.remove("pulse")
  eatEmotion.classList.add("consumed")

  const currentThoughtEmotions = thoughtsAndEmotions[cloudReadyToEat.dataset.thoughtNumber].emotions

  if (cloudReadyToEat) {
    reflowAnimation(cloudReadyToEat, "shiny");

    currentThoughtEmotions.push(emotionTextCollected);
    localStorage.setItem("thoughtsAndEmotions", JSON.stringify(thoughtsAndEmotions));
  }

  eatEmotion.addEventListener("animationend", () => {
    eatEmotion.style.visibility = "hidden";
  }, { once: true });

  if (currentThoughtEmotions.length >= 1) {
    cloudMoveButton.textContent = "Save";
    saveButtonOn = true;
  }
}

// ===== Helpers ===== //
function cutoffFromDays(days) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffString = cutoffDate.toISOString().split("T")[0];

  return cutoffString;
}
function barRangeChart() {
  const selectList = document.getElementById("select-list");
  if (!selectList) return;

  selectList.addEventListener("change", () => {
    const days = Number(selectList.value);
    barChart(days);
  });
}
function recreateEmotions() {
  const emotionBoxes = document.querySelectorAll(".emotion-box");
  for (let emotionNumber = 0; emotionNumber < emotionBoxes.length; emotionNumber++) {
    emotionBoxes[emotionNumber].remove();
  }
  createEmotions();
}
function reflowAnimation(target, animationClass) {
  const elements = target instanceof Element ? [target] : [...target];

  elements.forEach(el => el.classList.remove(animationClass));
  elements[0].getBoundingClientRect();
  elements.forEach(el => el.classList.add(animationClass));
}
function getPoint(event) {
  const touch = event.touches?.[0] || event.changedTouches?.[0];
  if (touch) return { x: touch.clientX, y: touch.clientY };
  return { x: event.clientX, y: event.clientY };
}
function isInZone(point, zone) {
  const zoneRect = zone.getBoundingClientRect();
  return point.x > zoneRect.left &&
    point.x < zoneRect.right &&
    point.y > zoneRect.top &&
    point.y < zoneRect.bottom;
}

// ----------------------------------- INITIALIZE ----------------------------------- //
function init() {
  // Navigation
  menuNavigation();

  // Page feature
  featureThoughts();
  thoughtsRecreateOnDocEmotions();

  createEmotions();
  moveObject("mousemove");
  moveObject("touchmove");
  dropObjectEmotion("mouseup");
  dropObjectEmotion("touchend");

  updateEmotion();
  barChart(DEFAULT_CUTOFF);
  barRangeChart();

  // Visual effects
  appearingInputText(thoughtInput, ["What's on your mind?"], 150);
  appearingInputText(emotionInput, INPUT_EMOJIS, 200);

}

document.addEventListener("DOMContentLoaded", init)

