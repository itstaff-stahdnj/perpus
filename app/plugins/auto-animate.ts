export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.client) {
    try {
      const { autoAnimatePlugin } = await import('@formkit/auto-animate/vue')
      nuxtApp.vueApp.use(autoAnimatePlugin)
    } catch (e) {}
  }
})
