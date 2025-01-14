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
  background-color: rgba(26, 26, 26, 0.95);
  padding: 6rem 0;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 2rem;
}

.nav-links {
  display: flex;
  justify-content: center;
  gap: 3rem;
  align-items: center;
}

.nav-link {
  color: white !important;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 50%;
  background-color: #dc3545;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link:hover {
  color: white !important;
  opacity: 0.8;
}

.login-btn {
  background-color: #dc3545;
  color: white !important;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
}

.login-btn:hover {
  background-color: #c82333;
  color: white !important;
}

.login-btn::after {
  display: none;
}

.router-link-active {
  color: white !important;
}

.router-link-active::after {
  width: 100%;
}

@media (max-width: 768px) {
  .nav-links {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .nav-link {
    font-size: 1rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
