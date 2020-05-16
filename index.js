let prevContainer = null;
const logSelection = () => {
  window.setTimeout(() => {
    const container = document.getSelection()?.getRangeAt(0)
      .commonAncestorContainer;
    if (prevContainer === container) {
      return;
    }
    prevContainer = container;
    console.log(container);
  }, 2000);
};

document.addEventListener("selectionchange", logSelection);
