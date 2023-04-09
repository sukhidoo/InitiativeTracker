let dragged = null;

const toggleButton = document.getElementById("toggle-button");
const container = document.querySelector("#container");

toggleButton.addEventListener("click", function() {
  if (container.classList.contains("hidden")) {
    container.classList.remove("hidden");
  } else {
    container.classList.add("hidden");
  }
});

let currentImageIndex = 1;
const maxImageIndex = 11;

const nextImageButton = document.querySelector("#next-image-button");
const prevImageButton = document.querySelector("#prev-image-button");
const tokenContainer = document.querySelector("#round-token-container");

nextImageButton.addEventListener("click", () => {
  currentImageIndex++;

  if (currentImageIndex > maxImageIndex) {
    nextImageButton.disabled = true;
  }

  prevImageButton.disabled = false;

  const imagePath = `./images/${currentImageIndex}.png`;
  tokenContainer.querySelector(".token").src = imagePath;
});

prevImageButton.addEventListener("click", () => {
  currentImageIndex--;

  if (currentImageIndex === 1) {
    prevImageButton.disabled = true;
  }

  nextImageButton.disabled = false;

  const imagePath = `./images/${currentImageIndex}.png`;
  tokenContainer.querySelector(".token").src = imagePath;
});

const disableSquaresButton = document.querySelector("#hide-black-squares");

disableSquaresButton.addEventListener("click", function() {
  const positionContainers = document.querySelectorAll(".position");
  positionContainers.forEach(position => {
    if (position.classList.contains("position-no-border")) {
      position.classList.remove("position-no-border");
    } else {
      position.classList.add("position-no-border");
    }
  });
});
  
document.addEventListener("dragstart", function(event) {
  const tokenContainer = event.target.closest(".token-container");
  
  if (tokenContainer) {
    dragged = tokenContainer;
    const tokenName = dragged.querySelector(".token-name").innerText;
    const id = `token-${Date.now()}`;
    if (dragged.classList.contains("repeatable")) {
      dragged.setAttribute("id", id);
    }
    event.dataTransfer.setData("text/plain", id);
    console.log("dragstart event triggered");
    console.log("Dragged token:", tokenName);
    console.log("Dragged token container:", dragged);
  }
});


document.addEventListener("dragover", function(event) {
  event.preventDefault();
});

document.addEventListener("drop", function(event) {
  event.preventDefault();
  const target = event.target;
  console.log("drop event triggered");
  console.log("Dropped into element:", target);

  if (target.hasAttribute("id") && target.getAttribute("id") === "container") {
    if (dragged.classList.contains("repeatable")) {
      return;
    }
    const tokenContainers = target.querySelectorAll(".token-container");
    let lastTokenContainer;
    for (let i = tokenContainers.length - 1; i >= 0; i--) {
      if (!tokenContainers[i].classList.contains("repeatable")) {
        lastTokenContainer = tokenContainers[i];
        break;
      }
    }
    if (lastTokenContainer) {
      const bossTokenContainer = target.querySelector(".repeatable");
      const referenceNode = bossTokenContainer ? bossTokenContainer : null;

      // Get the original index of the token within the container div
      const originalIndex = dragged.getAttribute("data-original-index");
      const newIndex = Array.from(lastTokenContainer.parentNode.children).indexOf(lastTokenContainer) + 1;
      if (newIndex < originalIndex) {
        lastTokenContainer.insertAdjacentElement("beforebegin", dragged);
      } else {
        lastTokenContainer.insertAdjacentElement("afterend", dragged);
      }
      console.log("Dropped non-repeatable token into existing token container:", dragged);
      
      // Sort the token containers by data-original-index
      const sortedContainers = Array.from(target.querySelectorAll('.token-container')).sort((a, b) => {
        return a.getAttribute('data-original-index') - b.getAttribute('data-original-index');
      });
      target.innerHTML = '';
      sortedContainers.forEach(container => target.appendChild(container));
    } else {
      const newDiv = document.createElement("div");
      newDiv.classList.add("token-container");
      target.appendChild(newDiv);
      newDiv.appendChild(dragged);
      console.log("Dropped non-repeatable token into new token container:", dragged);
      
      // Sort the token containers by data-original-index
      const sortedContainers = Array.from(target.querySelectorAll('.token-container')).sort((a, b) => {
        return a.getAttribute('data-original-index') - b.getAttribute('data-original-index');
      });
      target.innerHTML = '';
      sortedContainers.forEach(container => target.appendChild(container));
    }
  } else if (target.classList.contains("position")) {
    if (dragged.classList.contains("repeatable")) {
      const clone = dragged.cloneNode(true);
      const tokenName = prompt("Enter token name:", "");
      clone.querySelector(".token-name").innerText = tokenName;
      target.appendChild(clone);
      console.log("Dropped repeatable token into position:", clone);
    } else {
      target.appendChild(dragged);
      console.log("Dropped non-repeatable token into position:", dragged);
    }
  }

  dragged.style.opacity = "1";
  dragged = null;
});


const trashCan = document.querySelector("#trash-can");

trashCan.addEventListener("dragover", function(event) {
  event.preventDefault();
});

trashCan.addEventListener("drop", function(event) {
  event.preventDefault();
  
  const data = event.dataTransfer.getData("text");
  const draggedElement = document.querySelector(`#${data}`);

  if (draggedElement.parentElement.classList.contains("position") && draggedElement.classList.contains("repeatable")) {
    draggedElement.remove();
    console.log("Item has been deleted!");
  } else {
    console.log("Only repeatable tokens from position containers can be deleted!");
  }
});
