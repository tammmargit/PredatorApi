<template>
  <div class="admin-container">
    <h1>Admin Paneel</h1>
    
    <div class="admin-actions">
      <h2>Lisa uus kurjategija</h2>
      <form @submit.prevent="addCriminal" class="admin-form">
        <div class="form-group">
          <label for="name">Nimi:</label>
          <input v-model="newCriminal.Name" id="name" required>
        </div>
        
        <div class="form-group">
          <label for="gender">Sugu:</label>
          <select v-model="newCriminal.Gender" id="gender" required>
            <option value="Male">Mees</option>
            <option value="Female">Naine</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="offence">Kuritegu:</label>
          <input v-model="newCriminal.Offence" id="offence" required>
        </div>
        
        <div class="form-group">
          <label for="city">Linn:</label>
          <input v-model="newCriminal.City" id="city" required>
        </div>
        
        <div class="form-group">
          <label class="checkbox-label">
            Vangis
            <input 
              type="checkbox" 
              v-model="newCriminal.InPrison"
              class="checkbox-input"
            >
          </label>
        </div>
        
        <div class="form-group">
          <label for="image">Pildi URL:</label>
          <input 
            type="text" 
            id="image" 
            v-model="newCriminal.ImageUrl"
            placeholder="https://näide.com/pilt.jpg"
          >
        </div>
        
        <div class="form-group">
          <label for="imageFile">Lae üles pilt:</label>
          <input 
            type="file" 
            id="imageFile" 
            @change="handleImageUpload"
            accept="image/*"
          >
        </div>
        
        <button type="submit">Lisa kurjategija</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  name: 'AdminPanel',
  setup() {
    const newCriminal = ref({
      Name: '',
      Gender: 'Male',
      Offence: '',
      City: '',
      InPrison: false,
      ImageUrl: ''
    });

    const addCriminal = async () => {
      try {
        await axios.post('http://localhost:8080/criminals', newCriminal.value);
        // Tühjenda vorm pärast õnnestunud lisamist
        newCriminal.value = {
          Name: '',
          Gender: 'Male',
          Offence: '',
          City: '',
          InPrison: false,
          ImageUrl: ''
        };
        alert('Kurjategija edukalt lisatud!');
      } catch (error) {
        console.error('Viga kurjategija lisamisel:', error);
        alert('Viga kurjategija lisamisel!');
      }
    };

    const handleImageUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      // Siin peaks olema loogika pildi üleslaadimiseks serverisse
      // Näiteks:
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post('http://localhost:8080/upload', formData);
        newCriminal.value.ImageUrl = response.data.url;
      } catch (error) {
        console.error('Viga pildi üleslaadimisel:', error);
      }
    };

    return {
      newCriminal,
      addCriminal,
      handleImageUpload
    };
  }
}
</script>

<style scoped>
.admin-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.admin-form {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.checkbox-group {
  margin-top: 20px;
  text-align: left;
}

.checkbox-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  max-width: 100px;
  font-weight: bold;
}

.checkbox-input {
  margin-left: 10px;
  cursor: pointer;
}

.checkbox-text {
  font-weight: bold;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background-color: #0056b3;
}
</style> 