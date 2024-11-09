<script lang="ts">
  import EmailTwoFactorModal from "./EmailTwoFactorModal.svelte";
  import axios from "axios";
  import { actions } from "astro:actions";
  let code = $state("");
  let showEmailTwoFactorModal = $state(false);
  let { userId } = $props();

  console.log("userId ", userId);

  async function enableEmailTwoFactor(e) {
    e.preventDefault();
    const response = await actions.sendMail({});
    console.log("repsonse is ", response);
    if (response.data.status) {
      showEmailTwoFactorModal = true;
    } else {
      console.error("Error enabling email two-factor:", response.data);
    }
  }

  async function verifyEmailTwoFactor(code2) {
    console.log("code is ", code2);
    if (!code2) {
      return;
    }
    // const response = await axios.post("/api/email-2fa-verify", {
    //   userId: userId,
    //   code: code2,
    // });
    const response = await actions.verifyEmail({
      code: code2,
    });
    console.log("response ", response);
    if (response.data.success) {
      showEmailTwoFactorModal = false;
      // Update the user's profile to reflect the email-based 2FA enablement
      window.location.href = "/";
    } else {
      console.error("Error verifying email two-factor:", response.status);
    }
  }
</script>

<div class="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
  <h1 class="text-2xl font-bold mb-4 text-gray-800">Account Settings</h1>

  <button
    onclick={enableEmailTwoFactor}
    class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
  >
     Email Two-Factor Authentication
  </button>
  <br/>
  <a  href="/auth/setup-2fa">Continue with autheticator</a>

  {#if showEmailTwoFactorModal}
    <EmailTwoFactorModal {code} {verifyEmailTwoFactor} />
  {/if}
</div>
