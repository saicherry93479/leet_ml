<script>
  let { verifyEmailTwoFactor } = $props();
  let code = $state("");
</script>

<div
  class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
>
  <div class="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
    <h2 class="text-xl font-bold mb-4 text-gray-800">
      Verify Email Two-Factor Code
    </h2>
    <div class="space-y-4">
      <input
        type="text"
        bind:value={code}
        placeholder="Enter code"
        class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onclick={(e) => {
          e.preventDefault();
          verifyEmailTwoFactor(code);
        }}
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-300"
      >
        Verify
      </button>
    </div>
  </div>
</div>
