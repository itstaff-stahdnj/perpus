<template>
  <div class="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col font-sans relative transition-colors duration-300">
    <AppHeader />
    <div class="flex-1 pt-16 pb-24 md:pb-0">
      <slot />
    </div>
    <AppFooter />
    <MobileBottomNav />
    <ActivityNotificationToast />
    <ApiMaintenanceNotification />
    <AiLibrarianChatModal />
  </div>
</template>
