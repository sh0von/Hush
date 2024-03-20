<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import { messageCreated } from "./EventBus.js";
  import { API_URL } from "$lib/Api.js";

  let modalVisible = false;
  let showToast = false;

  function closeToast() {
    showToast = false;
  }

  function closeModal() {
    modalVisible = false;
  }

  function openModal() {
    modalVisible = true;
  }

  function generateRandomName() {
    const adjectives = [
      "Happy", "Silly", "Cheerful", "Clever", "Kind", "Lucky", "Excited", "Playful", "Friendly", "Energetic", "Creative", "Brave", "Joyful", "Peaceful", "Curious", "Radiant", "Sunny", "Gentle", "Magical", "Adventurous"
    ];

    const nouns = [
      "Panda", "Sunshine", "Dolphin", "Rainbow", "Star", "Moon", "Flower", "Ocean", "Butterfly", "Unicorn", "Cloud", "Mountain", "Sparkle", "Breeze", "Harmony", "Whisper", "Candy", "Dream", "Giggles", "Cherub"
    ];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective} ${randomNoun}`;
  }

  async function postData(name, message) {
    try {
      await axios.post(`${API_URL}/messages`, { name, message });
      console.log("Message posted successfully!");
      showToast = true;
      messageCreated.set(true);
      closeModal();
    } catch (error) {
      console.error("Error posting message:", error);
    }
  }

  function minimizeModal() {
    modalVisible = !modalVisible;
  }

  function closeModalOutside(event) {
    if (event.target.id === "myModal") {
      modalVisible = false;
    }
  }

  onMount(() => {
    const mobileMenuBtn = document.getElementById("minimizeModalBtn");
    mobileMenuBtn.addEventListener("click", minimizeModal);
  });

  function showToastWithAutoClose() {
    showToast = true;
    setTimeout(closeToast, 5000); // Close the toast after 5 seconds
  }

  function handleSubmit(event) {
    event.preventDefault();
    let name = event.target.elements.name.value.trim();
    const message = event.target.elements.message.value.trim();

    if (name === "") {
      name = generateRandomName();
    }

    if (message === "") {
      alert("Please enter a message.");
      return;
    }

    postData(name, message);
    event.target.reset();
  }
</script>

<button on:click={openModal} class="fixed bottom-8 right-8 bg-blue-600 text-white my-8 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300">
  Write
</button>

{#if showToast}
  <div id="toast-top-right" class="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow top-5 left-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800" role="alert">
    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
      <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
      </svg>
      <span class="sr-only">Check icon</span>
    </div>
    <div class="ms-3 text-sm font-normal">Message posted successfully.</div>
    <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" on:click={closeToast} aria-label="Close">
      <span class="sr-only">Close</span>
      <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
      </svg>
    </button>
  </div>
{/if}

<div id="myModal" class="modal" style="display: {modalVisible ? 'flex' : 'none'}">
  <div class="modal-content bg-gray-100 shadow-lg rounded-lg">
    <div class="modal-header flex justify-between items-center p-4">
      <h2 class="text-lg font-semibold">Write Your Note</h2>
      <button id="minimizeModalBtn" class="close-btn">-</button>
    </div>
    <div class="modal-body p-4">
      <form on:submit={handleSubmit}>
        <input type="text" name="name" style="color: white;" placeholder="Your Name (Optional)" class="w-full mb-4 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-400" />
        <textarea name="message" placeholder="Write your note" rows="4" style="color: white;" class="w-full text-white mb-4 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"></textarea>
        <button type="submit" style="background-color: #2563eb" class="text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-all duration-300">Post</button>
      </form>
    </div>
  </div>
</div>
