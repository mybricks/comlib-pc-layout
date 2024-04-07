export default function dfs(nodes: { [key: string]: any }[], targetKey: string, targetValue: any) {
  if (!nodes?.length) {
    return null;
  }
  for (const node of nodes) {
    if (node[targetKey] === targetValue) {
      return node;
    }
    const foundNode = dfs(node.children, targetKey, targetValue);
    if (foundNode) {
      return foundNode;
    }
  }
  return null;
}
