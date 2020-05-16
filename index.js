let prevSelectedNode = null;

const parseList = (listNode) => {
  let ary = [];
  for (const child of listNode.children) {
    let str = "";
    for (let node of child.childNodes) {
      switch (node.nodeName) {
        case "IMG":
          str += node.title;
          break;
        case "#text":
          if (node.nodeValue === "\n") {
            break;
          }
          str += node.nodeValue;
          break;
        default:
          break;
      }
    }
    ary.push(`- ${str}`);
  }
  return ary.join("\n");
};

const logSelection = () => {
  window.setTimeout(() => {
    const selectedNode = document.getSelection()?.getRangeAt(0)
      .commonAncestorContainer;
    if (prevSelectedNode === selectedNode) {
      return;
    }
    prevSelectedNode = selectedNode;
    console.log(selectedNode);
    console.log(parseList(selectedNode));
  }, 2000);
};

document.addEventListener("selectionchange", logSelection);
