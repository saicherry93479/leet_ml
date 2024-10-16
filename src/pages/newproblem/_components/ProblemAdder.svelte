<script lang="ts">
    import { tick } from "svelte";
    import { Alert, AlertDescription } from "@/components/ui/alert";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
    } from "@/components/ui/select";
    import { Textarea } from "@/components/ui/textarea";
  
    let title = $state("");
    let difficulty = $state("Easy");
    let description = $state("");
    let inputFormat = $state("");
    let outputFormat = $state("");
    let constraints = $state("");
    let sampleInput = $state("");
    let sampleOutput = $state("");
    let tags = $state([]);
    let newTag = $state("");
    let successMessage = $state("");
    let errorMessage = $state("");
  
    function addTag() {
      if (newTag && !tags.includes(newTag)) {
        tags = [...tags, newTag];
        newTag = "";
      }
    }
  
    function removeTag(tag: string) {
      tags = tags.filter((t) => t !== tag);
    }
  
    async function handleSubmit() {
      try {
        const problemData = {
          title,
          difficulty,
          description,
          inputFormat,
          outputFormat,
          constraints,
          sampleInput,
          sampleOutput,
          tags,
        };
  
        await tick();
        console.log("Submitting problem:", problemData);
  
        successMessage = "Problem added successfully!";
        errorMessage = "";
        resetForm();
      } catch (error) {
        errorMessage =
          "An error occurred while adding the problem. Please try again.";
        successMessage = "";
      }
    }
  
    function resetForm() {
      title = "";
      difficulty = "Easy";
      description = "";
      inputFormat = "";
      outputFormat = "";
      constraints = "";
      sampleInput = "";
      sampleOutput = "";
      tags = [];
      newTag = "";
    }
  </script>
  
  <form
    on:submit|preventDefault={handleSubmit}
    class="space-y-6 mt-8 w-full max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200"
  >
    <h2 class="text-3xl font-bold mb-8 text-center text-gray-900">Add New Problem</h2>
  
    {#if successMessage}
      <Alert variant="success" class="mb-4">
        <AlertDescription>{successMessage}</AlertDescription>
      </Alert>
    {/if}
  
    {#if errorMessage}
      <Alert variant="destructive" class="mb-4">
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    {/if}
  
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <Label for="title" class="block mb-2 text-sm font-medium text-gray-700">Title</Label>
        <Input type="text" id="title" bind:value={title} class="rounded-lg border-gray-300" required />
      </div>
  
      <div>
        <Label for="difficulty" class="block mb-2 text-sm font-medium text-gray-700">Difficulty</Label>
        <Select bind:value={difficulty}>
          <SelectTrigger class="rounded-lg border-gray-300">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  
    <div>
      <Label for="description" class="block mb-2 text-sm font-medium text-gray-700">Description</Label>
      <Textarea id="description" bind:value={description} rows="4" class="rounded-lg border-gray-300" required />
    </div>
  
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <Label for="inputFormat" class="block mb-2 text-sm font-medium text-gray-700">Input Format</Label>
        <Textarea id="inputFormat" bind:value={inputFormat} rows="3" class="rounded-lg border-gray-300" />
      </div>
  
      <div>
        <Label for="outputFormat" class="block mb-2 text-sm font-medium text-gray-700">Output Format</Label>
        <Textarea id="outputFormat" bind:value={outputFormat} rows="3" class="rounded-lg border-gray-300" />
      </div>
    </div>
  
    <div>
      <Label for="constraints" class="block mb-2 text-sm font-medium text-gray-700">Constraints</Label>
      <Textarea id="constraints" bind:value={constraints} rows="3" class="rounded-lg border-gray-300" />
    </div>
  
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <Label for="sampleInput" class="block mb-2 text-sm font-medium text-gray-700">Sample Input</Label>
        <Textarea id="sampleInput" bind:value={sampleInput} rows="3" class="rounded-lg border-gray-300" />
      </div>
  
      <div>
        <Label for="sampleOutput" class="block mb-2 text-sm font-medium text-gray-700">Sample Output</Label>
        <Textarea id="sampleOutput" bind:value={sampleOutput} rows="3" class="rounded-lg border-gray-300" />
      </div>
    </div>
  
    <div>
      <Label class="block mb-2 text-sm font-medium text-gray-700">Tags</Label>
      <div class="flex flex-wrap gap-2 mt-2">
        {#each tags as tag}
          <span
            class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center"
          >
            {tag}
            <button
              type="button"
              on:click={() => removeTag(tag)}
              class="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
              aria-label="Remove tag"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </span>
        {/each}
      </div>
  
      <div class="mt-4 flex">
        <Input
          type="text"
          bind:value={newTag}
          placeholder="Add a tag"
          class="rounded-r-none border-gray-300"
        />
        <Button
          type="button"
          on:click={addTag}
          variant="secondary"
          class="rounded-l-none"
        >
          Add
        </Button>
      </div>
    </div>
  
    <div class="flex justify-end space-x-4 mt-8">
      <Button type="button" on:click={resetForm} variant="outline" class="bg-white border-gray-300">Reset</Button>
      <Button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white">Add Problem</Button>
    </div>
  </form>
  