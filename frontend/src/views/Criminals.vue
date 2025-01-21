<template>
  <div class="criminals-list">
    <div class="container">
      <h2 class="page-title">Kurjategijate Register</h2>
      
      <div class="cards-grid">
        <div v-for="criminal in criminals" 
             :key="criminal.Id" 
             class="criminal-card"
             @click="goToDetail(criminal.Id)">
          <div class="card-image" v-if="criminal.ImageUrl">
            <img :src="'http://localhost:8080/' + criminal.ImageUrl" :alt="criminal.Name">
          </div>
          
          <div class="card-header">
            <h3>{{ criminal.Name }}</h3>
            <span :class="{ 'status-in-prison': criminal.InPrison, 'status-free': !criminal.InPrison }">
              {{ criminal.InPrison ? 'Vangis' : 'Vabaduses' }}
            </span>
          </div>
          <div class="card-content">
            <div class="info-row">
              <span class="label">Sugu:</span>
              <span>{{ criminal.Gender }}</span>
            </div>
            <div class="info-row">
              <span class="label">Kuritegu:</span>
              <span>{{ criminal.Offence }}</span>
            </div>
            <div class="info-row">
              <span class="label">Linn:</span>
              <span>{{ criminal.City }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  name: 'CriminalsList',
  setup() {
    const criminals = ref([]);
    const router = useRouter();

    onMounted(async () => {
      try {
        const response = await axios.get('http://localhost:8080/criminals');
        criminals.value = response.data;
      } catch (error) {
        console.error('Error fetching criminals:', error);
      }
    });

    const goToDetail = (id) => {
      router.push(`/criminals/${id}`);
    };

    return {
      criminals,
      goToDetail
    };
  }
}
</script>

<style scoped>
.criminals-list {
  padding: 2rem 0;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-title {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 600;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.criminal-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  overflow: hidden;
}

.criminal-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  background: #f8f9fa;
  padding: 1.25rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.card-content {
  padding: 1.25rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  color: #666;
  font-weight: 500;
}

.status-in-prison {
  background-color: #dc3545;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-free {
  background-color: #28a745;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-image.no-image {
  background-color: #e9ecef;
  color: #6c757d;
  font-style: italic;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 2rem;
  }
}
</style> 