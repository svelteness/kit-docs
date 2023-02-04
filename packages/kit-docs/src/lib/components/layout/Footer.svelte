<footer
  class="992:mt-32 mt-20 flex w-full flex-col items-center justify-center border-t border-border py-12 text-center text-base font-medium"
>
  <slot name="footer-top" />

  <span class="text-soft mt-8">
    © Vidstack {new Date().getFullYear()}
  </span>

  <slot name="footer-bottom" />
</footer>
