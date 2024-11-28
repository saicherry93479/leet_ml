<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    
    let timeRemaining = '';
    let timer: number;
    
    function getCookieValue(name: string): string | null {
      // Handle cookie names with special characters by encoding
      const encodedName = encodeURIComponent(name);
      const decodedCookie = decodeURIComponent(document.cookie);
      const cookies = decodedCookie.split(';');
      console.log('cookies ',cookies)
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(encodedName + '=') === 0) {
          return cookie.substring(encodedName.length + 1);
        }
      }
      return null;
    }
    
    function getExpiryTime() {
      try {
        // Get the session cookie value
        const sessionCookie = getCookieValue('authSession');
        
        if (!sessionCookie) {
          console.log('No auth session cookie found');
          return null;
        }
    
        // Since we know our cookie expires in 7 days from creation
        // We'll create a date 7 days from now
        const expiryTime = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    
        console.log('Cookie found, expiry time:', expiryTime);
        return expiryTime;
      } catch (error) {
        console.error('Error getting expiry time:', error);
        return null;
      }
    }
    
    function updateTimer() {
      const expiryTime = getExpiryTime();
      if (!expiryTime) {
        timeRemaining = '';
        return;
      }
    
      const now = new Date();
      const timeLeft = expiryTime.getTime() - now.getTime();
    
      if (timeLeft <= 0) {
        timeRemaining = 'Session expired';
        window.location.href = '/logout'; // Redirect to logout if session expired
        return;
      }
    
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
      if (days > 0) {
        timeRemaining = `${days}d ${hours}h left`;
      } else if (hours > 0) {
        timeRemaining = `${hours}h ${minutes}m left`;
      } else if (minutes > 0) {
        timeRemaining = `${minutes}m left`;
      } else {
        timeRemaining = 'Less than a minute';
      }
    }
    
    onMount(() => {
      updateTimer();
      timer = setInterval(updateTimer, 60000) as unknown as number; // Update every minute
    });
    
    onDestroy(() => {
      if (timer) clearInterval(timer);
    });
    </script>
    
    {#if timeRemaining}
      <div class="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <span>{timeRemaining}</span>
      </div>
    {/if}