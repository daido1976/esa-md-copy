/**
 * @param {Node} ul or ol 選択範囲の unordered list もしくは orderd list
 * @example <ul><li>GW 前に...<ul><li>HTTP の状態管理...<ul><li>を調べてたら...</li></ul></li><li>Ajax リクエスト... <ul><li>を調べてたら...</li></ul></li><li>で、ようやく XSS や CSRF など...</li></ul></li><li>まだまだ途中ですが GW にインプットできた分...<img class="emoji" title=":muscle:" alt=":muscle:" src="https://assets...png"></li></ul>
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

  // listItem は以下のような li 要素の Node を想定している
  // example1: <li>GW 前に...<ul><li>HTTP の状態管理...<ul><li>を調べてたら...</li></ul></li>
  // example2: <li>まだまだ途中ですが GW にインプットできた分...<img class="emoji" title=":muscle:" alt=":muscle:" src="https://assets...png"></li>
  for (const listItem of listNode.children) {
    let str = "";

    // ParentNode.children だとテキストノードにアクセスできないので、Node.childNodes を使っている
    // see. https://developer.mozilla.org/ja/docs/Web/API/Node/childNodes
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
          // ネストしたリスト内に複数の要素があると text の末尾に改行("\n")が余分についてしまうので、trim() している
          str += node.nodeValue.trim();
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
