<template>
  <div class="home-container">
    <div class="header">
      <h1>Welcome to the Criminals Database</h1>
      <p>Explore the database of known criminals.</p>
    </div>
    <div class="search-section">
      <input
        v-model="searchQuery"
        placeholder="Search by name"
        class="search-input"
        @input="filterSuggestions"
      />
      <button @click="searchCriminals" class="search-button">Search</button>
    </div>

    <ul v-if="suggestions.length && searchQuery" class="suggestions-list">
      <li
        v-for="suggestion in suggestions"
        :key="suggestion.Id"
        @click="selectSuggestion(suggestion)"
      >
        {{ suggestion.Name }}
      </li>
    </ul>

    <div v-if="searchResults.length" class="results-container">
      <h2>Search Results</h2>
      <ul>
        <li v-for="criminal in searchResults" :key="criminal.Id">
          {{ criminal.Name }} - {{ criminal.Offence }}
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
        suggestions.value = criminals.value.filter(criminal =>
          criminal.Name.toLowerCase().includes(searchQuery.value.toLowerCase())
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
      searchResults.value = criminals.value.filter(criminal =>
        criminal.Name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    };

    return { searchQuery, searchResults, suggestions, filterSuggestions, selectSuggestion, searchCriminals };
  }
}
</script>

<style>
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
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.search-input {
  padding: 10px;
  width: 300px;
  margin-right: 10px;
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

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 5px 0;
  padding: 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.suggestions-list {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-width: 300px;
  margin: 0 auto;
}

.suggestions-list li {
  padding: 10px;
  cursor: pointer;
}

.suggestions-list li:hover {
  background-color: #f0f0f0;
}
</style>