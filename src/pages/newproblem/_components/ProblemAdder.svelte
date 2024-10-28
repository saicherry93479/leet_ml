<script lang="ts">
  import { tick } from "svelte";
  import { Alert, AlertDescription } from "@/components/ui/alert";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import { Switch } from "@/components/ui/switch";

  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Textarea } from "@/components/ui/textarea";

  let isPremium = $state(false);

  interface Example {
    inputText: string;
    outputText: string;
    explanation?: string;
  }

  interface TestCase {
    input: string;
    output: string;
  }

  let title = $state("");
  let difficulty = $state("Easy");
  let description = $state("");
  let inputFormat = $state("");
  let outputFormat = $state("");
  let constraints = $state("");
  let category = $state("");
  let order = $state<number | null>(null);
  let videoId = $state("");
  let starterCode = $state("");
  let examples = $state<Example[]>([
    { inputText: "", outputText: "", explanation: "" },
  ]);
  let testCases = $state<TestCase[]>([{ input: "", output: "" }]);
  let tags = $state<string[]>([]);
  let newTag = $state("");
  let successMessage = $state("");
  let errorMessage = $state("");

  function addExample() {
    examples = [
      ...examples,
      { inputText: "", outputText: "", explanation: "" },
    ];
  }

  function removeExample(index: number) {
    examples = examples.filter((_, i) => i !== index);
  }

  function addTestCase() {
    testCases = [...testCases, { input: "", output: "" }];
  }

  function removeTestCase(index: number) {
    testCases = testCases.filter((_, i) => i !== index);
  }

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
        category,
        order,
        videoId,
        starterCode,
        examples,
        testCases,
        tags,
        isPremium,
      };

      const response = await fetch("/api/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(problemData),
      });
      console.log("response is ", response);
      if (!response.ok) {
        throw new Error("Failed to save problem");
      }

      successMessage = "Problem added successfully!";
      errorMessage = "";
      resetForm();
    } catch (error) {
      errorMessage =
        "An error occurred while adding the problem. Please try again.";
      alert(errorMessage);
      successMessage = "";
      console.error(error);
    }
  }

  function resetForm() {
    title = "";
    difficulty = "Easy";
    description = "";
    inputFormat = "";
    outputFormat = "";
    constraints = "";
    category = "";
    order = null;
    videoId = "";
    starterCode = "";
    examples = [{ inputText: "", outputText: "", explanation: "" }];
    testCases = [{ input: "", output: "" }];
    tags = [];
    newTag = "";
    isPremium = false;
  }
</script>

<form
  on:submit|preventDefault={handleSubmit}
  class="space-y-6 mt-8 w-full max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200"
>
  <h2 class="text-3xl font-bold mb-8 text-center text-gray-900">
    Add New Problem
  </h2>

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

  <!-- Basic Info -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <Label for="title">Title</Label>
      <Input type="text" id="title" bind:value={title} required />
    </div>

    <div>
      <Label for="difficulty">Difficulty</Label>
      <Select bind:value={difficulty}>
        <SelectTrigger>
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

  <!-- Description -->
  <div>
    <Label for="description">Description</Label>
    <Textarea id="description" bind:value={description} rows="4" required />
  </div>

  <!-- Format -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <Label for="inputFormat">Input Format</Label>
      <Textarea id="inputFormat" bind:value={inputFormat} rows="3" />
    </div>

    <div>
      <Label for="outputFormat">Output Format</Label>
      <Textarea id="outputFormat" bind:value={outputFormat} rows="3" />
    </div>
  </div>

  <!-- Examples -->
  <div>
    <Label>Examples</Label>
    {#each examples as example, i}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <Label for={`example-input-${i}`}>Input</Label>
          <Textarea
            id={`example-input-${i}`}
            bind:value={example.inputText}
            rows="2"
          />
        </div>
        <div>
          <Label for={`example-output-${i}`}>Output</Label>
          <Textarea
            id={`example-output-${i}`}
            bind:value={example.outputText}
            rows="2"
          />
        </div>
        <div class="col-span-2">
          <Label for={`example-explanation-${i}`}>Explanation</Label>
          <Textarea
            id={`example-explanation-${i}`}
            bind:value={example.explanation}
            rows="2"
          />
        </div>
      </div>
      {#if examples.length > 1}
        <Button
          type="button"
          variant="destructive"
          class="mt-2"
          on:click={() => removeExample(i)}
        >
          Remove Example
        </Button>
      {/if}
    {/each}
    <Button type="button" variant="outline" class="mt-4" on:click={addExample}>
      Add Example
    </Button>
  </div>

  <!-- Test Cases -->
  <div>
    <Label>Test Cases</Label>
    {#each testCases as testCase, i}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <Label for={`test-input-${i}`}>Input</Label>
          <Textarea
            id={`test-input-${i}`}
            bind:value={testCase.input}
            rows="2"
          />
        </div>
        <div>
          <Label for={`test-output-${i}`}>Output</Label>
          <Textarea
            id={`test-output-${i}`}
            bind:value={testCase.output}
            rows="2"
          />
        </div>
      </div>
      {#if testCases.length > 1}
        <Button
          type="button"
          variant="destructive"
          class="mt-2"
          on:click={() => removeTestCase(i)}
        >
          Remove Test Case
        </Button>
      {/if}
    {/each}
    <Button type="button" variant="outline" class="mt-4" on:click={addTestCase}>
      Add Test Case
    </Button>
  </div>

  <!-- Additional Fields -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <Label for="category">Category</Label>
      <Input type="text" id="category" bind:value={category} />
    </div>
    <div>
      <Label for="order">Order</Label>
      <Input type="number" id="order" bind:value={order} />
    </div>
  </div>

  <div>
    <Label for="videoId">Video ID</Label>
    <Input type="text" id="videoId" bind:value={videoId} />
  </div>

  <div>
    <Label for="starterCode">Starter Code</Label>
    <Textarea id="starterCode" bind:value={starterCode} rows="6" />
  </div>

  <!-- Tags -->
  <div>
    <Label>Tags</Label>
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
          >
            ×
          </button>
        </span>
      {/each}
    </div>

    <div class="mt-4 flex">
      <Input
        type="text"
        bind:value={newTag}
        placeholder="Add a tag"
        class="rounded-r-none"
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
  <div class="flex items-center space-x-2">
    <Switch id="premium" bind:checked={isPremium} />
    <Label for="premium">Premium Problem</Label>
  </div>

  <!-- Submit/Reset Buttons -->
  <div class="flex justify-end space-x-4 mt-8">
    <Button type="button" on:click={resetForm} variant="outline">Reset</Button>
    <Button type="submit">Add Problem</Button>
  </div>
</form>
