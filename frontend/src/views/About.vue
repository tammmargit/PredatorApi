<template>
  <div class="about-container">
    <div class="info-section">
      <h1>Meist</h1>
      
      <div class="trust-points">
        <div class="trust-item">
          <i class="fas fa-user-shield"></i>
          <h3>Sinu anonüümsus on garanteeritud</h3>
          <p>Kõik teavitused käsitletakse täielikus konfidentsiaalsuses</p>
        </div>
        <div class="trust-item">
          <i class="fas fa-check-circle"></i>
          <h3>Põhjalik kontroll</h3>
          <p>Iga vihjet kontrollitakse detailselt, kaasates kõik turvakaamerad ja kaasaegsed tehnoloogiad</p>
        </div>
        <div class="trust-item">
          <i class="fas fa-clock"></i>
          <h3>24/7 vihjete vastuvõtt</h3>
          <p>Oleme valmis tegutsema ööpäevaringselt</p>
        </div>
      </div>

      <div class="impact-section">
        <h2>Meie mõju</h2>
        <p>Igal aastal aitavad kodanike vihjed lahendada üle 100 kuriteo. Tänu teie abile muutub Eesti turvalisemaks.</p>
      </div>
    </div>

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
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.info-section {
  margin-bottom: 60px;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
}

.trust-points {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 3rem 0;
}

.trust-item {
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.trust-item:hover {
  transform: translateY(-5px);
}

.trust-item i {
  font-size: 2.5rem;
  color: #dc3545;
  margin-bottom: 1rem;
}

.trust-item h3 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.trust-item p {
  color: #666;
  line-height: 1.6;
}

.impact-section {
  background: #dc3545;
  color: white;
  padding: 3rem;
  border-radius: 8px;
  margin: 3rem 0;
}

.impact-section h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.impact-section p {
  font-size: 1.2rem;
  line-height: 1.6;
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

@media (max-width: 768px) {
  .trust-points {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .about-container {
    padding: 20px;
  }
}
</style>
