
// 获取树形结构指定节点的路径

function getNodePathByTreeAndNode (tree, node, props = { }) {
  const childrenKey = props.children || 'children'
  const valueKey = props.value || 'value'
  for (const item of tree) {
    if (typeof node === 'object' ? item === node : item[valueKey] === node) {
      return [item]
    }

    if (item[childrenKey] && item[childrenKey].length) {
      const childrenNodePath = getNodePathByTreeAndNode(item[childrenKey], node, props)
      if (childrenNodePath.length) {
        return [item, ...childrenNodePath]
      }
    }
  }

  return []
}

function resolveTreeNode (tree, node, props = { }) {
  const childrenKey = props.children || 'children'
  const valueKey = props.value || 'value'
  const labelKey = props.label || 'label'

  const nodePath = getNodePathByTreeAndNode(tree, node, props)
  if (!nodePath || !nodePath.length) return null

  return {
    node: nodePath[nodePath.length - 1],
    parent: nodePath.length > 1 ? nodePath[nodePath.length - 2] : null,
    leaf: !nodePath[nodePath.length - 1][childrenKey] || !nodePath[nodePath.length - 1][childrenKey].length,
    nodeValue: nodePath[nodePath.length - 1][valueKey],
    nodePath: nodePath,
    valuePath: nodePath.map(item => item[valueKey]),
    labelPath: nodePath.map(item => item[labelKey])
  }
}

export { resolveTreeNode }
export default resolveTreeNode
