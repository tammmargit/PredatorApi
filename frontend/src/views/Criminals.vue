<template>
  <div>
    <h1>Criminals List</h1>
    <div class="filter-section">
      <label for="genderFilter">Filter by Gender:</label>
      <select id="genderFilter" v-model="selectedGender" @change="filterByGender">
        <option value="">All</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    </div>
    <table class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>Name</th>
          <th>Crime</th>
          <th>Gender</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="criminal in filteredCriminals" :key="criminal.Id">
          <td>
            <router-link :to="{ name: 'CriminalDetail', params: { id: criminal.Id }}">
              {{ criminal.Name }}
            </router-link>
          </td>
          <td>{{ criminal.Offence }}</td>
          <td>{{ criminal.Gender }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'Criminals',
  setup() {
    const criminals = ref([]);
    const selectedGender = ref('');

    onMounted(async () => {
      try {
        const response = await axios.get('http://localhost:8080/criminals');
        criminals.value = response.data;
      } catch (error) {
        console.error('Error fetching criminals:', error);
      }
    });

    const filteredCriminals = computed(() => {
      if (!selectedGender.value) {
        return criminals.value;
      }
      return criminals.value.filter(criminal => criminal.Gender === selectedGender.value);
    });

    const filterByGender = () => {
      // This function is triggered when the gender filter changes
    };

    return { criminals, selectedGender, filteredCriminals, filterByGender };
  }
}
</script>

<style>
.filter-section {
  margin-bottom: 20px;
}

select {
  margin-left: 10px;
  padding: 5px;
}
</style>