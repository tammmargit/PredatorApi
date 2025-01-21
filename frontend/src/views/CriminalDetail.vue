<template>
  <div class="criminal-detail">
    <div class="container">
      <div class="card">
        <div class="card-image" v-if="criminal.ImageUrl">
          <img :src="'http://localhost:8080/' + criminal.ImageUrl" alt="Kurjategija pilt">
        </div>
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
                <label class="form-label">Uus pilt:</label>
                <input 
                  type="file" 
                  class="form-control" 
                  @change="handleFileUpload"
                  accept="image/*"
                >
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

export default {
  name: 'CriminalDetail',
  setup() {
    const criminal = ref({});
    const editedCriminal = ref({});
    const editing = ref(false);
    const isAuthenticated = ref(false);
    const selectedFile = ref(null);
    const router = useRouter();

    onMounted(async () => {
      try {
        isAuthenticated.value = !!localStorage.getItem('isAuthenticated');
        
        const id = window.location.pathname.split('/').pop();
        const response = await axios.get(`http://localhost:8080/criminals/${id}`);
        criminal.value = response.data;
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

    const handleFileUpload = (event) => {
      selectedFile.value = event.target.files[0];
    };

    const updateCriminal = async () => {
      if (!isAuthenticated.value) {
        alert('Palun logi sisse, et muudatusi teha.');
        return;
      }
      try {
        const formData = new FormData();
        if (selectedFile.value) {
          formData.append('image', selectedFile.value);
        }
        Object.keys(editedCriminal.value).forEach(key => {
          formData.append(key, editedCriminal.value[key]);
        });

        const response = await axios.put(
          `http://localhost:8080/criminals/${criminal.value.Id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        criminal.value = response.data;
        editing.value = false;
        selectedFile.value = null;
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

    return {
      criminal,
      editedCriminal,
      editing,
      isAuthenticated,
      selectedFile,
      handleFileUpload,
      startEditing,
      cancelEdit,
      updateCriminal,
      deleteCriminal
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

.card-image {
  width: 100%;
  max-height: 300px;
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
</style>