<footer
  class="992:mt-32 mt-20 flex w-full flex-col items-center justify-center border-t border-gray-200 bg-gray-100 py-12 text-center text-base font-medium dark:border-gray-600 dark:bg-gray-700"
>
  <slot name="footer-top" />

  <span class="text-gray-soft mt-8">
    © Vidstack {new Date().getFullYear()}
  </span>

  <slot name="footer-bottom" />
</footer>
