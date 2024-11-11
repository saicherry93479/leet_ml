<script lang="ts">
  let { user, submissions } = $props();
  function getProfilePicUrl(name) {
    const formattedName = encodeURIComponent(name.trim().replace(/\s+/g, "+"));
    const url = `https://ui-avatars.com/api/?name=${formattedName}&background=random&size=256`;
    return url;
  }

  // Example usage
  const name = "John Doe";
  const profilePicUrl = getProfilePicUrl(name);
  console.log("Profile Picture URL:", profilePicUrl);
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
</script>

<div class="max-w-[80rem] mx-auto">
  <div class="flex  flex-col  items-center">
    <img
      src={getProfilePicUrl(user.name)}
      class="w-[150px] h-[150px] rounded-full"
    />
    <p class="text-[30px]">{user.name}</p>
    {#if user.premiumUser}
      <p>Your are a premium user</p>
    {:else}
      <p>Upgrade to premium</p>
    {/if}
  </div>

  <table
    class="w-full mt-12 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
  >
    <thead
      class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
    >
      <tr>
        <th scope="col" class="p-4">Title</th>
        <th scope="col" class="px-6 py-3">Difficulty</th>
        <th scope="col" class="px-6 py-3">Catgory</th>
        <th scope="col" class="px-6 py-3">Submitted At</th>
      </tr>
    </thead>
    <tbody>
      {#each submissions as problem, index}
        <tr
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <a
            href={`/problems/${problem.id}`}
            scope="row"
            class="px-6 py-4 hover:text-cyan-400 hover:cursor-pointer font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {problem.title}
          </a>
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
          <td class="px-6 py-4">
            {new Date(problem.submitedAt).toDateString()}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
