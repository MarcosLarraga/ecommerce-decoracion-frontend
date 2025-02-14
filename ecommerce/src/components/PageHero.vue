<template>
    <div class="page-hero">
      <img :src="imageSrc" alt="Hero Image" class="hero-image" />
      <h1 class="hero-title">{{ title }}</h1>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  defineProps({
    title: {
      type: String,
      required: true,
    },
    imageSrc: {
      type: String,
      required: true,
    },
  });
  </script>
  
  <style scoped>
  .page-hero {
    position: relative;
    width: 100%;
    height: 250px; 
    overflow: hidden;
  }
  
  .hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.7);
  }
  
  .hero-title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    font-weight: bold;
    color: white;
    text-align: center;
  }
  </style>
  