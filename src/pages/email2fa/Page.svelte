<script lang="ts">
  import EmailTwoFactorModal from "./EmailTwoFactorModal.svelte";
  import axios from "axios";
  import { actions } from "astro:actions";
  
  let code = $state("");
  let showEmailTwoFactorModal = $state(false);
  let loading = $state(false);
  let { userId } = $props();
  
  async function enableEmailTwoFactor(e) {
    e.preventDefault();
    loading = true;
    
    try {
      const response = await actions.sendMail({});
      if (response.data.status) {
        showEmailTwoFactorModal = true;
      } else {
        // Handle error
        console.error("Error enabling email two-factor:", response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      loading = false;
    }
  }
  
  async function verifyEmailTwoFactor(code2) {
    if (!code2) return;
    
    try {
      const response = await actions.verifyEmail({
        code: code2,
      });
      
      if (response.data.success) {
        showEmailTwoFactorModal = false;
        window.location.href = "/";
      } else {
        console.error("Error verifying email two-factor:", response.status);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  </script>
  
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Security Settings</h1>
        <p class="mt-2 text-gray-600">Choose your preferred two-factor authentication method</p>
      </div>
  
      <!-- Main Content -->
      <div class="bg-white rounded-2xl shadow-lg p-8">
        <!-- 2FA Options -->
        <div class="space-y-6">
          <!-- Email 2FA Option -->
          <div class="flex items-center justify-between p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-300">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Email Authentication</h2>
                <p class="text-gray-600">Receive verification codes via email</p>
              </div>
            </div>
            <button
              on:click={enableEmailTwoFactor}
              disabled={loading}
              class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {#if loading}
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Setting up...
              {:else}
                Enable Email 2FA
              {/if}
            </button>
          </div>
  
          <!-- Authenticator App Option -->
          <div class="flex items-center justify-between p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-300">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Authenticator App</h2>
                <p class="text-gray-600">Use Google Authenticator or similar apps</p>
              </div>
            </div>
            <a
              href="/auth/setup-2fa"
              class="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition duration-300"
            >
              Set up Authenticator
            </a>
          </div>
        </div>
  
        <!-- Info Section -->
        <div class="mt-8 p-4 bg-gray-50 rounded-lg">
          <div class="flex items-start space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-1">
              <h3 class="text-sm font-medium text-gray-900">Why use 2FA?</h3>
              <p class="mt-1 text-sm text-gray-500">
                Two-factor authentication adds an extra layer of security to your account. Even if someone knows your password, they won't be able to access your account without the second factor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  {#if showEmailTwoFactorModal}
    <EmailTwoFactorModal {verifyEmailTwoFactor} />
  {/if}