<template>
  <div>
    <nav class="navbar">
      <div class="navbar-container">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/criminals" class="nav-link">Criminals</router-link>
        <router-link to="/about" class="nav-link">About</router-link>
        <router-link to="/contact" class="nav-link">Contact</router-link>
        
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
.navbar {
  background-color: #aab1b8;
  padding: 10px 20px;
}

.navbar-container {
  display: flex;
  justify-content: center;
}

.nav-link {
  margin: 0 15px;
  color: #ffffff;
  text-decoration: none;
  font-weight: bold;
}

.nav-link:hover {
  color: #007bff;
}
</style>
