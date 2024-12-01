<template>
    <div>
      <h1>Detalhes do Produto</h1>
      <div v-if="product">
        <h2>{{ product.title }}</h2>
        <p>Categoria: {{ product.category }}</p>
        <p>Preço: R$ {{ product.price.toFixed(2) }}</p>
        <p>Descrição: {{ product.description }}</p>
        <p>Classificação: {{ product.rating?.rate }} ({{ product.rating?.count }} avaliações)</p>
      </div>
      <div v-else>
        <p>Carregando produto...</p>
      </div>
      <button @click="goBack">Voltar</button>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex';
  
  export default {
    computed: {
      ...mapState(['products']),
    },
    data() {
      return {
        product: null, // Inicializa como null
      };
    },
    created() {
      const productId = this.$route.params.id;
      this.loadProduct(productId);
    },
    methods: {
      async loadProduct(productId) {
        // Verifica se o produto já está carregado no Vuex
        this.product = this.products.find(product => product.id === Number(productId));
  
        // Se não encontrar no estado, tenta buscar através da ação do Vuex
        if (!this.product) {
          this.product = await this.$store.dispatch('getProduct', Number(productId));
        }
        
        if (!this.product) {
          console.error('Produto não encontrado');
        }
      },
      goBack() {
        this.$router.push('/products');
      }
    }
  };
  </script>
  
  <style scoped>
  h1 {
    color: #4CAF50;
  }
  </style>