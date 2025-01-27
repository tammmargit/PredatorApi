<template>
  <div class="user-management">
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h2>Kasutajate haldus</h2>
        </div>
        <div class="card-body">
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nimi</th>
                <th>Email</th>
                <th>Roll</th>
                <th>Tegevused</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>
                  <button class="btn btn-sm btn-primary me-2" @click="editUser(user)">
                    Muuda
                  </button>
                  <button class="btn btn-sm btn-danger" @click="deleteUser(user.id)">
                    Kustuta
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal kasutaja muutmiseks -->
    <div class="modal" tabindex="-1" ref="editModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Muuda kasutajat</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser">
              <div class="mb-3">
                <label class="form-label">Nimi</label>
                <input type="text" class="form-control" v-model="editingUser.name">
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" v-model="editingUser.email">
              </div>
              <div class="mb-3">
                <label class="form-label">Roll</label>
                <select class="form-select" v-model="editingUser.role">
                  <option value="admin">Admin</option>
                  <option value="user">Kasutaja</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">Salvesta</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Modal from 'bootstrap/js/dist/modal';

export default {
  setup() {
    const users = ref([]);
    const editingUser = ref({});
    const editModal = ref(null);
    let modalInstance = null;

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/users');
        users.value = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const editUser = (user) => {
      editingUser.value = { ...user };
      modalInstance.show();
    };

    const closeModal = () => {
      modalInstance.hide();
    };

    const saveUser = async () => {
      try {
        await axios.put(`http://localhost:8080/users/${editingUser.value.id}`, editingUser.value);
        await fetchUsers();
        closeModal();
      } catch (error) {
        console.error('Error saving user:', error);
      }
    };

    const deleteUser = async (userId) => {
      if (confirm('Kas oled kindel, et soovid kasutaja kustutada?')) {
        try {
          await axios.delete(`http://localhost:8080/users/${userId}`);
          await fetchUsers();
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      }
    };

    onMounted(() => {
      fetchUsers();
      modalInstance = new Modal(editModal.value);
    });

    return {
      users,
      editingUser,
      editModal,
      editUser,
      closeModal,
      saveUser,
      deleteUser
    };
  }
};
</script>

<style scoped>
.user-management {
  padding: 2rem 0;
}

.card {
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.card-header {
  background-color: #f8f9fa;
}

.table {
  margin-bottom: 0;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style> 