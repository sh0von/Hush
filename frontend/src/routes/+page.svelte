<script>
  import { formatDistanceToNow } from "date-fns";
  import NoteCard from "$lib/NoteCard.svelte";
  import axios from "axios";
  import { onMount } from "svelte";
  import { messageCreated } from "$lib/EventBus.js";
  import { API_URL } from "$lib/Api.js";

  let sortedData = [];
  let data = [];
  let isLoading = true;
  let numCardsToShow = 5;

  async function fetchData() {
    try {
      const response = await axios.get(`${API_URL}/messages`);
      data = response.data;
      sortedData = [...data].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      isLoading = false;
    }
  }

  async function loadMore() {
    numCardsToShow += 3;
    if (numCardsToShow > sortedData.length) {
      numCardsToShow = sortedData.length;
    }
  }

  messageCreated.subscribe(async (value) => {
    if (value) {
      await fetchData();

      messageCreated.set(false);
    }
  });

  onMount(() => {
    fetchData();
  });
  function formatPostInfo(timestamp) {
    const postDate = new Date(timestamp);
    return formatDistanceToNow(postDate, { addSuffix: true });
  }
</script>

{#if isLoading}
  <div class="flex justify-center items-center h-screen">
    <div
      class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"
    ></div>
  </div>
{:else}
  <main class="py-8 px-8 flex justify-center">
    <div class="container mx-auto max-w-xl">
      <div class="grid grid-cols-1 gap-4">
        {#each sortedData.slice(0, numCardsToShow) as item}
          <NoteCard
            avatarSrc={`https://api.multiavatar.com/${item.name}.png`}
            username={item.name}
            message={item.message}
            postInfo={formatPostInfo(item.timestamp)}
          />
        {/each}
      </div>
      {#if numCardsToShow < sortedData.length}
        <div class="flex justify-center">
          {#if isLoading}
            <!-- Loader animation -->
            <div
              class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"
            ></div>
          {:else}
            <!-- Load More button -->
            <button
              style="border-radius: 10%; font-size: 15px;"
              class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              on:click={loadMore}
            >
              -_-
            </button>
          {/if}
        </div>
      {:else}
        <!-- All Loaded text -->
        <p class="text-center text-gray-500 mt-4">All Loaded -_-</p>
      {/if}
    </div>
  </main>
{/if}

<style>
  .loader {
    border-top-color: #3498db;
    border-left-color: #3498db;
    animation: spin 1s infinite linear;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
