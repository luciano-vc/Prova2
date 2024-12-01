<template>
  <div>
    <h1>Lista de Carrinhos</h1>

    <div class="actions-container">
      <button @click="redirectToCreateCart" class="add-cart-button">
        <i class="fas fa-plus"></i> Adicionar Carrinho
      </button>

      <div class="items-per-page">
        <label>Itens por página:</label>
        <select v-model="pagination.itemsPerPage">
          <option v-for="n in [5, 10, 20, 50]" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th v-for="column in sortableColumns" :key="column.key" @click="sort(column.key)" class="sortable">
            {{ column.label }}
            <i :class="getSortIcon(column.key)"></i>
          </th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cart in paginatedCarts" :key="cart.id">
          <td>{{ cart.id }}</td>
          <td>{{ cart.userId }}</td>
          <td>{{ new Date(cart.date).toLocaleDateString() }}</td>
          <td>
            <ul class="products-list">
              <li v-for="product in cart.products" :key="product.productId">
                {{ getProductName(product.productId) }} - Quantidade: {{ product.quantity }}
              </li>
            </ul>
          </td>
          <td class="actions">
            <button v-for="action in actions" :key="action.type" 
                    :class="['action-button', action.type]"
                    @click="action.handler(cart.id)">
              <i :class="action.icon"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button :disabled="pagination.currentPage === 1" 
              @click="pagination.currentPage--" 
              class="pagination-button">
        <i class="fas fa-chevron-left"></i>
      </button>

      <span class="page-info">
        Página {{ pagination.currentPage }} de {{ totalPages }}
      </span>

      <button :disabled="pagination.currentPage === totalPages" 
              @click="pagination.currentPage++" 
              class="pagination-button">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'CartView',
  data() {
    return {
      pagination: {
        currentPage: 1,
        itemsPerPage: 10
      },
      sortConfig: {
        key: null,
        direction: 'asc'
      },
      sortableColumns: [
        { key: 'id', label: 'ID' },
        { key: 'userId', label: 'ID do Usuário' },
        { key: 'date', label: 'Data' },
        { key: 'products', label: 'Produtos' }
      ],
      actions: [
        {
          type: 'view',
          icon: 'fas fa-eye',
          handler: this.viewDetails
        },
        {
          type: 'edit',
          icon: 'fas fa-edit',
          handler: this.editCart
        },
        {
          type: 'delete',
          icon: 'fas fa-trash',
          handler: this.confirmDelete
        }
      ],
      loading: false,
      error: null
    }
  },
  computed: {
    ...mapState(['carts', 'products']),
    sortedCarts() {
      if (!this.carts) return [];
      return [...this.carts].sort(this.applySorting);
    },
    paginatedCarts() {
      const start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
      return this.sortedCarts.slice(start, start + this.pagination.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.sortedCarts.length / this.pagination.itemsPerPage);
    }
  },
  watch: {
    'pagination.itemsPerPage'() {
      this.pagination.currentPage = 1;
    }
  },
  created() {
    this.fetchCarts();
    this.fetchProducts();
  },
  methods: {
    ...mapActions(['loadCarts', 'deleteCart', 'loadProducts']),
    async fetchCarts() {
      this.loading = true;
      try {
        await this.loadCarts();
      } catch (error) {
        this.error = 'Erro ao carregar carrinhos';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async fetchProducts() {
      try {
        await this.loadProducts();
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    },
    getProductName(productId) {
      const product = this.products.find(p => p.id === productId);
      return product ? product.title : `Produto ${productId}`;
    },
    applySorting(a, b) {
      if (!this.sortConfig.key) return 0;

      let aValue = a[this.sortConfig.key];
      let bValue = b[this.sortConfig.key];

      if (this.sortConfig.key === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      const comparison = aValue > bValue ? 1 : -1;
      return this.sortConfig.direction === 'asc' ? comparison : -comparison;
    },
    sort(key) {
      if (this.sortConfig.key === key) {
        this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortConfig.key = key;
        this.sortConfig.direction = 'asc';
      }
    },
    getSortIcon(column) {
      if (this.sortConfig.key !== column) return 'fas fa-sort';
      return this.sortConfig.direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    },
    redirectToCreateCart() {
      this.$router.push('/create-cart');
    },
    viewDetails(cartId) {
      this.$router.push(`/cart-details/${cartId}`);
    },
    editCart(cartId) {
      this.$router.push(`/edit-cart/${cartId}`);
    },
    async confirmDelete(cartId) {
      if (confirm('Tem certeza que deseja excluir este carrinho?')) {
        try {
          await this.deleteCart(cartId);
          alert('Carrinho excluído com sucesso!');
        } catch (error) {
          alert('Erro ao excluir carrinho: ' + error.message);
        }
      }
    }
  }
};
</script>

<style scoped>
.add-cart-button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background-color 0.3s;
}

.add-cart-button:hover {
  background-color: #45a049;
}

.actions-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 10px;
}

.items-per-page select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
}

th.sortable {
  cursor: pointer;
  user-select: none;
}

th.sortable:hover {
  background-color: #e9ecef;
}

.products-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.products-list li {
  margin-bottom: 5px;
}

.actions {
  display: flex;
  gap: 8px;
}

.action-button {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button.view {
  background-color: #17a2b8;
  color: white;
}

.action-button.edit {
  background-color: #ffc107;
  color: #212529;
}

.action-button.delete {
  background-color: #dc3545;
  color: white;
}

.action-button:hover {
  opacity: 0.9;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.pagination-button {
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button:not(:disabled):hover {
  background-color: #e9ecef;
}

.page-info {
  font-weight: 500;
  color: #6c757d;
}

tr:nth-child(even) {
  background-color: #f8f9fa;
}

tr:hover {
  background-color: #f2f2f2;
}
</style>