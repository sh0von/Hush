<script>
  import axios from "axios";
  import { API_URL } from "$lib/Api.js";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";

  const messages = writable([]);
  let password = "";
  const correctPassword = "password";
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

<main class="flex flex-col items-center justify-center h-screen">
  {#if isAuthenticated}
    <h1 class="text-3xl font-bold mb-6">Admin Panel - Messages</h1>
    {#if $messages.length > 0}
      <div class="overflow-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-200">
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >Name</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >Message</th
              >
              <th
                class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >Actions</th
              >
            </tr>
          </thead>
          <tbody>
            {#each $messages as message (message._id)}
              <tr class="border-b border-gray-200">
                <td class="px-6 py-4 whitespace-nowrap">{message.name}</td>
                <td class="px-6 py-4 whitespace-nowrap">{message.message}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-400"
                    class:opacity-50={deletingMessageId === message._id}
                    on:click={() => deleteMessage(message._id)}
                    disabled={deletingMessageId === message._id}
                  >
                    {deletingMessageId === message._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <p class="mt-4">No messages available.</p>
    {/if}
  {:else}
    <h1 class="text-3xl font-bold mb-6">Password Protected Page</h1>
    <form on:submit={handleSubmit} class="flex flex-col items-center">
      <label for="password" class="mb-2 text-lg font-semibold">Password:</label>
      <input
        type="password"
        id="password"
        bind:value={password}
        required
        class="mb-4 p-3 border border-gray-300 rounded w-64"
      />
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded focus:outline-none focus:ring focus:ring-blue-400"
      >
        Submit
      </button>
    </form>
  {/if}
</main>
