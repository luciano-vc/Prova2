<template>
  <div class="create-product">
    <h1>Criar Produto</h1>
    <form @submit.prevent="createProduct">
      <div class="form-group">
        <label for="title">Nome:</label>
        <input type="text" id="title" v-model="product.title" required />
      </div>

      <div class="form-group">
        <label for="category">Categoria:</label>
        <select id="category" v-model="product.category" required>
          <option value="">Selecione uma categoria</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="price">Preço:</label>
        <input type="number" id="price" v-model="product.price" step="0.01" required />
      </div>

      <div class="form-group">
        <label for="description">Descrição:</label>
        <textarea id="description" v-model="product.description" required></textarea>
      </div>

      <div class="form-group">
        <label for="image">URL da Imagem:</label>
        <input type="url" id="image" v-model="product.image" />
      </div>

      <div class="button-group">
        <button type="submit" class="submit-button">Criar Produto</button>
        <button type="button" @click="cancelCreate" class="cancel-button">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CreateProduct',
  data() {
    return {
      product: {
        title: '',
        category: '',
        price: 0,
        description: '',
        image: ''
      }
    };
  },
  computed: {
    ...mapState(['categories'])
  },
  created() {
    // Carrega as categorias quando o componente é criado
    this.$store.dispatch('loadCategories');
  },
  methods: {
    async createProduct() {
      try {
        await this.$store.dispatch('createProduct', this.product);
        alert('Produto criado com sucesso!');
        this.$router.push('/');
      } catch (error) {
        alert('Erro ao criar produto: ' + error.message);
      }
    },
    cancelCreate() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.create-product {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, select, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea {
  height: 100px;
  resize: vertical;
}

.button-group {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.submit-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #45a049;
}

.cancel-button {
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #da190b;
}
</style>