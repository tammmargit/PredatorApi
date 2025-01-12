<template>
  
  <div id="app">
    <nav class="navbar">
      <div class="navbar-container">
        <div class="nav-links">
          <router-link class="nav-link" to="/">Avaleht</router-link>
          <router-link class="nav-link" to="/criminals">Kurjategijad</router-link>
          <router-link class="nav-link" to="/about">Meist</router-link>
          <template v-if="isAuthenticated">
            <router-link class="nav-link" to="/admin">Admin Panel</router-link>
            <a href="#" class="nav-link login-btn" @click.prevent="handleLogout">Logi välja</a>
          </template>
          <template v-else>
            <router-link class="nav-link login-btn" to="/login">Logi sisse</router-link>
          </template>
        </div>
      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const router = useRouter();
    const isAuthenticated = ref(false);

    onMounted(() => {
      isAuthenticated.value = !!localStorage.getItem('isAuthenticated');
    });

    const handleLogout = () => {
      localStorage.removeItem('isAuthenticated');
      isAuthenticated.value = false;
      router.push('/');
    };

    return {
      isAuthenticated,
      handleLogout
    };
  }
}
</script>

<style>
.navbar {
  background-color: #aab1b8;
  padding: 15px 0;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
}

.nav-links {
  display: flex;
  justify-content: center;
  gap: 50px;
  align-items: center;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: bold;
  font-size: 18px;
}

.nav-link:hover {
  color: #007bff;
}

.login-btn {
  color: #007bff;
}

.login-btn:hover {
  color: #0056b3;
}
</style>
