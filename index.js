/**
 * @param {Node} ul 選択範囲の unordered list
 * @return {string} Markdown っぽくなった文字列
 */
const parseList = (listNode) => {
  const indent = `${"\b".repeat(4)}`;
  const bulletListMaker = "•";
  let ary = [];

  // 選択範囲が ul でない時に for 文で回そうとするとエラーになるので、その場合は return する
  if (listNode.nodeName !== "UL") {
    return;
  }

  for (const child of listNode.children) {
    let str = "";
    for (let node of child.childNodes) {
      switch (node.nodeName) {
        // ネストしたリストであれば、 parseList() を再帰的に呼ぶ
        case "UL":
          str += `\n${indent}${parseList(node)}`;
          break;
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
    ary.push(`${bulletListMaker} ${str}`);
  }
  return ary.join("\n");
};

let prevSelectedNode = null;
const logSelection = () => {
  // selectionchange イベントが短い時間に何度も発火してしまうので、
  // 2秒待って前回の選択範囲と比較することで一度だけ出力するようにしている
  window.setTimeout(() => {
    const selection = document.getSelection();

    if (selection.rangeCount == null || selection.rangeCount === 0) {
      return;
    }

    const selectedNode = selection.getRangeAt(0).commonAncestorContainer;

    if (prevSelectedNode === selectedNode) {
      return;
    }

    prevSelectedNode = selectedNode;
    console.log(selectedNode);
    console.log(parseList(selectedNode));
  }, 2000);
};

document.addEventListener("selectionchange", logSelection);
