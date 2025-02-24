<template>
    <div ref="googleButton"></div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useUserStore } from '@/stores/userStore';
  
  const userStore = useUserStore();
  const googleButton = ref<HTMLElement | null>(null);
  
  // Ajusta con tu clientId real
  const clientId = '729982024532-k7i01sv0o77u3k26hnq12id3bo7oqpba.apps.googleusercontent.com';
  
  function handleCredentialResponse(response: any) {
    console.log('Google ID token:', response.credential);
    userStore.googleLogin(response.credential);
  }
  
  onMounted(() => {
    if (window.google) {
      // 1) Inicializar
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse
      });
  
      // 2) Renderizar el botón
      if (googleButton.value) {
        window.google.accounts.id.renderButton(googleButton.value, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left'
        });
      }
    } else {
      console.warn('Google Identity Services no está cargado.');
    }
  });
  </script>
  