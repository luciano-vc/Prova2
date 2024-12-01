<template>
  <div class="edit-product-container">
    <h1>Editar Produto</h1>
    
    <div v-if="loading" class="loading-indicator">
      Carregando produto...
    </div>

    <form v-if="product" @submit.prevent="updateProduct" class="product-form">
      <div class="form-group">
        <label for="title">Nome do Produto:</label>
        <input 
          type="text" 
          id="title" 
          v-model.trim="product.title" 
          required
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="category">Categoria:</label>
        <input 
          type="text" 
          id="category" 
          v-model.trim="product.category" 
          required
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="price">Preço:</label>
        <input 
          type="number" 
          id="price" 
          v-model.number="product.price" 
          step="0.01" 
          min="0"
          required
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="description">Descrição:</label>
        <textarea 
          id="description" 
          v-model.trim="product.description"
          required
          class="form-input"
          rows="4"
        ></textarea>
      </div>

      <div class="form-actions">
        <button 
          type="button" 
          @click="$router.push('/products')" 
          class="btn btn-secondary"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="loading"
        >
          {{ loading ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>
    </form>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditProduct',
  
  data() {
    return {
      product: null,
      loading: false,
      error: null
    };
  },

  async created() {
    await this.loadProduct();
  },

  methods: {
    async loadProduct() {
      const productId = this.$route.params.id;
      this.loading = true;
      this.error = null;

      try {
        // Primeiro tenta buscar o produto do estado
        let product = this.$store.state.products.find(p => p.id === Number(productId));
        
        // Se não encontrar no estado, faz a requisição
        if (!product) {
          product = await this.$store.dispatch('getProduct', Number(productId));
        }

        if (product) {
          this.product = { ...product };
        } else {
          this.error = 'Produto não encontrado';
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        this.error = 'Erro ao carregar produto. Por favor, tente novamente.';
      } finally {
        this.loading = false;
      }
    },

    async updateProduct() {
      if (!this.product) return;

      this.loading = true;
      this.error = null;

      try {
        await this.$store.dispatch('updateProduct', {
          ...this.product,
          price: Number(this.product.price),
          id: Number(this.$route.params.id)
        });

        this.$router.push('/products');
      } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        this.error = 'Erro ao atualizar produto. Por favor, tente novamente.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.edit-product-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-secondary {
  background-color: #9e9e9e;
  color: white;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-indicator {
  text-align: center;
  padding: 20px;
}

.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>  