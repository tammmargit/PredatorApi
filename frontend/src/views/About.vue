<template>
  <div class="about-container">
    <h1>Meist</h1>
    <p>Oled tunnistaja mingile väärteole, tahad teavitada probleemist, oled hot ja queen</p>
    
    <div class="report-form">
      <h2>Teavita meid väärteost</h2>
      <form @submit.prevent="submitReport">
        <div class="form-group">
          <label for="name">Nimi:</label>
          <input 
            type="text" 
            id="name" 
            v-model="formData.name" 
            required
          >
        </div>

        <div class="form-group">
          <label for="email">E-post:</label>
          <input 
            type="email" 
            id="email" 
            v-model="formData.email" 
            required
          >
        </div>

        <div class="form-group">
          <label for="message">Teade:</label>
          <textarea 
            id="message" 
            v-model="formData.message" 
            rows="4" 
            required
          ></textarea>
        </div>

        <button type="submit">Saada teade</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'About',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        message: ''
      },
      submitStatus: null
    }
  },
  methods: {
    async submitReport() {
      try {
        const response = await axios.post('http://localhost:8080/report', this.formData);
        this.submitStatus = 'success';
        this.formData = { name: '', email: '', message: '' };
      } catch (error) {
        console.error('Error submitting report:', error);
        this.submitStatus = 'error';
      }
    }
  }
}
</script>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.report-form {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
