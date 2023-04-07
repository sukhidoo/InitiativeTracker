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


document.addEventListener("dragstart", function(event) {
  dragged = event.target;
  event.dataTransfer.setData("text", "");
});

document.addEventListener("dragover", function(event) {
  event.preventDefault();
});

document.addEventListener("drop", function(event) {
  event.preventDefault();
  dragged.nextElementSibling.classList.add("hidden");
  if (event.target.classList.contains("position")) {
    const dropTarget = event.target;
    const containerRect = dropTarget.getBoundingClientRect();
    const draggedRect = dragged.getBoundingClientRect();
    const offsetX = draggedRect.left - containerRect.left;
    const offsetY = draggedRect.top - containerRect.top;
    dragged.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    dropTarget.appendChild(dragged);
    var data = event.dataTransfer.getData("text");
    var target = event.target;
    console.log("drop event triggered");
    console.log("Dropped token:", data);
    console.log("Dropped into container:", target);
    console.log("drop event triggered, target element:", event.target);
    dragged.style.transform = "";
  }
});
