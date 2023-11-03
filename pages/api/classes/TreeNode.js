export class TreeNode {
  constructor(node, leftNode, rightNode) {
    this._node = node;
    this._rightNode = rightNode;
    this._leftNode = leftNode;
  }

  get node() {
    return this._node;
  }
  set node(node) {
    this._node = node;
  }

  get leftNode() {
    return this._leftNode;
  }

  set leftNode(leftNode) {
    this._leftNode = leftNode;
  }

  get rightNode() {
    return this.rightNode;
  }

  set rightNode(rightNode) {
    this._rightNode = rightNode;
  }
}
