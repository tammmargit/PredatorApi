<template>
  <div class="criminal-detail">
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h2>{{ criminal.Name }}</h2>
        </div>
        <div class="card-body">
          <div v-if="editing && isAuthenticated" class="edit-form">
            <form @submit.prevent="updateCriminal">
              <div class="mb-3">
                <label class="form-label">Nimi:</label>
                <input type="text" class="form-control" v-model="editedCriminal.Name">
              </div>
              <div class="mb-3">
                <label class="form-label">Sugu:</label>
                <select class="form-control" v-model="editedCriminal.Gender">
                  <option value="Male">Mees</option>
                  <option value="Female">Naine</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Kuritegu:</label>
                <input type="text" class="form-control" v-model="editedCriminal.Offence">
              </div>
              <div class="mb-3">
                <label class="form-label">Linn:</label>
                <input type="text" class="form-control" v-model="editedCriminal.City">
              </div>
              <div class="mb-3">
                <label class="form-check-label">
                  <input type="checkbox" class="form-check-input" v-model="editedCriminal.InPrison">
                  Vangis
                </label>
              </div>
              <button type="submit" class="btn btn-success me-2">Salvesta</button>
              <button type="button" class="btn btn-secondary" @click="cancelEdit">Tühista</button>
            </form>
          </div>
          <div v-else class="info-grid">
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
          <div v-if="isAuthenticated" class="action-buttons mt-4">
            <button v-if="!editing" @click="startEditing" class="btn btn-warning me-2">
              Muuda
            </button>
            <button v-if="!editing" @click="deleteCriminal" class="btn btn-danger me-2">
              Kustuta
            </button>
          </div>
          <div class="card-body history-section" v-if="isAuthenticated">
            <h3>Muudatuste ajalugu</h3>
            <div class="history-list">
              <div v-for="change in criminalHistory" 
                   :key="change.id" 
                   class="history-item">
                <div class="change-info">
                  <span class="action-type" :class="change.action_type">
                    {{ getActionLabel(change.action_type) }}
                  </span>
                  <span class="user-info">
                    {{ change.user.name }}
                  </span>
                  <span class="timestamp">
                    {{ formatDate(change.created_at) }}
                  </span>
                </div>
              </div>
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
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { et } from 'date-fns/locale';

export default {
  name: 'CriminalDetail',
  setup() {
    const criminal = ref({});
    const editedCriminal = ref({});
    const editing = ref(false);
    const isAuthenticated = ref(false);
    const router = useRouter();
    const criminalHistory = ref([]);

    onMounted(async () => {
      try {
        isAuthenticated.value = !!localStorage.getItem('isAuthenticated');
        
        const id = window.location.pathname.split('/').pop();
        const response = await axios.get(`http://localhost:8080/criminals/${id}`);
        criminal.value = response.data;
        await fetchHistory(id);
      } catch (error) {
        console.error('Error fetching criminal details:', error);
      }
    });

    const startEditing = () => {
      if (!isAuthenticated.value) {
        alert('Palun logi sisse, et muudatusi teha.');
        return;
      }
      editedCriminal.value = { ...criminal.value };
      editing.value = true;
    };

    const cancelEdit = () => {
      editing.value = false;
    };

    const updateCriminal = async () => {
      if (!isAuthenticated.value) {
        alert('Palun logi sisse, et muudatusi teha.');
        return;
      }
      try {
        const response = await axios.put(
          `http://localhost:8080/criminals/${criminal.value.Id}`,
          editedCriminal.value
        );
        criminal.value = response.data;
        editing.value = false;
      } catch (error) {
        console.error('Error updating criminal:', error);
      }
    };

    const deleteCriminal = async () => {
      if (!isAuthenticated.value) {
        alert('Palun logi sisse, et kustutada.');
        return;
      }
      if (confirm('Kas oled kindel, et soovid kustutada?')) {
        try {
          await axios.delete(`http://localhost:8080/criminals/${criminal.value.Id}`);
          router.push('/criminals');
        } catch (error) {
          console.error('Error deleting criminal:', error);
        }
      }
    };

    const fetchHistory = async (id) => {
      try {
        const response = await axios.get(`http://localhost:8080/criminals/${id}/history`);
        criminalHistory.value = response.data;
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    const getActionLabel = (action) => {
      const labels = {
        created: 'Lisatud',
        updated: 'Muudetud',
        deleted: 'Kustutatud'
      };
      return labels[action] || action;
    };

    const formatDate = (date) => {
      return format(new Date(date), 'dd.MM.yyyy HH:mm', { locale: et });
    };

    return {
      criminal,
      editedCriminal,
      editing,
      isAuthenticated,
      startEditing,
      cancelEdit,
      updateCriminal,
      deleteCriminal,
      criminalHistory,
      getActionLabel,
      formatDate
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

.history-section {
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.history-list {
  margin-top: 1rem;
}

.history-item {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.change-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.action-type {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.action-type.created {
  background-color: #28a745;
  color: white;
}

.action-type.updated {
  background-color: #ffc107;
  color: black;
}

.action-type.deleted {
  background-color: #dc3545;
  color: white;
}

.user-info {
  color: #666;
  font-weight: 500;
}

.timestamp {
  color: #999;
  font-size: 0.875rem;
}
</style>