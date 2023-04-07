let dragged = null;

const toggleButton = document.getElementById("toggle-button");
const container = document.querySelector("#container");
const container2 = document.querySelector("#container2");

toggleButton.addEventListener("click", function() {
  if (container.classList.contains("hidden")) {
    container.classList.remove("hidden");
    container2.classList.remove("hidden");
  } else {
    container.classList.add("hidden");
    container2.classList.add("hidden");
  }
});

document.addEventListener("dragstart", function(event) {
  const tokenContainer = event.target.closest(".token-container");
  
  if (tokenContainer) {
    dragged = tokenContainer;
    const tokenName = dragged.querySelector(".token-name").innerText;
  }
});

document.addEventListener("dragover", function(event) {
  event.preventDefault();
});

document.addEventListener("drop", function(event) {
  event.preventDefault();
  
  if (event.target.classList.contains("position")) {
    const dropTarget = event.target;
    const containerRect = dropTarget.getBoundingClientRect();
    const draggedRect = dragged.getBoundingClientRect();
    const offsetX = draggedRect.left - containerRect.left;
    const offsetY = draggedRect.top - containerRect.top;
    
    if (dragged.classList.contains("repeatable")) {
      const clone = dragged.cloneNode(true);
      const tokenName = prompt("Enter token name:", "");
      clone.querySelector(".token-name").innerText = tokenName;
      if (dragged.parentElement.classList.contains("position") && dropTarget.classList.contains("position")) {
        dragged.parentElement.removeChild(dragged);
      }
      dropTarget.appendChild(clone);
    }else {
      dragged.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      if (dropTarget.querySelector(".token-container")) {
        dropTarget.removeChild(dropTarget.querySelector(".token-container"));
      }
      dropTarget.appendChild(dragged);
    }
    
    const data = event.dataTransfer.getData("text");
    const target = event.target;
    console.log("drop event triggered");
    console.log("Dropped token:", data);
    console.log("Dropped into container:", target);
    console.log("drop event triggered, target element:", event.target);

    dragged.style.transform = "";
  }
});
