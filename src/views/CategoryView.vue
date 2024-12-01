<template>
  <div>
    <h1>Lista de Categorias</h1>
    <table>
      <thead>
        <tr>
          <th>ID da Categoria</th>
          <th>Nome da Categoria</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in categories" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ category }}</td>
          <td>
            <button class="list-products-btn" @click="listProducts(category)">Listar Produtos</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['categories']),
  },
  created() {
    this.$store.dispatch('loadCategories');
  },
  methods: {
    listProducts(category) {
      // Navega para a página de produtos com o parâmetro de categoria
      this.$router.push({
        path: '/products',
        query: { category: category }
      });
    }
  }
};
</script>

<style scoped>
h1 {
  color: #4CAF50;
  text-align: center;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th, td {
  border: 1px solid #ddd;
  text-align: center;
  padding: 8px;
}
th {
  background-color: #4CAF50;
  color: white;
}
.list-products-btn {
  background-color: #9c27b0;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.list-products-btn:hover {
  background-color: #7b1fa2;
}
</style>