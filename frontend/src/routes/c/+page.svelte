<script>
  // Import necessary modules
  import axios from "axios";
  import { API_URL } from "$lib/Api.js";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";

  // Define stores and variables
  const messages = writable([]);
  let password = "";
  const correctPassword = "12345";
  let isAuthenticated = false;
  let deletingMessageId = null;
  const isLocalStorageAvailable = typeof localStorage !== "undefined";

  // Define analytics variables
  let totalMessages = 0;
  let totalMessagesToday = 0;
  let totalMessagesYesterday = 0;
  let percentIncrease = 0;

  // Check if the user is authenticated using local storage
  if (isLocalStorageAvailable) {
    isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  }

  // Function to handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    if (password === correctPassword) {
      isAuthenticated = true;
      if (isLocalStorageAvailable) {
        localStorage.setItem("isAuthenticated", "true");
      }
      await fetchMessages();
    } else {
      isAuthenticated = false;
      if (isLocalStorageAvailable) {
        localStorage.setItem("isAuthenticated", "false");
      }
      console.log("Access denied");
    }
  }

  // Function to fetch messages from the API
  async function fetchMessages() {
    try {
      const response = await axios.get(`${API_URL}/messages`);
      const sortedMessages = response.data.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      messages.set(sortedMessages);

      // Update analytics data
      updateAnalytics(sortedMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  }

  // Function to delete a message
  async function deleteMessage(id) {
    try {
      deletingMessageId = id;
      await axios.delete(`${API_URL}/messages/${id}`);
    } catch (error) {
      console.error("Failed to delete message:", error);
    } finally {
      deletingMessageId = null;
    }
  }

  // Function to update analytics data
  function updateAnalytics(sortedMessages) {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 864e5).toDateString(); // 864e5 ms = 1 day

    totalMessages = sortedMessages.length;
    totalMessagesToday = sortedMessages.filter(
      (message) => new Date(message.timestamp).toDateString() === today
    ).length;
    totalMessagesYesterday = sortedMessages.filter(
      (message) => new Date(message.timestamp).toDateString() === yesterday
    ).length;
    percentIncrease = calculatePercentageIncrease(
      totalMessagesYesterday,
      totalMessagesToday
    );
  }

  // Function to calculate percentage increase
  function calculatePercentageIncrease(previousValue, currentValue) {
    if (previousValue === 0) return 100; // Handle division by zero
    return ((currentValue - previousValue) / previousValue) * 100;
  }function exportMessages() {
  const filename = "messages.json";
  const data = JSON.stringify($messages);
  const blob = new Blob([data], { type: "application/json" });

  if (navigator.msSaveBlob) {
    // For IE and Edge
    navigator.msSaveBlob(blob, filename);
  } else {
    // For other browsers
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
async function deleteAllMessages() {
  try {
    await axios.delete(`${API_URL}/messages`);
    // Clear messages store
    messages.set([]);
    console.log("All messages deleted successfully.");
  } catch (error) {
    console.error("Failed to delete all messages:", error);
  }
}
function handleImport(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    try {
      const importedMessages = JSON.parse(e.target.result);
      // Call your API to import messages
      // Example:
      // await axios.post(`${API_URL}/messages/import`, importedMessages);
      // Refresh messages
      await fetchMessages();
      console.log("Messages imported successfully.");
    } catch (error) {
      console.error("Failed to import messages:", error);
    }
  };

  reader.readAsText(file);
}


  // Run onMount to fetch messages when the component mounts
  onMount(async () => {
    if (isAuthenticated) {
      await fetchMessages();
    }

    // Subscribe to messages store and fetch messages whenever it changes
    messages.subscribe(async () => {
      await fetchMessages();
    });
  });
</script>

<main class="flex-col items-center justify-center min-h-screen p-4">
  <!-- Password form -->
  {#if isAuthenticated}
    <!-- Analytics cards section -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4"
    >
      <!-- Total Messages Card -->
      <div class="bg-white shadow-md rounded-lg p-4">
        <h2 class="text-lg font-semibold text-gray-800 mb-2">Total Messages</h2>
        <p class="text-gray-600">{totalMessages}</p>
      </div>
      <!-- Total Messages Today Card -->
      <div class="bg-white shadow-md rounded-lg p-4">
        <h2 class="text-lg font-semibold text-gray-800 mb-2">
          Total Messages Today
        </h2>
        <p class="text-gray-600">{totalMessagesToday}</p>
      </div>
      <!-- Total Messages Yesterday Card -->
      <div class="bg-white shadow-md rounded-lg p-4">
        <h2 class="text-lg font-semibold text-gray-800 mb-2">
          Total Messages Yesterday
        </h2>
        <p class="text-gray-600">{totalMessagesYesterday}</p>
      </div>
      <!-- Percentage Increase Card -->
      <div class="bg-white shadow-md rounded-lg p-4">
        <h2 class="text-lg font-semibold text-gray-800 mb-2">
          Percentage Increase
        </h2>
        <div class="flex items-center">
          <p class="text-gray-600 mr-2">{percentIncrease.toFixed(2)}%</p>
          {#if percentIncrease > 0}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M2.707 7.293a1 1 0 011.414 0L10 13.586l6.879-6.88a1 1 0 111.414 1.414l-7.586 7.586a1 1 0 01-1.414 0L2.707 8.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          {:else if percentIncrease < 0}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.293 7.293a1 1 0 011.414 0L10 8.586l.293-.293a1 1 0 011.414 1.414l-.293.293.293.293a1 1 0 01-1.414 1.414L10 11.414l-.293.293a1 1 0 01-1.414-1.414l.293-.293-.293-.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          {/if}
        </div>
      </div>
    </div>
    <hr />
    <!-- Message Section -->
    {#if $messages.length > 0}
      <div
        class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4"
      >
        {#each $messages as message (message._id)}
          <div class="bg-white shadow-md rounded-lg p-4 sm:w-full md:w-90">
            <h2 class="text-lg font-semibold text-gray-800 mb-2">
              {message.name}
            </h2>
            <p class="text-gray-600">{message.message}</p>
            <button
              class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-400"
              class:opacity-50={deletingMessageId === message._id}
              on:click={() => deleteMessage(message._id)}
              disabled={deletingMessageId === message._id}
            >
              {deletingMessageId === message._id ? "Deleting..." : "Delete"}
            </button>
          </div>
        {/each}
        <button
  on:click={exportMessages}
  class="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded focus:outline-none focus:ring focus:ring-green-400 w-full md:w-auto mt-4"
>
  Export All Messages
</button><button
on:click={deleteAllMessages}
class="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded focus:outline-none focus:ring focus:ring-red-400 w-full md:w-auto mt-4"
>
Delete All Messages
</button>
<input
  type="file"
  accept=".json"
  id="importFile"
  class="hidden"
  on:change={handleImport}
/>
<label
  for="importFile"
  class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded focus:outline-none focus:ring focus:ring-blue-400 w-full md:w-auto mt-4 cursor-pointer"
>
  Import Messages
</label>

      </div>
    {:else}
      <p class="mt-4 text-gray-600">No messages available.</p>
    {/if}
  {:else}
    <div class=" shadow-md rounded-lg p-8 m-">
      <h1 class="text-3xl font-bold mb-6">Password Protected Page</h1>
      <form on:submit={handleSubmit} class="flex flex-col items-center">
        <label for="password" class="mb-2 text-lg font-semibold"
          >Password:</label
        >
        <input
          type="password"
          id="password"
          bind:value={password}
          required
          style="color:black"
          class="mb-4 p-3 border border-gray-300 rounded w-full"
        />
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded focus:outline-none focus:ring focus:ring-blue-400 w-full md:w-auto"
        >
          Submit
        </button>
      </form>
    </div>
  {/if}
</main>
