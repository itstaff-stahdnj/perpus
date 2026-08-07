<template>
  <div class="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
    <AppHeader />
    <div class="flex-1 pt-16 pb-24 md:pb-0">
      <slot />
    </div>
    <AppFooter />
    <MobileBottomNav />
  </div>
</template>
