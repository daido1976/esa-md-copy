const logSelection = () => {
  const container = document.getSelection().getRangeAt(0)
    .commonAncestorContainer;
  console.log(container);
};

document.addEventListener("selectionchange", logSelection);
