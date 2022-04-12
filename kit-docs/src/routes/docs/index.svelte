<script context="module">
  export const prerender = true;

  /** @type {import('@sveltejs/kit').Load} */
  export async function load() {
    return {
      status: 307,
      redirect: `/docs/component-format/script`,
    };
  }
</script>
