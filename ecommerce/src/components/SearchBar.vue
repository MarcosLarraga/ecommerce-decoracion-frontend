<template>
    <div class="search-container">
      <div class="search-bar">
        <input
          v-model="searchQuery"
          @keyup.enter="goToProducts"
          type="text"
          placeholder="Buscar producto por nombre..."
        />
        <button class="search-button" @click="goToProducts">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "SearchBar",
    data() {
      return {
        searchQuery: ""
      };
    },
    methods: {
      goToProducts() {
        // Navegamos a la vista de productos con la búsqueda como parámetro
        this.$router.push({
          name: 'Products',        // Debe coincidir con el nombre de la ruta en tu router
          query: { search: this.searchQuery }
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .search-container {
    max-width: 600px;
    margin: 20px;
    margin-top: 60px;
    padding: 10px;
  }
  
  .search-bar {
    display: flex;
    align-items: center;
    position: relative;
  }
  
  .search-bar input {
    width: 100%;
    padding: 10px 15px;
    border: 2px solid #ddd;
    border-radius: 50px 0 0 50px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  
  .search-bar input:focus {
    border-color: #007bff;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.4);
  }
  
  .search-button {
    border: none;
    background-color: #007bff;
    color: #fff;
    padding: 0 20px;
    border-radius: 0 50px 50px 0;
    font-size: 16px;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s ease;
  }
  
  .search-button:hover {
    background-color: #0056b3;
  }
  
  .search-button i {
    font-size: 18px;
  }
  </style>