<script>
    export let avatarSrc;
    export let username;
    export let message;
    export let postInfo;
  </script>
  
  <div class="note-card w-full pixel rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300">
    <div class="flex items-center mb-2">
      <img src={avatarSrc} class="w-8 h-8 rounded-full mr-2" alt="Avatar" />
      <span class="font-semibold text-white">{username}</span>
    </div>
    <hr class="py-2" />
    <p class="text-white mb-4">{message}</p>
    <small class="text-white">{postInfo}</small>
  </div>
  