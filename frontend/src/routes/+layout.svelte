<script>
  import "../app.css";
  import { onMount } from "svelte";
  import NoteCreate from "../lib/NoteCreate.svelte";

  onMount(() => {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    mobileMenuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
      mobileMenu.classList.toggle("fade-in");
    });
  });
</script>

<header class="py-4">
  <div class="container mx-auto flex justify-between items-center px-8">
    <a href="../"><h1 class="text-3xl">HUSH</h1></a>
    <nav class="hidden md:block">
      <ul class="flex space-x-4">
        <li><a href="/v" class="hover:text-blue-600">Version</a></li>
      </ul>
    </nav>
    <div class="block md:hidden">
      <button
        id="mobileMenuBtn"
        class="text-gray-600 hover:text-blue-600 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</header>

<div
  id="mobileMenu"
  class="md:hidden hidden"
  style="background-color: #272727;"
>
  <ul class="px-4 py-2">
    <hr />
    <li><a href="/v" class="block py-2 px-4 hover:bg-blue-700">Version</a></li>
  </ul>
</div>

<slot />

<NoteCreate />

<footer style="background-color: #161616;" class="footer text-white py-4">
  <div class="container mx-auto flex justify-center items-center h-full">
    <p class="text-sm">
      HUSH | Made with ❤️ by <a
        class="underline"
        href="https://github.com/sh0von">Sh0von</a
      >
    </p>
  </div>
</footer>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Aldrich&family=Expletus+Sans&family=Federo&family=Victor+Mono:ital,wght@0,100..700;1,100..700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<style>
  .footer {
    background-color: #161616;
    bottom: 0;
    width: 100%;
  }
</style>
