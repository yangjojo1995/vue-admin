
function parseUrl (file) {
  const relPath = file.replace(/^(\.?\/)?/, '').replace(/\.vue$/, '').replace(/(^|\/)\[([^/]+)\]/g, '$1:$2')
  const path = '/' + relPath
  const nodes = relPath.split('/')
  const paths = nodes.map((node, i) => '/' + nodes.slice(0, i + 1).join('/'))
  return { file, path, relPath, nodes, paths }
}

/**
 * 路由
 * @param {*} router require.context('@/pages/', true, /\.vue$/, 'lazy')
 * @param {*} viewsModules
 */
export default async function (router, viewsModules) {
  const routesList = []
  for (const file of viewsModules.keys().sort((a, b) => a.localeCompare(b))) {
    if (/^_|\/_/.test(file)) continue
    const { path } = parseUrl(file)
    const route = {}
    route.path = path
    route.component = () => viewsModules(file)
    route.alias = path.replace(/\/index$/, '')
    if (route.alias === path) delete route.alias
    routesList.push(route)
  }

  // 目录生成路由
  const routes = routesList.filter((route, i) => {
    const { path } = route
    const { paths } = parseUrl(path)

    let parent
    for (let j = paths.length - 2; j >= 0; j--) {
      const _path = paths[j]
      const _route = routesList.find((_route) => _route.path === _path)
      if (_route) {
        parent = _route
        break
      }
    }

    if (parent) {
      if (!Array.isArray(parent.children)) {
        parent.children = []
      }
      parent.children.push(route)
      return false
    }

    return true
  })

  for (const route of routes) {
    router.addRoute(route)
  }
}
