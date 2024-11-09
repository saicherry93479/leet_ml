<script lang="ts">
  import { onMount } from "svelte";
  import { LogOut } from "lucide-svelte";

  let { user } = $props();
</script>

<header class="top-0 left-0 z-50 sticky top-0 bg-white w-full">
  <div class="max-w-[80rem] px-4 mx-auto">
    <div class="relative flex items-center justify-between">
      <a href="/" class="block  py-5">
        <p class="font-bold text-[40px] logo">
          Leet <span class="text-purple-600">ML</span>
        </p>
      </a>

      <div class="flex flex-1 items-center  justify-between w-full px-4">
        <div>
          <ul class="block w-full lg:flex text-[12px] mr-12">
            {#if user?.admin === "Y"}
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
            {#if user?.premiumUser}
              <p
                class="flex px-4 py-2 bg-white-500 text-center font-bold text-[16px] items-center justify-center ml-4 text-purple-500 rounded-[10px]"
              >
                Premium User
              </p>
            {:else if user}
              <a
                href="/payment"
                class="flex px-4 py-2 bg-purple-500 text-center items-center justify-center ml-4 text-white rounded-[10px]"
                >Buy Premium</a
              >
            {/if}
            <li>
              <a
                href="/profile"
                class="flex py-2 text-base font-medium text-dark dark:text-white hover:text-primary lg:ml-12 lg:inline-flex"
              >
                Profile
              </a>
            </li>
          </ul>
        </div>
        <div class="justify-end sm:flex">
          {#if user}
            <div class="flex gap-4 items-center">
              <img
                class="h-10 w-10 rounded-[8px]"
                src={`https://ui-avatars.com/api/?name=${user.name}&background=9333ea&color=fff`}
              />
              <a href="/logout">
                <LogOut />
              </a>
            </div>
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
