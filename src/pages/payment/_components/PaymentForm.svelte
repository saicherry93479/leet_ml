<script>
  import { loadStripe } from "@stripe/stripe-js";
  import { onMount } from "svelte";

  let loading = false;
  let error = null;
  let stripe;
  let elements;
  let card;

  onMount(async () => {
    // Replace with your Stripe publishable key
    stripe = await loadStripe(
      "pk_test_51QEn8FGvqg6Vjkbszj5NmxW69Rcr8XcEa1Dr6vwlvxr05s11PGb3wvJ4CZUxxDEQMUlK15swfMm6LPrRuCaKBpOx00T0ELPPmf"
    );
    elements = stripe.elements();
    card = elements.create("card", {
      style: {
        base: {
          fontSize: "16px",
          color: "#32325d",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a",
        },
      },
    });
    card.mount("#card-element");
  });

  async function handleSubmit() {
    loading = true;
    error = null;

    try {
      const { paymentMethod, error: stripeError } =
        await stripe.createPaymentMethod({
          type: "card",
          card,
        });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Send paymentMethod.id to your server
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: 1000, // amount in cents
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert("Something went wrong please try agian later");
      }

      window.location.href='/paymentsucess'
      // Handle successful payment here
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="w-full  mt-12">
  <div class="mx-auto p-6 bg-white rounded-lg shadow-md w-[400px] ">
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div class="space-y-2">
        <label
          for="card-element"
          class="block text-sm font-medium text-gray-700"
        >
          Credit or debit card
        </label>
        <div id="card-element" class="p-3 border rounded-md" />
      </div>

      {#if error}
        <div class="text-red-500 text-sm">{error}</div>
      {/if}

      <button
        type="submit"
        disabled={loading}
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  </div>
</div>
