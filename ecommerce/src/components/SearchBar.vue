<template>
    <div class="search-container">
      <div class="search-bar">
        <input
          v-model="searchQuery"
          @keyup.enter="goToProducts"
          type="text"
          placeholder="Buscar producto"
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
        // Navega a la vista de productos con la búsqueda como parámetro
        this.$router.push({
          name: "Products",
          query: { search: this.searchQuery }
        });
      }
    }
  };
  </script>
  
  <style scoped>
  /* Mobile-first: estilos base para móviles */
  .search-bar {
    display: flex;
    align-items: center;
    position: relative;
  }
  
  .search-bar input {
    width: 150px; /* Ancho por defecto para móviles */
    padding: 10px 15px;
    border: 2px solid #06AA51; /* Contorno con el color solicitado */
    border-radius: 50px 0 0 50px;
    font-size: 16px;
    outline: none;
    margin-right: 81px !important;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 0 8px rgba(6, 170, 81, 0.4); /* Efecto luz en el estado por defecto */
  }
  
  .search-bar input:focus {
    border-color: #06AA51;
    box-shadow: 0 0 8px rgba(6, 170, 81, 0.4);
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
  
  /* Para tablet: entre 768px */
  @media (min-width: 768px) {
    .search-bar input {
      width: 250px;
    }
  }
  
  /* Para laptop 1024px */
  @media (min-width: 1024px) {
    .search-bar input {
      width: 150px;
      margin-left: 75px;
      font-size: 14px;
    }
  }
  </style>
  