# Bug Log - Project: Psyche

### Symbols used:
- 🐛 bug
- 🔍 cause / examine
- 🔧 fix
- 💡 idea
- 👀 thing to watch
- ⚠️ warning / careful
- ✅ correct
- ❌ wrong

## 2026-06-20
### **`CSS`** - Clouds overflow

- **🐛:** Text extends beyond the cloud image
<br>![cloud overflow](bug-images/cloud-overflow.png)</br>

- **🔍:** font-size too big for cloud max-width
- **🔧:** Reduced font-size + added maxlength to input in thoughts.html + fixed image shape!
<br>![cloud overflow fixed](bug-images/cloud-overflow-fixed.png)</br>

- **💡:** font-size, text width, and image size all have to agree. When text overflows, sometimes the fix is a better-shaped img, not more CSS.
---

### **`JS`** - Uncaught ReferenceError: thoughtText is not defined

- **🐛:** No Cloud is appearing after hitting enter

![uncaught-reference-error](bug-images/uncaught-reference-error.png)

- **🔍:** not defined: mismatched variable name &rarr; code below will never run &rarr; no clouds apear after hitting enter!

- **🔧:** match the names
```js
// Text create
const thoughtTextCloud = document.createElement("span");
thoughtTextCloud.classList.add("thought-text");
thoughtTextCloud.textContent = thoughtInput.value;
```
- **💡:** "not defined" = the variable name doesn't exist (usually a typo or mismatched name). Different from "null" = the element wasn't found on the page.

## 2026-06-21
### **`CSS`** - `doneButton` apears after pressing any key.
- **🐛:** `doneButton` is created after pressing any button
- **🔍:** the `else`❌ ran on *every* non-Enter keypress &rarr; button appeared immediately, not after 4 clouds.
- **🔧:** Use if instead to specify the action. `if (inputCounter === 4)✅ `
- **💡:** `else` triggers on ALL false cases. For independent checks, use a separate `if`
---
### **`CSS`** - `doneButton` and input field are not adjusted
- **🐛:** `doneButton` pushes the input field to the left.

![done button no push](/bugs/bug-images/done-button-push-text-field.png)

- **🔍** all got `display: flex;` but no one got something like `position: absolute;`
- **🔧:** using `position: absolute;` at `doneButton`.
- **💡:** `position: absolute;` on `doneButton` &rarr; not part of `display: flex;` anymore &rarr; now adjust the rest.

![done button no push](/bugs/bug-images/done-button-no-push.png)
---

### **`CSS`** - adjusted boxes have erratic behavior despite the settings
- **🐛:** Clouds are above the input field.
- **🔍:** `display: flex;`-configs manipulate uncontrolled
- **🔧:** use `border: _px solid _rgb` to understand the positions &rarr; fix.
<br>![done button no push](/bugs/bug-images/use-border.png)</br>

- **💡:** `display: flex` &rarr; `justify-content` and `align-items`, use `top`, `bottom`, `right`, `left`

---

### **`CSS`** - `background` shorthand wipes my settings

- **🐛:** Background stopped using `cover` image showed at wrong size.
- **🔍:** `background: url(...)` is shorthand &rarr; it silently resets `background-size` `-position`, `-repeat` to defaults.
- **🔧:** `background: url(...)` ❌ &rarr; `background-image: url(...)` ✅ 
- **💡** A shorthand resets every sub-property it covers, even ones you didn't write. Using long-hand to keep other settings.

---

### **`HTML`** - screen background only works when id is on `<body>`

- **🐛:** Have to repeat the background settings on every screen, it never worked from `body` alone.
- **🔍:** My `id="screen-1-home"` is defined in a separate `<div>`, not in the `body`.
- **🔧:** `<div id="screen-1-home">`❌ `<body id="screen-1-home">`✅
- **💡:** background doesn't inherit, setting it on `body` won't automatically apply to a CHILD-`<div>` the CHILDren would need its own background. Putting the `id` on `<body>` means body itself carries the image, so it fills the viewport.

## 2026-06-22

### **`CSS`** - `bottom: 50%` does nothing

* 🐛: move `#info-text` up with `bottom: 50%` &rarr; nothing happened
* 🔍: `%` in `top`/`bottom`/`height` is measured against the PARENTs's size. `#row` had no height set &rarr; 50% of (basically) 0 is still 0.
* 🔧: `bottom: 50%` ❌ &rarr; `bottom: 50px` ✅ fixed value, ignores PARENT (or give PARENT height so the % has something to measure against)
* 💡: When a `%` value "does nothing", first question: what's the PARENT, and does it have a size? Same trap bites `height: 100%`.
---
### **`CSS`** - mystery gap under `#info-text` (`<p>`)

* 🐛: A gap stayed under the info text even with `align-items: flex-end` on the row. Bottom edges wouldn't line up.
* 🔍: Browsers give `<p>` a default `margin-top`/`margin-bottom` I never wrote. That invisible bottom margin pushed it up off the flex-end line.
* 🔧: Added `margin: 0;` to `#info-text` &rarr; gap gone.
* 💡: Spacing "out of nowhere" = suspect default browser styles first. `margin: 0` overrieds the browser's hidden default.
---
### **`CSS`** - lining up bottom edges in a flex row

- **🐛**: `#info-text`, input, and done-button wouldn't sit on the same bottom line.
- **🔍**: `align-items: center` was centering them; also the tallest CHILD (done-button, 220px) silently defines the row height, so shorter CHILDren get margin gaps.
- **🔧**: `align-items: flex-end;` on `#row` &rarr; all CHILDren align bottoms. (`align-self: flex-end` does it for ONE CHILD only.)
- **💡**: In flexbox the tallest CHILD sets the line height; alignment is measured against that line.
---
### **`CSS`** - overlay pinned to the wrong place (top-left of page)

- **🐛**: The `::after` shine appeared in the top-left corner of the whole page instead of on the box.
- **🔍**: `position: absolute` pins to the nearest PARENT that has `position: relative`. The box had none &rarr; shine anchored to the whole page.
- **🔧**: PARENT `#thought-counter` &rarr; `position: relative` + `overflow: hidden`. CHILD `::after` &rarr; `position: absolute; top:0; left:0; width:100%; height:100%`.
- **💡**: The overlay pattern = anchor + fill. PARENT `relative` and CHILD `absolute` + `0/0/100%/100%` covered `100%`.
- **👀**: `::after` needs `content: "";` or the layer doesn't exist at all.
---
### **`JS`** - null crash loops forever

- **🐛**: On index.html the console spams the same error hundreds of times (252+), never stops.
- **🔍**: script.js is shared across both pages. The typewriter code uses `thoughtInput`, but the input box only exists on thoughts.html. On index.html `thoughtInput` = null. That line lives inside a `setInterval(..., 120)` &rarr; it retries every 120ms forever &rarr; the null crash repeats infinitely.
- **🔧**: Wrapped the whole typewriter block in `if (thoughtInput) { ... }` so it's skipped entirely when the input doesn't exist on the page.
- **💡**: A bug inside a repeating timer (`setInterval`) repeats WITH the timer &rarr; one mistake becomes infinite spam.
- **👀**: When shared JS runs on multiple pages, guard every block that touches a page-specific element with `if (element) { ... }`. An element missing on one page = null = crash there.
---
### **`ENV`** - file:// security errors & caching weirdness

- **🐛**: "Unsafe attempt to load URL... file: URLs are unique security origins" + "content not cached", when open index.html directly.
- **🔍**: Opening files by double-click runs them as file:// &rarr; browser reports...
- **🔧**: Run a local server (Live Server in VS Code &rarr; "Go Live") &rarr; pages load over http:// instead.
- **💡**: file:// = isolated/locked-down. Never was a bug inside the code -> because of environment

## 2026-06-24
### **`JV`** - `addEventListener` is not a function

- **🐛**: clicking a button threw `Uncaught TypeError: homeButton.addEventListener is not a function`
- **🔍**: I'd switched to `getElementsByClassName` &rarr; returns a list (collection), not one element. A list has no .addEventListener. In addition `if (homeButton)` still passed because an empty collection is truthy.
- **🔧**: `getElementsByClassName("home-button")` ❌ &rarr; `querySelector(".home-button")` ✅ (one element), or loop the collection to add a listener to each
- **💡**: `getElementById` &rarr; one element. `getElementsByClassName` / `querySelectorAll` &rarr; a list. Lists don't have element methods, and a list can still fool an if check.

---

### **`CSS`** - `height: 80%` does nothing on a div

- **🐛**: `height: 80%` on `#cloud-store` was ignored completely
- **🔍**: `%` height is measured against the PARENT's height. But `div`, `body`, `html` all default to `height: auto` &rarr; 80% of nothing = nothing. 
- **🔧**: build the chain from the top &rarr; `html, body { height: 100%; }`, `html` is the special link, its 100% measures against the viewport, then height flows down html &rarr; body &rarr; child
- **💡**: percentage heights need an unbroken chain of real heights all the way up to `<html>`. `html` is the one that touches the screen.

## 2026-06-27
### **`JS`** - Cannot read properties of null (reading `appendChild`)

- **🐛**: Crash on emotions.html when rebuilding clouds.

![Cannot read prperties of null](/bugs/bug-images/read-properties-of-null.png)

- **🔍**: `thoughtsContainer` is null, because it only exists on thoughts.html &rarr; Cannot read `appendChild` of null
```JS 
const thoughtsContainer = document.getElementById("thoughts-container");
```
- **🔧**: Pass container in as a parameter so the caller decides where:
```JS
function createFloatingClouds(input, container) {
  ...
  container.appendChild(divClouds); // whoever calls decides where
}

createFloatingClouds(thoughtInput.value, thoughtsContainer);                      // thoughts page
createFloatingClouds(thoughtsArray[thoughtsNumber], thoughtsCollectedContainer);  // emotions page
```
- **💡**: `Cannot read properties of null` almost always means an element wasn't found 

## 2026-06-28
### **`JS`** - Sparkle particles stacked +20 in every Enter

- **🐛**: Hovering the readyButton spawned more and more particles each time I pressed Enter &rarr; +20, +40, +60...

![Sparkle particles stacked](/bugs/bug-images/particles-stacked.png)

- **🔍**: `sparkleEffect()` was called inside `keydown`, in the `if (inputCounter === MAX_THOUGHTS)` block. Once the counter hit MAX, that block stayed true, so every following Enter ran `sparkleEffect()` again, and each call adds a NEW `mouseenter` listener. More listeners = more intervals = stacking particles.
- **🔧**: Created a flag `sparkleEffectSwitch = true;` which changes to `sparkleEffectSwitch = false;` after `sparkleEffect()` was called OR just load it once in init() (then no risk to manage, maybe better one) BUT it's much more code an more complicated!
- **💡**: `if`-guard stops code from running, but it doesn't fix code that's in the wrong place, IMPORTANT: load = setup once. event = respond every time. flag = do once, then never again. I chose flag, because it only adds 2 lines and it's task is very clear and good readable!

---

### **`JS`** - Only 1 of 4 clouds appeared on `emotions.html`
- **🐛**: Recreating clouds from localStorage, only the first cloud showed.
- **🔍**: `createFloatingClouds` had no `return divClouds;`, so `const cloud = ...` was `undefined`, and `undefined.addEventListener()` CRASHED the script &rarr; loop died after cloud 1.
- **🔧**: Added `return divClouds;` as the LAST line of `createFloatingClouds` (after appendChild). Caught it in the loop with `const cloud = ...`, then added the listener to `cloud`.
- **💡**: `return` = the function hands a VALUE back to whoever called it (the caller catches it in a variable). It must be the last line, nothing after it runs. No return + someone uses the result = `undefined` crash.

---

### **`JS`** - Dragged cloud jumped &rarr; mouse stuck to top-left corner of the cloud

- **🐛**: When I grabbed a cloud anywhere except its corner, it teleported so its top-left corner snapped under my mouse.
- **🔍**: `activeCloud.style.left = event.clientX + "px"` and `activeCloud.style.top = event.clientY + "px"` puts the cloud's CORNER at the mouse. So grabbing the middle made the corner jump to the cursor.

- **🔧**: On mousedown, measure how far INSIDE the cloud I clicked, using`getBoundingClientRect()` (gives the cloud's corner position on screen): offsetX = event.clientX - rect.left offsetY = event.clientY - rect.top Then on mousemove, place the cloud at (mouse - offset) so the cursor stays on the exact spot I grabbed.
- **💡**: client = mouse from screen edge. rect = cloud from screen edge. offset = the gap between them = how deep I grabbed. Subtract it back while moving. 

![drag offset with clientx clienty](/bugs/bug-images/drag-offset-with-clientx-clienty.png)

## 2026-06-29
### **`CSS`** - Clouds shrink at the right edge

- **🐛**: Dragging a cloud toward the right edge made it squish narrower. Left side stayed full size.

![clouds shrink at right edge](/bugs/bug-images/clouds-shrink-at-right-edge.png)

- **🔍**: `.thought-cloud` had only `max-width: 400px`, no fixed `width`. `max-width` is a ceiling, not a fixed size, so an `absolute` + shrink-to-fit element squeezes to fit the space left before the edge.
- **🔧**: Gave the emotion clouds a fixed `width: 400px` (scoped to `.screen-3-emotions .thought-cloud`). Now they can't shrink, they run past the edge instead (overflow clips it cleanly).
- **💡**: When something squishes near an edge, suspect a missing fixed `width`.


## 2026-06-30
### **`JS`** - Snap broke in windowed mode

- **🐛**: Cloud snapped to the right spot fullscreen but wrong spot when the window was smaller.

![snap broke in windowed mode](/bugs/bug-images/snap-broke-in-windowed-mode.png)

- **🔍**: `getBoundingClientRect()` gives viewport coords, but `position: absolute` + `style.left` placed the cloud relative to the page. The two frames drift apart when the window changes.
- **🔧**: Centered the cloud with `left: 50%; top: 50%; transform: translate(-50%,-50%)`, the SAME way the zone centers itself in CSS. Matching method = always agree, any window size.
- **💡**: If two things must line up, give them the SAME positioning method. `getBoundingClientRect` is a snapshot of "right now", measure it fresh, at the moment you need it.

## 2026-07-04
### **`JS`** - Release button moved the wrong cloud

- **🐛**: Clicking `releaseButton` cloud jumped to cloud 4's spot
- **🔍**: `cloud` is the loop's variable. all clouds got their position data attached. click listener reads `cloud.dataset` (the last created one in that loop). Need to read the snapped ones.
- **🔧**: Use `cloudInZone.dataset`, that leads to the current reference needed. For that cloud which is actually in the Zone not the last built `cloud`
- **💡**: References: many "notes" can point at houses &rarr; read the "note" that matches the job.

### **`JS`** - Release button moved the cloud to the wrong direction

- **🐛**: clicking release &rarr; cloud jumped to the left side
- **🔍**: `style.left = ...cloudTop`, a top value written into left
- **🔧**: `style.top` gets the top value; `left` gets wiped with "" (starting position uses `right`)
- **💡**: Two bugs can stack on the same lines; fixing one reveals the other


## 2026-07-05
### **`JS`** - Stacked mouseup listeners &rarr; 4x null crash on empty click

- **🐛**: Every empty click on the page &rarr; 4x console error:

![uncaught TypeError null style](/bugs/bug-images/uncaught-typeerror-null-style.png)

- **🔍**: `activeCloud.style.cursor` ran on every mouseup, but before the first grap, `activeCloud` is still `null`. That error appeared 4 times each click because `letGo("mouseup")` is called inside the loop &rarr; 4 laps = 4 stacked listeners on document. One click "rings all 4 bells"
- **🔧**: Moved cursor line behind `if (!isDragging) return;`, no drag, no touch of the "note"
- **💡**: A listener crash is silent on the page, loud in the console. Check the Console regularly

## 2026-07-07
### **`JS`** - Emotion boxes stretch when dragged left

- **🐛**: dragging an emotion into the left 1/4 of the screen &rarr; box stretches wide

![emotion stretch](/bugs/bug-images/emotion-strecht.png)

- **🔍**: `positionObject` sets `right`, dragging sets `left` &rarr; box has BOTH anchors. no fixed width on `.emotion-Box` &rarr; browser stretches between left & right pin.
- **🔧**: clear the anchor on grab &rarr; `activeObject.style.right = ""`
- **💡**: only left 1/4? &rarr; that's where the invisible `right`-anchor line sits (clouds had the same bug, but their fixed width hid it silently)

## 2026-07-09
### **`CSS`** - White line, right screen edge

- **🐛**: On all `.html` appeared a white line on the right edge
- **🔍**: `margin: 0` on body got lost in the CSS refactor &rarr; browser default 8px returned (user agent stylesheet), DevTools: Computed tab showed the 8px.
- **🔧**: set `margin: 0` in `body`
- **💡**: Trust DevTools, not your eyes (reveal hidden problems)
- **👀**: removed the fix to verify &rarr; symptom did NOT come back, but Computed still showed 8px

## 2026-07-10
### **`JS/CSS`** - Reset emotion boxes pulse out of sync

- **🐛**: After snapping cloud #2, reset emotion boxes pulsed off-beat from each other

![pulse off beat](/bugs/bug-gifs/pulse.off.beat.gif)

- **🔍**: Fix attempt `remove("pulse")` + `add("pulse")` back-to-back did nothing &rarr; browser batches style changes, sees "-1 + 1 = 0" never restarts
- **🔧**: `remove("pulse")` &rarr; `getBoundingClientRect()` &rarr; `add("pulse")`
- **💡**: Forced reflow. Remove &rarr; reflow &rarr; add
- **👀**: First problem, don't forget: animation lived on .emotion-box, no .pulse class existed &rarr; JS toggled a class CSS never matched before

## 2026-07-11
### **`JS`** - Clouds display `[object Object]` instead of thought text

- **🐛**: After refactoring thoughtsArray from strings to objects, every cloud on emotions.html showed the text `[object Object]`

![object Object](/bugs/bug-images/object-Object.png)

- **🔍**: The rebuild loop passed `thoughtsArray[thoughtCounter]` (the whole object) into `createFloatingClouds`, which assigns it to `textContent`. `textContent` needs a string, given an object, JS auto-converts it, and an object's default string form is `"[object Object]"`. No error thrown: silent conversion, wrong display
- **🔧**: Pass the "compartment", not the "box": `thoughtsArray[thoughtCounter].thought`
- **💡**: Write side and read side are two separate places. Changing the stored shape means every reader of that data must be updated too, storage looked perfect while the screen was broken


## 2026-07-12
### **`JS`** - Cloud jumps to top-left after fast release

- **🐛**: Release cloud faster than 1s after consuming emotion &rarr; cloud jumps up-left, after 1s: normal again.

![object Object](/bugs/bug-gifs/release-jump.gif)

- **🔍**: Three layers:
  - animationend closure used cloudInZone, already null on fast release &rarr; shiny never removed 
  - Inline transform: `translate(-50%,-50%)` from centering never cleared on release 
  - `.shiny` and `.floatCloud` both set `animation` &rarr; one slot, shiny wins &rarr; floatCloud silenced. floatCloud's transform-animation had been masking the leftover translate the whole time
- **🔧**: Frozen ref (`const cloudReadyToEat = cloudInZone`) for the closure + `style.transform = ""` on release + `remove("shiny")`
- **💡**: One `animation` slot per element, later class wins, animations stomp inline transforms
  - analogy: "shiny covers floatCloud's eyes, and while blind, floatCloud can't do its job (hiding the shift). Hands off &rarr; floatCloud grabs the wheel again."
- **👀**: `getBoundingClientRect()` measures what's on screen, transforms included


## 2026-07-20
### **`JS`** - Cloud font-size shrink aggressive with growing characters

- **🐛**: Medium-length thoughts looked way too small even though the cloud had free space

![font size shrink aggressive](/bugs/bug-images/font-size-shrink-aggressive.png)

- **🔍**: Font-size formula shrank linearly per character `size = 4 - length * 0.065`
- **🔧**: Shrink by `Math.sqrt(inputLength)` instead of raw length

![font size shrink aggressive fix](/bugs/bug-images/font-size-shrink-aggressive-fix.png)

- **💡**: Linear punishment per character over-shrinks anything that wraps

## 2026-07-22
### **`JS`** - Fast cloud save breaks shine + fade animation

- **🐛**: Cloud saving fast broke the shine and the fade animation, slow was fine.
- **🔍**: Two animations (`shiny`0.5s, `consumed`1s) on shared elements; `animationend` fires for any animation and doesn't name-check 
- **🔧**: `event.animationName !== "consumed"`guard on the save listener. Reflow-restart sandwich for re-triggering `shiny`.
  &rarr; data logic runs at click-time, visual logic in `animationend`
- **💡**: animation timers and JS execution are separate clocks, bugs live where they overlap.

## 2026-07-24
### **`CSS/JS`** - Cloud snaps off-center after wrapping clouds in a panel

- **🐛**: Dropped cloud lands in the wrong spot instead of the drop-zone center.

![cloud-snaps-off-center](/bugs/bug-gifs/cloud-snaps-off-center.gif)

- **🔍**: `#thoughts-panel` is `position: absolute`, so it became the cloud's `offsetParent`. The centering code still divides `centerX/centerY` by `window.innerWidth/innerHeight`, producing a viewport-absolute `%` that then gets applied inside the panel. The drag code already measures against the panel, the centering code was never updated to match.
- **🔧**: Convert the drop-zone center into panel-absolute coords before turning it into `%`:
```js
  const rectThoughtsPanel = thoughtsPanel.getBoundingClientRect();
  activeObject.style.left = ((centerX - rectThoughtsPanel.left) / rectThoughtsPanel.width) * 100 + "%";
  activeObject.style.top = ((centerY - rectThoughtsPanel.top) / rectThoughtsPanel.height) * 100 + "%";
```
- **💡**: `%` on an absolutely positioned element is measured against its `offsetParent`, not the viewport. The moment you wrap positioned children in a positioned container, every `%` coordinate must be measured against that container.

## 2026-07-30
### **`JS`** - Emotion names ended up with a trailing "X" when saving

- **🐛**: Pie chart showed saved emotions with attached letter "X".

![emotion name with X pie chart](/bugs/bug-images/emotion-name-with-X-pie-chart.png)
- **🔍**: `consumeEmotion()` read `.textContent` from the whole `.emotion-box`. After adding the remove button, the box held `<span>Happy</span>` + `<button>X</button>`, and `textContent` concatenates ALL descendants.
- **🔧**: `eatEmotion.querySelector(".emotion-text").textContent` + cleared old localStorage.
- **💡**: Adding a child element can silently break unrelated code that reads the parent. Always drill down to the exact element, never trust `textContent` on a container.

---

### **`JS`** - indexOf on an array of objects always returns -1

- **🐛**: Deleting a thought cloud removed the wrong entry. Screen and counter looked correct, but after a reload the wrong thought was gone.
- **🔍**: `thoughtsAndEmotions` holds objects `{thought, emotions}`, but searched with `indexOf(cloudText.textContent)`, a string. No match, so it returned `-1` (convention) and `splice(-1, 1)` deleted the last entry. Deleting the last cloud worked by accident, which hid the bug.
- **🔧**: Switched to `findIndex((entry) => entry.thought === cloudText.textContent)` and added a `!== -1` guard before splicing.
- **💡**: `indexOf` compares by identity, so it only works for primitives. For objects use `findIndex` with a rule. And `splice` with a negative index counts from the end instead of failing, so a bad index deletes silently.



## 2026-08-02
### **`JS`** - Only 3 clouds visible after saving

- **🐛**: After saving, the right column showed 3 clouds instead of 4. The 5th one only slid in once the next cloud was dropped in the zone.
- **🔍**: `resetCloudLayout()` counts `.thought-cloud` in the DOM, but the saved cloud was still there animating. It ate slot 0, so all numbers shifted up by one and the last cloud landed on index > 3 and stayed hidden.
- **🔧**: Query `".thought-cloud:not(.consumed)"` and call `resetCloudLayout()` right after the `splice()` instead of in `animationend`.
- **💡**: Elements animating out are still in the DOM. Filter them out, or count from the state array.

## 2026-08-04
### **`JS`** - Emotion drop during save animation breaks save flow

- **🐛**: After clicking "Save", emotions could still be dropped on the cloud during its 1s consume animation, feeding a cloud that was already being removed caused the cloud snapped back into zone and the release/save button was hidden.

![emotion drop during saving breaks save flow](/bugs/bug-gifs/emotion-drop-during-saving-breaks-save-flow.gif)
- **🔍**: `cloudInZone` is only set to null on `animationend`, so during the animation `dropObjectEmotion` still saw a valid cloud in the zone.
- **🔧**: Added `isSaving` flag: set true on save click, false on `animationend`, guard `dropObjectEmotion` with `!isSaving`.
- **💡**: One flag per state: `saveButtonOn` = "next click saves", `isSaving` = "save in progress". Race conditions need the in-between state marked explicitly.
- **👀**: Same window, second failure: double clicking the release/save button nulls `cloudInZone` early, so `animationend` crashes on `.style`. Same fix: `if (isSaving) return;` in the click handler.

![double click save crash](/bugs/bug-images/double-click-save-crash.png)

## 2026-08-09
### **`JS`** - Duplicate document listeners after `recreateEmotions()`

- **🐛**: Every add or remove of an emotion stacked another set of `mousemove`/`touchmove`/`mouseup`/`touchend` listeners on `document`. Nothing visibly broke, dragging just ran the same handler N times per event.
- **🔍**: `moveObject()` and `dropObjectEmotion()` were registered at the end of `createEmotions()`. `recreateEmotions()` calls `createEmotions()` again, but listeners on `document` are never removed with the boxes, so they piled up.
- **🔧**: Moved the four registration calls out of `createEmotions()` into `init()`, so they run exactly once per page load.
- **💡**: Removing a DOM element removes its own listeners, but not the ones you attached to `document`. Anything registered on `document` belongs in setup code, never in a function that can run more than once.