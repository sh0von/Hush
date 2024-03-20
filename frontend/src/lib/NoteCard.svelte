<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import { API_URL } from "$lib/Api.js";

  export let avatarSrc;
  export let username;
  export let message;
  export let postInfo;
  export let loveCount;
  export let messageId;

  let isLoved = false;
  let isPopoverVisible = false;

  async function increaseLove() {
    try {
      const response = await axios.put(`${API_URL}/messages/${messageId}/love`);
      loveCount = response.data.loveCount;
      isLoved = true;
    } catch (error) {
      console.error("Error increasing love:", error);
    }
  }

  onMount(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/messages/${messageId}/loved`
      );
      isLoved = response.data.isLoved;
    } catch (error) {
      console.error("Error fetching love status:", error);
    }
  });

  function showPopover() {
    isPopoverVisible = true;
  }

  function hidePopover() {
    isPopoverVisible = false;
  }
</script>

<div
  class="relative note-card w-full pixel rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300"
  on:mouseover={showPopover}
  on:mouseout={hidePopover}
>
  <div class="flex items-center justify-between mb-2">
    <div class="flex items-center">
      <img src={avatarSrc} class="w-8 h-8 rounded-full mr-2" alt="Avatar" />
      <span class="font-semibold text-white">{username}</span>
    </div>
    <div
      class="flex items-center"
      on:click={increaseLove}
      style="cursor: pointer;"
    >
      {#if isLoved}
        <svg
          class="w-6 h-6 fill-current text-green-500 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      {:else}
        <svg
          class="w-6 h-6 fill-current text-white mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      {/if}
      <span class="text-white">{loveCount}</span>
    </div>
  </div>
  <hr class="py-2" />
  <p class="text-white mb-4">{message}</p>
  <small class="text-white">{postInfo}</small>

  {#if isPopoverVisible}
    <div
      class="absolute z-10 top-full left-0 w-64 mt-2 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0"
      on:mouseover={showPopover}
      on:mouseout={hidePopover}
    >
      <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
        <h3 class="font-semibold text-gray-900">Popover title</h3>
      </div>
      <div class="px-3 py-2">
        <p>And here's some amazing content. It's very engaging. Right?</p>
      </div>
    </div>
  {/if}
</div>
