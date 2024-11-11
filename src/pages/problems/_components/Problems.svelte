<script lang="ts">
  import axios from "axios";
  import { onMount } from "svelte";
  import { Search, CheckSquare, Square, Youtube } from "lucide-svelte";
  import type { Users, ProblemList } from "../types";

  let problems: any[] = [];
  export let user: Users | undefined;
  let searchQuery = "";

  console.log("user ", user);
  const difficultyColors = [
    { type: "Hard", color: "text-red-500" },
    { type: "Medium", color: "text-orange-400" },
    { type: "Easy", color: "text-lime-400" },
  ];

  async function getData() {
    console.log("called ");
    try {
      const problemSet = await axios.get("/api/problems");
      console.log("problemSet is ", problemSet);
      problems = problemSet.data || [];
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleProblemClick = (problemId: string, premium = false) => {
    if (user.premiumUser) {
      window.location.href = `/problems/${problemId}`;
    } else {
      if (premium) {
        window.location.href = "/payment";
      } else {
        window.location.href = `/problems/${problemId}`;
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    return difficultyColors.find((d) => d.type === difficulty)?.color || "";
  };

  onMount(() => {
    getData();
  });
</script>

<div>
  <!-- AccountNavbar component would go here -->
  <div class="p-10">
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div class="p-4 bg-white dark:bg-gray-900">
        <label for="table-search" class="sr-only">Search</label>
        <div class="relative mt-1">
          <div
            class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
          >
            <Search class="text-white" size={20} />
          </div>
          <input
            type="text"
            id="table-search"
            bind:value={searchQuery}
            class="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for items"
          />
        </div>
      </div>

      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <!-- <th scope="col" class="p-4">Status</th> -->
            <th scope="col" class="px-6 py-3">Problem Title</th>
            <th scope="col" class="px-6 py-3">Difficulty</th>
            <th scope="col" class="px-6 py-3">Category</th>

            <th scope="col" class="px-6 py-3">Video Solution</th>
            <th scope="col" class="px-6 py-3">Premium</th>
          </tr>
        </thead>
        <tbody>
          {#each problems.filter((problem) => problem.title
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) as problem}
            <tr
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <!-- <td class="p-4"> -->
              <!-- { problem.status === 'completed' ? (
                  <CheckSquare class="text-green-500" size={20} />
                ) : (
                  <Square class="text-gray-400" size={20} />
                )} -->
              <!-- </td> -->
              <td
                class="px-6 py-4 cursor-pointer text-blue-600"
                on:click={() =>
                  handleProblemClick(problem.id, problem.isPremium)}
              >
                {problem.title}
              </td>
              <td class={`px-6 py-4 ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </td>
              <td class="px-6 py-4">
                {problem.category}
              </td>
              <td class="px-6 py-4">
                <!-- {problem.videoSolution ? (
                  <a href={problem.videoSolution} target="_blank">
                    <Youtube class="text-red-500" size={20} />
                  </a>
                ) : (
                  <span class="text-gray-400">N/A</span>
                )} -->
                {#if problem.videoSolution}
                  <a href={problem.videoSolution} target="_blank">
                    <Youtube class="text-red-500" size={20} />
                  </a>
                {:else}
                  <span class="text-gray-400">N/A</span>
                {/if}
              </td>
              <td>
                {#if problem.isPremium}
                  <a href={problem.videoSolution} target="_blank"> Yes </a>
                {:else}
                  <span class="text-gray-400">No</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
