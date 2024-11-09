<!-- src/components/ProblemList.svelte -->
<script lang="ts">
  import axios from "axios";
  import { onMount } from "svelte";
  import { Search, CheckSquare, Square, Youtube } from "lucide-svelte";
  import type { Users, ProblemList } from "../types";

  let problems: any[] = [];
  let user: Users | undefined;
  let searchQuery = "";

  const difficultyColors = [
    {
      type: "Hard",
      color: "text-red-500",
    },
    {
      type: "Medium",
      color: "text-orange-400",
    },
    {
      type: "Easy",
      color: "text-lime-400",
    },
  ];

  async function getData() {
    console.log("called ");
    try {
      const problemSet = await axios.get("");
      problems = problemSet.data.data;

      const apiProblems = await axios.get("/api/problems");
      console.log("userData is ", apiProblems);
      problems = apiProblems.data || [];
    } catch (error) {
      console.log(error);
    }
  }

  const handleProblemClick = (problemId: string) => {
    window.location.href = `/problems/${problemId}`;
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
            class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none"
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

      <table
        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="p-4">Status</th>
            <th scope="col" class="px-6 py-3">Problem Title</th>
            <th scope="col" class="px-6 py-3">Difficulty</th>
            <th scope="col" class="px-6 py-3">Category</th>

            <th scope="col" class="px-6 py-3">Video Solution</th>
          </tr>
        </thead>
        <tbody>
          {#each problems as problem (problem._id)}
            <tr
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td class="w-4 p-4">
                {#if user?.problemList}
                  {#each user.problemList as userProblem (userProblem._id)}
                    {#if userProblem._id === problem._id}
                      {#if userProblem.solved}
                        <CheckSquare size={20} class="text-green-500" />
                      {:else}
                        <Square size={20} class="text-green-500" />
                      {/if}
                    {/if}
                  {/each}
                {/if}
              </td>
              <th
                scope="row"
                class="px-6 py-4 hover:text-cyan-400 hover:cursor-pointer font-medium text-gray-900 whitespace-nowrap dark:text-white"
                on:click={() => handleProblemClick(problem.id)}
              >
                {problem.order}. {problem.title}
              </th>
              <td
                class="px-6 py-4 {difficultyColors.find(
                  (d) => d.type === problem.difficulty
                )?.color} hover:cursor-pointer"
              >
                {problem.difficulty}
              </td>
              <td class="px-6 py-4">
                {problem.category}
              </td>

              <td class="px-6 py-4 flex justify-between">
                <a href="https://www.youtube.com/{problem.videoId}">
                  <Youtube size={35} class="text-red-500" />
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
