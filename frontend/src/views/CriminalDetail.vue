<template>
  <div class="criminal-detail">
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h2>{{ criminal.Name }}</h2>
        </div>
        <div class="card-body">
          <div class="info-grid">
            <div class="info-item">
              <label>Sugu:</label>
              <span>{{ criminal.Gender }}</span>
            </div>
            <div class="info-item">
              <label>Kuritegu:</label>
              <span>{{ criminal.Offence }}</span>
            </div>
            <div class="info-item">
              <label>Linn:</label>
              <span>{{ criminal.City }}</span>
            </div>
            <div class="info-item">
              <label>Staatus:</label>
              <span :class="{ 'status-in-prison': criminal.InPrison }">
                {{ criminal.InPrison ? 'Vangis' : 'Vabaduses' }}
              </span>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <router-link to="/criminals" class="btn btn-secondary">
            Tagasi nimekirja
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'CriminalDetail',
  setup() {
    const criminal = ref({});

    onMounted(async () => {
      try {
        const id = window.location.pathname.split('/').pop();
        const response = await axios.get(`http://localhost:8080/criminals/${id}`);
        criminal.value = response.data;
      } catch (error) {
        console.error('Error fetching criminal details:', error);
      }
    });

    return {
      criminal
    };
  }
}
</script>

<style scoped>
.criminal-detail {
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: #f8f9fa;
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
  border-radius: 8px 8px 0 0;
}

.card-header h2 {
  margin: 0;
  color: #333;
}

.card-body {
  padding: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-weight: bold;
  color: #666;
  font-size: 0.9rem;
}

.info-item span {
  font-size: 1.1rem;
  color: #333;
}

.status-in-prison {
  color: #dc3545;
  font-weight: bold;
}

.card-footer {
  padding: 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
  border-radius: 0 0 8px 8px;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  display: inline-block;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>