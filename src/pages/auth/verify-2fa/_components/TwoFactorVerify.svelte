<script lang="ts">
  import { onMount } from 'svelte';
  
  let code = '';
  let error = '';
  let loading = false;
  let inputs: HTMLInputElement[] = [];
  let focusedInput = 0;

  // Create separate bindings for each digit
  let digits = ['', '', '', '', '', ''];

  onMount(() => {
    // Focus first input on mount
    inputs[0]?.focus();
  });

  function handleInput(index: number, event: any) {
    const value = event.target.value;
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      digits[index] = '';
      return;
    }

    // Take only the last character if multiple characters are pasted
    digits[index] = value.slice(-1);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputs[index + 1]?.focus();
    }
    
    // Combine digits for complete code
    code = digits.join('');
  }

  function handleKeydown(index: number, event: KeyboardEvent) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      digits[index - 1] = '';
      inputs[index - 1]?.focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      inputs[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < 5) {
      inputs[index + 1]?.focus();
    }
  }

  function handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const numbers = pastedText.replace(/[^\d]/g, '').slice(0, 6).split('');
    
    digits = [...numbers, ...Array(6 - numbers.length).fill('')];
    code = digits.join('');
    
    if (numbers.length > 0) {
      const focusIndex = Math.min(numbers.length, 5);
      inputs[focusIndex]?.focus();
    }
  }

  async function verifyCode() {
    if (code.length !== 6) {
      error = 'Please enter a complete 6-digit code';
      return;
    }

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
        // Add success animation before redirect
        loading = false;
        await new Promise(resolve => setTimeout(resolve, 500));
        window.location.href = '/auth';
      } else {
        const data = await response.json();
        error = data.error || 'Verification failed';
        // Shake animation for error
        inputs.forEach(input => input.classList.add('shake'));
        setTimeout(() => {
          inputs.forEach(input => input.classList.remove('shake'));
        }, 500);
      }
    } catch (err) {
      error = 'An error occurred';
    } finally {
      loading = false;
    }
  }
</script>

<style>
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .shake {
    animation: shake 0.5s;
  }

  .pulse {
    animation: pulse 2s infinite;
  }

  .code-input {
    @apply w-12 h-14 text-center text-2xl border rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200;
  }

  .loading-dot {
    @apply w-2 h-2 bg-white rounded-full;
    animation: loadingDot 1.5s infinite;
  }

  @keyframes loadingDot {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
</style>

<div class="min-h-[80vh] bg-gray-50 flex items-center justify-center px-4">
  <div class="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl space-y-6">
    <div class="text-center space-y-2">
      <div class="flex justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900">Two-Factor Authentication</h2>
      <p class="text-gray-500">Enter the 6-digit code from your authenticator app</p>
    </div>
    
    {#if error}
      <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9v4h2V9H9z" clip-rule="evenodd" />
          </svg>
          <p class="ml-2 text-sm text-red-700">{error}</p>
        </div>
      </div>
    {/if}

    <form on:submit|preventDefault={verifyCode} class="space-y-6">
      <div class="flex justify-between space-x-2">
        {#each digits as digit, i}
          <input
            type="text"
            inputmode="numeric"
            maxlength="1"
            bind:this={inputs[i]}
            bind:value={digits[i]}
            on:input={(e) => handleInput(i, e)}
            on:keydown={(e) => handleKeydown(i, e)}
            on:paste={handlePaste}
            class="code-input"
            disabled={loading}
          />
        {/each}
      </div>

      <button
        type="submit"
        disabled={loading || code.length !== 6}
        class="w-full flex items-center justify-center py-3 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
      >
        {#if loading}
          <div class="flex space-x-2">
            <div class="loading-dot" style="animation-delay: 0s"></div>
            <div class="loading-dot" style="animation-delay: 0.2s"></div>
            <div class="loading-dot" style="animation-delay: 0.4s"></div>
          </div>
        {:else}
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
            </svg>
            Verify Code
          </span>
        {/if}
      </button>
    </form>

    <div class="text-center space-y-4">
      <a
        href="/email2fa"
        class="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
        Use Email Verification Instead
      </a>
    </div>
  </div>
</div>