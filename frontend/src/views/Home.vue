<template>
  <div class="home-container">
    <div class="hero-section">
      <h1>Aita hoida Eestit turvalisena!</h1>
      <p class="subtitle">Sinu teavitus võib olla määrava tähtsusega</p>
      
      <div class="info-section">
        <p class="description">
          Kui märkad kahtlast tegevust või omad infot kuritegevuse kohta, 
          anna meile teada. Iga viide on oluline.
        </p>
      </div>

      <div class="cta-section">
        <router-link to="/about" class="cta-button">
          TEAVITA MEID
        </router-link>
      </div>
    </div>

    <div class="search-section">
      <h2>Otsi andmebaasist</h2>
      <div class="search-container">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Otsi nime või linna järgi..."
            @input="handleSearch"
          >
        </div>
        <div class="filter-box">
          <select v-model="selectedCity" @change="handleSearch">
            <option value="">Kõik linnad</option>
            <option v-for="city in uniqueCities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="filteredCriminals.length > 0" class="results-container">
        <div v-for="criminal in filteredCriminals" 
             :key="criminal.Id" 
             class="result-card"
             @click="goToDetail(criminal.Id)">
          <h3>{{ criminal.Name }}</h3>
          <p>{{ criminal.City }}</p>
          <span :class="{ 'status-in-prison': criminal.InPrison, 'status-free': !criminal.InPrison }">
            {{ criminal.InPrison ? 'Vangis' : 'Vabadusel' }}
          </span>
        </div>
      </div>
      <p v-else-if="searchQuery || selectedCity" class="no-results">
        Tulemusi ei leitud
      </p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import axios from 'axios';

export default {
  name: 'Home',
  setup() {
    const searchQuery = ref('');
    const selectedCity = ref('');
    const criminals = ref([]);

    const uniqueCities = computed(() => {
      return [...new Set(criminals.value.map(c => c.City))];
    });

    const filteredCriminals = computed(() => {
      return criminals.value.filter(criminal => {
        const matchesSearch = criminal.Name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                            criminal.City.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesCity = !selectedCity.value || criminal.City === selectedCity.value;
        return matchesSearch && matchesCity;
      });
    });

    const fetchCriminals = async () => {
      try {
        const response = await axios.get('http://localhost:8080/criminals');
        criminals.value = response.data;
      } catch (error) {
        console.error('Error fetching criminals:', error);
      }
    };

    fetchCriminals();

    return {
      searchQuery,
      selectedCity,
      uniqueCities,
      filteredCriminals,
      criminals
    };
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
}

.hero-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: white;
  font-weight: bold;
}

.subtitle {
  font-size: 1.8rem;
  color: #dc3545;
  margin-bottom: 3rem;
}

.info-section {
  margin-bottom: 3rem;
}

.description {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #cccccc;
}

.cta-button {
  display: inline-block;
  padding: 1.5rem 4rem;
  background-color: #dc3545;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.4rem;
  font-weight: bold;
  transition: transform 0.3s, background-color 0.3s;
  border: none;
}

.cta-button:hover {
  background-color: #c82333;
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.4rem;
  }
  
  .description {
    font-size: 1.1rem;
  }
  
  .cta-button {
    padding: 1.2rem 3rem;
    font-size: 1.2rem;
  }
}

.search-section {
  padding: 4rem 2rem;
  background: white;
  min-height: 100vh;
}

.search-section h2 {
  text-align: center;
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-box {
  flex: 2;
}

.filter-box {
  flex: 1;
}

input, select {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.results-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.result-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.result-card:hover {
  transform: translateY(-4px);
}

.result-card h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.result-card p {
  color: #666;
  margin: 0 0 1rem 0;
}

.status-in-prison {
  background-color: #dc3545;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.status-free {
  background-color: #28a745;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.no-results {
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
  }

  .search-box, .filter-box {
    width: 100%;
  }
}
</style>