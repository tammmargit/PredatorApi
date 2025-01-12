<template>
  <div class="home-container">
    <div class="header">
      <h1>Kurjategijate andmebaas</h1>
      <p>Otsi kurjategijaid nime, asukoha või kuriteo järgi</p>
    </div>
    
    <div class="search-section">
      <div class="search-group">
        <input
          v-model="searchQuery"
          placeholder="Sisesta otsingusõna..."
          class="search-input"
          @input="filterSuggestions"
        />
      </div>

      <button @click="searchCriminals" class="search-button">Otsi</button>
    </div>

    <ul v-if="suggestions.length" class="suggestions-list">
      <li
        v-for="suggestion in suggestions"
        :key="suggestion.Id"
        @click="selectSuggestion(suggestion)"
      >
        {{ suggestion.Name }} - {{ suggestion.City }} - {{ suggestion.Offence }}
      </li>
    </ul>

    <div v-if="searchResults.length" class="results-container">
      <h2>Otsingu tulemused</h2>
      <ul>
        <li v-for="criminal in searchResults" :key="criminal.Id" class="result-item">
          <div class="criminal-info">
            <strong>{{ criminal.Name }}</strong>
            <span class="location">{{ criminal.City }}</span>
            <span class="offence">{{ criminal.Offence }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'Home',
  setup() {
    const searchQuery = ref('');
    const searchResults = ref([]);
    const suggestions = ref([]);
    const criminals = ref([]);

    onMounted(async () => {
      try {
        const response = await axios.get('http://localhost:8080/criminals');
        criminals.value = response.data;
      } catch (error) {
        console.error('Error fetching criminals:', error);
      }
    });

    const filterSuggestions = () => {
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        suggestions.value = criminals.value.filter(criminal =>
          criminal.Name.toLowerCase().includes(query) ||
          criminal.City.toLowerCase().includes(query) ||
          criminal.Offence.toLowerCase().includes(query)
        );
      } else {
        suggestions.value = [];
      }
    };

    const selectSuggestion = (suggestion) => {
      searchQuery.value = suggestion.Name;
      searchResults.value = [suggestion];
      suggestions.value = [];
    };

    const searchCriminals = () => {
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        searchResults.value = criminals.value.filter(criminal =>
          criminal.Name.toLowerCase().includes(query) ||
          criminal.City.toLowerCase().includes(query) ||
          criminal.Offence.toLowerCase().includes(query)
        );
      } else {
        searchResults.value = [];
      }
    };

    return { 
      searchQuery, 
      searchResults, 
      suggestions, 
      filterSuggestions, 
      selectSuggestion, 
      searchCriminals 
    };
  }
}
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 50px 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.search-section {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.search-group {
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #0056b3;
}

.results-container {
  margin-top: 30px;
}

.result-item {
  margin: 10px 0;
  padding: 15px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.criminal-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.location {
  color: #666;
  margin: 0 10px;
}

.offence {
  color: #dc3545;
}

.suggestions-list {
  list-style-type: none;
  padding: 0;
  margin: 10px auto;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-width: 600px;
}

.suggestions-list li {
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}

.suggestions-list li:hover {
  background-color: #f0f0f0;
}
</style>