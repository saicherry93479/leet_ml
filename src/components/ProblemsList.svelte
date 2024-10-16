<script lang="ts">
  import { writable, derived } from "svelte/store";
  import {
    ChevronDown,
    ArrowUpDown,
    Trash,
    Pencil,
    ChevronLeft,
    ChevronRight,
  } from "lucide-svelte";

  type Problem = {
    id: number;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    postedOn: string;
    usersAttempted: number;
  };

  const problems: Problem[] = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      postedOn: "2023-01-15",
      usersAttempted: 1000000,
    },
    {
      id: 2,
      title: "Add Two Numbers",
      difficulty: "Medium",
      postedOn: "2023-02-01",
      usersAttempted: 750000,
    },
    {
      id: 3,
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      postedOn: "2023-03-10",
      usersAttempted: 500000,
    },
    {
      id: 4,
      title: "Longest Palindromic Substring",
      difficulty: "Medium",
      postedOn: "2023-04-05",
      usersAttempted: 600000,
    },
    {
      id: 5,
      title: "Reverse Integer",
      difficulty: "Medium",
      postedOn: "2023-05-20",
      usersAttempted: 800000,
    },
  ];

  let searchTerm = writable("");
  let sortColumn = writable("id");
  let sortDirection = writable("asc");
  let visibleColumns = writable([
    "title",
    "difficulty",
    "postedOn",
    "usersAttempted",
  ]);
  let isColumnDropdownOpen = writable(false);
  let activeDropdown = writable<number | null>(null);

  // Pagination
  let currentPage = writable(1);
  let itemsPerPage = writable(10);

  $: filteredAndSortedProblems = derived(
    [searchTerm, sortColumn, sortDirection],
    ([$searchTerm, $sortColumn, $sortDirection]) => {
      return problems
        .filter(
          (problem) =>
            problem.title.toLowerCase().includes($searchTerm.toLowerCase()) ||
            problem.difficulty.toLowerCase().includes($searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          if (a[$sortColumn] < b[$sortColumn])
            return $sortDirection === "asc" ? -1 : 1;
          if (a[$sortColumn] > b[$sortColumn])
            return $sortDirection === "asc" ? 1 : -1;
          return 0;
        });
    }
  );

  $: paginatedProblems = derived(
    [filteredAndSortedProblems, currentPage, itemsPerPage],
    ([$filteredAndSortedProblems, $currentPage, $itemsPerPage]) => {
      const startIndex = ($currentPage - 1) * $itemsPerPage;
      const endIndex = startIndex + $itemsPerPage;
      return $filteredAndSortedProblems.slice(startIndex, endIndex);
    }
  );

  $: totalPages = derived(
    [filteredAndSortedProblems, itemsPerPage],
    ([$filteredAndSortedProblems, $itemsPerPage]) => {
      return Math.ceil($filteredAndSortedProblems.length / $itemsPerPage);
    }
  );

  function handleSort(column: keyof Problem) {
    if ($sortColumn === column) {
      $sortDirection = $sortDirection === "asc" ? "desc" : "asc";
    } else {
      $sortColumn = column;
      $sortDirection = "asc";
    }
  }

  function toggleColumn(column: keyof Problem) {
    $visibleColumns = $visibleColumns.includes(column)
      ? $visibleColumns.filter((col) => col !== column)
      : [...$visibleColumns, column];
  }

  function toggleColumnDropdown() {
    $isColumnDropdownOpen = !$isColumnDropdownOpen;
  }

  function toggleActionDropdown(id: number) {
    $activeDropdown = $activeDropdown === id ? null : id;
  }

  function closeAllDropdowns() {
    $isColumnDropdownOpen = false;
    $activeDropdown = null;
  }

  function editProblem(id: number) {
    console.log("Edit problem:", id);
    closeAllDropdowns();
  }

  function deleteProblem(id: number) {
    console.log("Delete problem:", id);
    closeAllDropdowns();
  }

  function difficultyColor(difficulty: Problem["difficulty"]) {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500";
      case "Medium":
        return "bg-yellow-500";
      case "Hard":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  }

  function goToPage(page: number) {
    $currentPage = Math.max(1, Math.min(page, $totalPages));
  }
</script>

<svelte:window on:click={closeAllDropdowns} />

<div class="w-full  py-10" on:click|stopPropagation>
  <div class="flex justify-between items-center mb-4 w-full">
    <input
      type="text"
      placeholder="Search problems..."
      bind:value={$searchTerm}
      class="max-w-sm p-2 border rounded"
    />
    <div class="relative inline-block text-left">
      <button
        type="button"
        class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
        id="options-menu"
        aria-haspopup="true"
        aria-expanded={$isColumnDropdownOpen}
        on:click|stopPropagation={toggleColumnDropdown}
      >
        Columns
        <ChevronDown class="ml-2 h-4 w-4" />
      </button>
      {#if $isColumnDropdownOpen}
        <div
          class="origin-top-right z-[999] absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div class="py-1" role="none">
            {#each Object.keys(problems[0]) as column}
              <label
                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                <input
                  type="checkbox"
                  checked={$visibleColumns.includes(column)}
                  on:change={() => toggleColumn(column)}
                  class="mr-2"
                />
                {column}
              </label>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
  <div class="rounded-md border">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          {#if $visibleColumns.includes("title")}
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <button
                class="flex items-center"
                on:click={() => handleSort("title")}
              >
                Title
                {#if $sortColumn === "title"}
                  <ArrowUpDown class="ml-2 h-4 w-4" />
                {/if}
              </button>
            </th>
          {/if}
          {#if $visibleColumns.includes("difficulty")}
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <button
                class="flex items-center"
                on:click={() => handleSort("difficulty")}
              >
                Difficulty
                {#if $sortColumn === "difficulty"}
                  <ArrowUpDown class="ml-2 h-4 w-4" />
                {/if}
              </button>
            </th>
          {/if}
          {#if $visibleColumns.includes("postedOn")}
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <button
                class="flex items-center"
                on:click={() => handleSort("postedOn")}
              >
                Posted On
                {#if $sortColumn === "postedOn"}
                  <ArrowUpDown class="ml-2 h-4 w-4" />
                {/if}
              </button>
            </th>
          {/if}
          {#if $visibleColumns.includes("usersAttempted")}
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <button
                class="flex items-center justify-end text-center"
                on:click={() => handleSort("usersAttempted")}
              >
                Users Attempted
                {#if $sortColumn === "usersAttempted"}
                  <ArrowUpDown class="ml-2 h-4 w-4" />
                {/if}
              </button>
            </th>
          {/if}
          <th
            class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each $paginatedProblems as problem}
          <tr>
            {#if $visibleColumns.includes("title")}
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {problem.title}
              </td>
            {/if}
            {#if $visibleColumns.includes("difficulty")}
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${difficultyColor(problem.difficulty)} text-white`}
                >
                  {problem.difficulty}
                </span>
              </td>
            {/if}
            {#if $visibleColumns.includes("postedOn")}
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {problem.postedOn}
              </td>
            {/if}
            {#if $visibleColumns.includes("usersAttempted")}
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
              >
                {problem.usersAttempted.toLocaleString()}
              </td>
            {/if}
            <td
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
            >
              <div class="relative inline-block text-left">
                <button
                  type="button"
                  class="bg-white rounded-full flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                  id="options-menu-{problem.id}"
                  aria-haspopup="true"
                  aria-expanded={$activeDropdown === problem.id}
                  on:click|stopPropagation={() =>
                    toggleActionDropdown(problem.id)}
                >
                  <span class="sr-only">Open options</span>
                  <ChevronDown class="h-5 w-5" />
                </button>
                {#if $activeDropdown === problem.id}
                  <div
                    class="origin-top-right z-[999] absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu-{problem.id}"
                  >
                    <div class="py-1" role="none">
                      <button
                        class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        role="menuitem"
                        on:click={() => editProblem(problem.id)}
                      >
                        <Pencil class="mr-3 h-5 w-5 text-gray-400" />
                        Edit
                      </button>
                      <button
                        class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                        role="menuitem"
                        on:click={() => deleteProblem(problem.id)}
                      >
                        <Trash class="mr-3 h-5 w-5 text-gray-400" />
                        Delete
                      </button>
                    </div>
                  </div>
                {/if}
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Pagination controls -->
  <div class="mt-4 flex items-center justify-between">
    <div>
      <p class="text-sm text-gray-700">
        Showing <span class="font-medium"
          >{($currentPage - 1) * $itemsPerPage + 1}</span
        >
        to
        <span class="font-medium"
          >{Math.min(
            $currentPage * $itemsPerPage,
            $filteredAndSortedProblems.length
          )}</span
        >
        of{" "}
        <span class="font-medium">{$filteredAndSortedProblems.length}</span> results
      </p>
    </div>
    <div>
      <nav
        class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        <button
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          on:click={() => goToPage($currentPage - 1)}
          disabled={$currentPage === 1}
        >
          <span class="sr-only">Previous</span>
          <ChevronLeft class="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          class="relative rotate-180 inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          on:click={() => goToPage($currentPage + 1)}
          disabled={$currentPage === 1}
        >
          <span class="sr-only">next</span>
          <ChevronLeft class="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    </div>
  </div>
</div>
