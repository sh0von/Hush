<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import { messageCreated } from "./EventBus.js";
  import { API_URL } from "$lib/Api.js";

  function closeModal() {
    document.getElementById("minimizeModalBtn").click();
  }

  function generateRandomName() {
    const adjectives = [
      "Happy",
      "Silly",
      "Cheerful",
      "Clever",
      "Kind",
      "Lucky",
      "Excited",
      "Playful",
      "Friendly",
      "Energetic",
      "Creative",
      "Brave",
      "Joyful",
      "Peaceful",
      "Curious",
      "Radiant",
      "Sunny",
      "Gentle",
      "Magical",
      "Adventurous",
    ];

    const nouns = [
      "Panda",
      "Sunshine",
      "Dolphin",
      "Rainbow",
      "Star",
      "Moon",
      "Flower",
      "Ocean",
      "Butterfly",
      "Unicorn",
      "Cloud",
      "Mountain",
      "Sparkle",
      "Breeze",
      "Harmony",
      "Whisper",
      "Candy",
      "Dream",
      "Giggles",
      "Cherub",
    ];

    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective} ${randomNoun}`;
  }

  async function postData(name, message) {
    try {
      await axios.post(`${API_URL}/messages`, { name, message });
      console.log("Message posted successfully!");

      closeModal();

      messageCreated.set(true);
    } catch (error) {
      console.error("Error posting message:", error);
    }
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

<div class="modal-content bg-gray-100 shadow-lg rounded-lg">
  <div class="modal-header flex justify-between items-center p-4">
    <h2 class="text-lg font-semibold">Write Your Note</h2>
    <button id="minimizeModalBtn" class="close-btn">-</button>
  </div>
  <div class="modal-body p-4">
    <form on:submit={handleSubmit}>
      <input
        type="text"
        name="name"
        style="color: white;"
        placeholder="Your Name (Optional)"
        class="w-full mb-4 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
      />
      <textarea
        name="message"
        placeholder="Write your note"
        rows="4"
        style="color: white;"
        class="w-full text-white mb-4 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
      ></textarea>
      <button
        type="submit"
        style="background-color: #2563eb"
        class="text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-all duration-300"
        >Post</button
      >
    </form>
  </div>
</div>
