<script>
  export let version = "v1.0";
</script>

<main class="px-8 py-4">
  <section class="mb-8">
    <h2 class="text-2xl font-bold mb-2 text-blue-700">HUSH</h2>
    <hr />
    <p class="text-lg text-justify">
      HUSH fosters a collaborative environment where individuals freely exchange
      anonymous thoughts and messages. Whether it's introspective reflections or
      casual musings, HUSH offers a platform for unrestricted expression, devoid
      of any identity constraints. Join our inclusive community and add your
      unique voice to our collection of anonymous insights.
    </p>
    <p class="py-4 text-2xl text-blue-700">Technology Used:</p>
    <hr />
    <ul class="list-disc px-8">
      <li>SvelteKit</li>
      <li>Node.js</li>
      <li>Express</li>
      <li>MongoDB</li>
    </ul>
  </section>

  <section class="mb-8 py-4">
    <h2 class="text-2xl font-bold mb-2 text-blue-700">Current Version</h2>
    <hr />
    <p class="text-lg">
      The current version of the project is: <strong class="text-blue-700"
        >{version}</strong
      >
    </p>
  </section>
  <section class="mb-8 py-4">
    <h2 class="text-2xl font-bold mb-2 text-blue-700">Version Details</h2>
    <hr />
    <h4 class="text-lg font-bold mb-2 text-blue-700">v1.0</h4>
    <hr />
    <ul class="list-decimal px-8">
      <li>
        Share messages anonymously, with the option to remain nameless as the
        system generates a random identity for you.
      </li>
      <li>
        Personalize your profile with a unique avatar fetched from
        https://api.multiavatar.com/, customized to reflect your chosen name.
      </li>
      <li>
        Easily browse through messages with a convenient "Load More" button to
        unveil additional content.
      </li>
      <li>
        Toast notifications to confirm successful message posting, with an auto
        close feature after 5 seconds.
      </li>
      <li>
        A "Like" button to express appreciation for messages that resonate with you.
        </li>
      <li>
        Admin features to manage and moderate the platform, including the ability to
        delete messages.
      </li>
    </ul>
  </section>

  <section class="mb-8 py-4">
    <h2 class="text-2xl font-bold mb-2 text-blue-700">TODO</h2>
    <hr />
    <ul class="list-decimal px-8">
      <li>
        [DONE] Introduce a "Like" button to express appreciation for messages that
        resonate with you.
      </li>
      <li>
        [DONE] Implement admin features to manage and moderate the platform, including
        the ability to delete messages.
      </li>
    </ul>
  </section>
</main>
