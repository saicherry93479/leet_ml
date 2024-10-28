<script lang="ts">

    
    let code = '';
    let error = '';
    let loading = false;
  
    async function verifyCode() {
      loading = true;
      error = '';
      
      try {
        const response = await fetch('/api/auth/verify-2fa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code })
        });
        
        if (response.ok) {
          window.location.href = '/auth'; // Redirect to dashboard
        } else {
          const data = await response.json();
          error = data.error || 'Verification failed';
        }
      } catch (err) {
        error = 'An error occurred';
      } finally {
        loading = false;
      }
    }
  </script>
  
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Two-Factor Authentication</h2>
    
    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    {/if}
  
    <form on:submit|preventDefault={verifyCode} class="space-y-4">
      <div>
        <label for="code" class="block text-sm font-medium text-gray-700">
          Enter verification code from Google Authenticator
        </label>
        <input
          type="text"
          id="code"
          bind:value={code}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter 6-digit code"
        />
      </div>
  
      <button
        type="submit"
        disabled={loading}
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>
    </form>
  </div>