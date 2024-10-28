<script lang="ts">
    import { onMount } from 'svelte';
    import * as QRCode from 'qrcode';
  
    let step = 1;
    let qrCode = '';
    let verificationCode = '';
    let error = '';
    let loading = false;
    let secret = '';
  
    onMount(async () => {
      try {
        const response = await fetch('/api/auth/initialize-2fa', {
          method: 'POST'
        });
        
        if (!response.ok) throw new Error('Failed to initialize 2FA');
        
        const data = await response.json();
        secret = data.secret;
        qrCode = await QRCode.toDataURL(data.otpauthUrl);
      } catch (err) {
        error = 'Failed to generate 2FA credentials';
      }
    });
  
    async function verifyAndComplete() {
      loading = true;
      error = '';
      
      try {
        const response = await fetch('/api/auth/complete-2fa-setup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code: verificationCode })
        });
        
        if (response.ok) {
          window.location.href = '/dashboard';
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
  
    async function skipSetup() {
      try {
        const response = await fetch('/api/auth/skip-2fa-setup', {
          method: 'POST'
        });
        
        if (response.ok) {
          window.location.href = '/dashboard';
        }
      } catch (err) {
        error = 'Failed to skip setup';
      }
    }
  </script>
  
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Secure Your Account</h2>
    <p class="mb-6 text-gray-600">
      Set up two-factor authentication to add an extra layer of security to your account.
    </p>
    
    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    {/if}
  
    <div class="space-y-6">
      <div>
        <h3 class="font-semibold mb-2">1. Install Google Authenticator</h3>
        <p class="text-sm text-gray-600 mb-4">
          Download Google Authenticator from your device's app store:
        </p>
        <div class="flex space-x-4 mb-4">
          <a href="https://apps.apple.com/us/app/google-authenticator/id388497605" 
             target="_blank" 
             class="inline-block px-4 py-2 bg-black text-white rounded">
            iOS App Store
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" 
             target="_blank"
             class="inline-block px-4 py-2 bg-green-600 text-white rounded">
            Google Play
          </a>
        </div>
      </div>
  
      {#if qrCode}
        <div>
          <h3 class="font-semibold mb-2">2. Scan QR Code</h3>
          <p class="text-sm text-gray-600 mb-4">
            Open Google Authenticator and scan this QR code:
          </p>
          <img src={qrCode} alt="QR Code" class="mx-auto mb-4" />
        </div>
  
        <div>
          <h3 class="font-semibold mb-2">3. Enter Verification Code</h3>
          <p class="text-sm text-gray-600 mb-4">
            Enter the 6-digit code from Google Authenticator:
          </p>
          <input
            type="text"
            bind:value={verificationCode}
            placeholder="000000"
            class="w-full px-3 py-2 border rounded-md mb-4"
          />
        </div>
  
        <div class="flex flex-col space-y-2">
          <button
            on:click={verifyAndComplete}
            disabled={loading}
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            {loading ? 'Verifying...' : 'Complete Setup'}
          </button>
          
          <button
            on:click={skipSetup}
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip for now (not recommended)
          </button>
        </div>
      {/if}
    </div>
  </div>
  