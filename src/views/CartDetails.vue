<template>
    <div>
      <h1>Detalhes do Carrinho</h1>
      <div v-if="cart">
        <h2>Carrinho #{{ cart.id }}</h2>
        <p>Data: {{ cart.date }}</p>
        <p>Usuário ID: {{ cart.userId }}</p>
        <div v-if="cart.products && cart.products.length">
          <h3>Produtos no Carrinho:</h3>
          <div v-for="item in cart.products" :key="item.productId">
            <p>ID do Produto: {{ item.productId }} - Quantidade: {{ item.quantity }}</p>
          </div>
        </div>
      </div>
      <div v-else>
        <p>Carregando carrinho...</p>
      </div>
      <button @click="goBack">Voltar</button>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['carts']),
  },
  data() {
    return {
      cart: null, // Inicializa como null
    };
  },
  created() {
    const cartId = this.$route.params.id;
    this.loadCart(cartId);
  },
  methods: {
    async loadCart(cartId) {
      // Verifica se o carrinho já está carregado no Vuex
      this.cart = this.carts.find(cart => cart.id === Number(cartId));

      // Se não encontrar no estado, tenta buscar através da ação do Vuex
      if (!this.cart) {
        this.cart = await this.$store.dispatch('getCart', Number(cartId));
      }
      
      if (!this.cart) {
        console.error('Carrinho não encontrado');
      }
    },
    goBack() {
      this.$router.push('/cart');
    }
  }
};
</script>

<style scoped>
h1 {
  color: #4CAF50;
}
</style>