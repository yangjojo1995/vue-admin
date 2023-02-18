
export default async function (router, routes) {
  for (const route of routes) {
    router.addRoute(route)
  }
}
