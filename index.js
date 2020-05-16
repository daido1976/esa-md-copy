let prevContainer = null;

const parseListItem = (list) => {
  const listItem = list.querySelector("li:nth-child(1)");
  const imgTitle = listItem.querySelector("img").title;
  const content = listItem.innerText.split("\n")[0];
  return `- ${imgTitle}${content}`;
};

const logSelection = () => {
  window.setTimeout(() => {
    const container = document.getSelection()?.getRangeAt(0)
      .commonAncestorContainer;
    if (prevContainer === container) {
      return;
    }
    prevContainer = container;
    console.log(container);
    console.log(parseListItem(container));
  }, 2000);
};

document.addEventListener("selectionchange", logSelection);
