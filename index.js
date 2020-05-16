/**
 * @param {Node} ul or ol 選択範囲の unordered list もしくは orderd list
 * @return {string} Markdown っぽくなった文字列
 */
const parseList = (listNode, nestedCount = 0) => {
  // 選択範囲が ul or ol でない時に for 文で回そうとするとエラーになるので、その場合は return する
  validListNodeNames = ["UL", "OL"];
  if (!validListNodeNames.includes(listNode.nodeName)) {
    return;
  }

  const defaultIndent = "\b".repeat(4);
  const bulletListMaker = "•";
  let ary = [];

  // listNode(ul or ol) の children として listItem(li) を想定している
  for (const listItem of listNode.children) {
    let str = "";
    for (let node of listItem.childNodes) {
      switch (node.nodeName) {
        // ネストしたリストであれば、 parseList() を再帰的に呼ぶ
        case "UL":
          str += `\n${parseList(node, nestedCount + 1)}`;
          break;
        case "IMG":
          str += node.title;
          break;
        case "A":
        case "CODE":
          str += node.innerText;
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
    // nestedCount が 0 であれば、indent はつかない
    const indent = defaultIndent.repeat(nestedCount);
    ary.push(`${indent}${bulletListMaker} ${str}`);
  }
  return ary.join("\n");
};

let prevSelectedNode = null;
const logSelection = () => {
  window.setTimeout(() => {
    const selection = document.getSelection();

    // see. https://stackoverflow.com/questions/22935320/uncaught-indexsizeerror-failed-to-execute-getrangeat-on-selection-0-is-not
    if (selection.rangeCount == null || selection.rangeCount === 0) {
      return;
    }

    const selectedNode = selection.getRangeAt(0).commonAncestorContainer;

    // selectionchange イベントが短い時間に何度も発火してしまうので、
    // 2秒待って前回の選択範囲と比較することで一度だけ出力するようにしている
    if (prevSelectedNode === selectedNode) {
      return;
    }

    prevSelectedNode = selectedNode;
    console.log(selectedNode);
    console.log(parseList(selectedNode));
  }, 2000);
};

document.addEventListener("selectionchange", logSelection);
