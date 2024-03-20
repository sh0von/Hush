<script>
  import axios from "axios";
  import { API_URL } from "$lib/Api.js";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";

  const messages = writable([]);
  let password = "";
  const correctPassword = "12345";
  let isAuthenticated = false;
  let deletingMessageId = null;

  const isLocalStorageAvailable = typeof localStorage !== "undefined";

  if (isLocalStorageAvailable) {
    isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  }

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

  async function fetchMessages() {
    try {
      const response = await axios.get(`${API_URL}/messages`);

      const sortedMessages = response.data.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      messages.set(sortedMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  }

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

  onMount(async () => {
    if (isAuthenticated) {
      await fetchMessages();
    }

    messages.subscribe(async (value) => {
      await fetchMessages();
    });
  });
</script>
<main class="flex flex-col items-center justify-center min-h-screen">
  {#if isAuthenticated}
    {#if $messages.length > 0}
      <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {#each $messages as message (message._id)}
          <div class="bg-white shadow-md rounded-lg p-4">
            <h2 class="text-lg font-semibold text-gray-800 mb-2">{message.name}</h2>
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
      </div>
    {:else}
      <p class="mt-4 text-gray-600">No messages available.</p>
    {/if}
  {:else}
    <div class="bg-white shadow-md rounded-lg p-8">
      <h1 class="text-3xl font-bold mb-6">Password Protected Page</h1>
      <form on:submit={handleSubmit} class="flex flex-col items-center">
        <label for="password" class="mb-2 text-lg font-semibold">Password:</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          required
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
