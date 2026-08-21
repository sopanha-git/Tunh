export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, fetch } = useUserSession()
  await fetch()

  if (!loggedIn.value && to.path !== '/login') {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
  if (loggedIn.value && to.path === '/login') return navigateTo('/')
})
