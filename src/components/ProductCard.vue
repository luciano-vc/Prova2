<template>
    <div class="product-card">
      <h2>{{ product.name }}</h2>
      <p>Preço: R$ {{ product.price }}</p>
      <button @click="addToCart">Adicionar ao Carrinho</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProductCard',
    props: {
      product: Object,
    },
    methods: {
      addToCart() {
        // Lógica para adicionar ao carrinho
        console.log(`Adicionado ${this.product.name} ao carrinho`);
      },
    },
  };
  </script>
  
  <style scoped>
  .product-card {
    border: 1px solid #ddd;
    padding: 10px;
    margin: 10px;
  }
  </style>