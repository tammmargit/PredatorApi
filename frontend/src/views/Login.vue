<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Logi sisse</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Kasutajanimi:</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required
          >
        </div>
        
        <div class="form-group">
          <label for="password">Parool:</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
          >
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit">Logi sisse</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const error = ref('');

    const handleLogin = async () => {
      try {
        const response = await fetch('http://localhost:8080/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username.value,
            password: password.value
          })
        });

        const data = await response.json();
        
        if (data.success) {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', data.role);
          localStorage.setItem('username', username.value);
          
          router.push('/').then(() => {
            window.location.reload();
          });
        } else {
          error.value = 'Vale kasutajanimi või parool';
        }
      } catch (err) {
        error.value = 'Sisselogimine ebaõnnestus';
      }
    };

    return {
      username,
      password,
      error,
      handleLogin
    };
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.login-box {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
}
</style> 