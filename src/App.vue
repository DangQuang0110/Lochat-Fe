<template>
  <div id="app">
    <!-- <nav>
      <router-link to="/">Hello</router-link> |
      <router-link to="/login">Login</router-link>
    </nav> -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}/* nav a { margin: 0 10px; color: #42b983; }
nav a.router-link-active { font-weight: bold; } */
</style>
