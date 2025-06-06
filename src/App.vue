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
#app { text-align: center; margin-top: 40px; }
nav a { margin: 0 10px; color: #42b983; }
nav a.router-link-active { font-weight: bold; }
</style>
