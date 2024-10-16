<script lang="ts">
  import { onMount } from "svelte";

  let { user } = $props();
</script>

<header class="top-0 left-0 z-50 sticky top-0 bg-white w-full">
  <div class="max-w-[80rem] px-4 mx-auto">
    <div class="relative flex items-center justify-between">
      <a href="/" class="block w-full py-5">
        <p class="font-bold text-[40px] logo">
          Leet <span class="text-purple-600">ML</span>
        </p>
      </a>

      <div class="flex items-center justify-between w-full px-4">
        <div>
          <nav
            class="absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white py-5 px-6 shadow transition-all lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:shadow-none dark:bg-dark-2 lg:dark:bg-transparent"
          >
            <ul class="block lg:flex">
              {#if user?.role === "admin"}
                <li>
                  <a
                    href="/admin"
                    class="flex py-2 text-base font-medium text-dark dark:text-white hover:text-primary lg:ml-12 lg:inline-flex"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/newproblem"
                    class="flex py-2 text-base font-medium text-dark dark:text-white hover:text-primary lg:ml-12 lg:inline-flex"
                  >
                    New Problem
                  </a>
                </li>
              {:else}
                <li>
                  <a
                    href="/"
                    class="flex py-2 text-base font-medium text-dark dark:text-white hover:text-primary lg:ml-12 lg:inline-flex"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/problems"
                    class="flex py-2 text-base font-medium text-dark dark:text-white hover:text-primary lg:ml-12 lg:inline-flex"
                  >
                    Problems
                  </a>
                </li>
              {/if}
              {#if user}{/if}
            </ul>
          </nav>
        </div>
        <div class="justify-end sm:flex">
          {#if user}
            <img
              class="h-10 w-10 rounded-[8px]"
              src={`https://ui-avatars.com/api/?name=${user.name}&background=9333ea&color=fff`}
            />
          {:else}
            <a
              href="/auth"
              class="inline-flex items-center bg-gradient-to-br from-purple-600 via-violet-600 to-[#4d0085] justify-center bg-blue-600 px-6 py-3 text-base font-medium text-center text-white rounded-md bg-primary hover:bg-blue-dark lg:px-7"
            >
              Login
            </a>
          {/if}
        </div>
      </div>
    </div>
  </div>
</header>
