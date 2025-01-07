<template>
    <div v-if="criminal">
      <h1>{{ criminal.Name }}</h1>
      <p><strong>ID:</strong> {{ criminal.Id }}</p>
      <p><strong>Crime:</strong> {{ criminal.Offence }}</p>
      <p><strong>Gender:</strong> {{ criminal.Gender }}</p>
      <p><strong>In Prison:</strong> {{ criminal.InPrison ? 'Yes' : 'No' }}</p>
      <p><strong>City:</strong> {{ criminal.City }}</p>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRoute } from 'vue-router';
  
  export default {
    name: 'CriminalDetail',
    setup() {
      const route = useRoute();
      const criminal = ref(null);
  
      onMounted(async () => {
        try {
          const response = await axios.get(`http://localhost:8080/criminals/${route.params.id}`);
          criminal.value = response.data;
        } catch (error) {
          console.error('Error fetching criminal details:', error);
        }
      });
  
      return { criminal };
    }
  }
  </script>