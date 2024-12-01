<template>
  <div>
    <h1>Lista de Produtos</h1>

    <div class="filters-container">
      <div class="filter-group">
        <label>Filtrar por Categoria:</label>
        <select v-model="filters.category">
          <option value="">Todas as Categorias</option>
          <option v-for="category in uniqueCategories" 
                  :key="category" 
                  :value="category">
            {{ category }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>Filtrar por Preço:</label>
        <select v-model="filters.price">
          <option value="">Todos</option>
          <option value="0-50">Até $50</option>
          <option value="50-100">$50 - $100</option>
          <option value="100-500">$100 - $500</option>
          <option value="500+">Acima de $500</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Filtrar por Classificação:</label>
        <select v-model="filters.rating">
          <option value="">Todas</option>
          <option value="4">4+ estrelas</option>
          <option value="3">3+ estrelas</option>
          <option value="2">2+ estrelas</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Buscar:</label>
        <input 
          type="text" 
          v-model="filters.search" 
          placeholder="Digite para buscar..."
          class="search-input"
        >
      </div>

      <button class="clear-filters" @click="clearFilters">
        Limpar Filtros
      </button>
    </div>

    <div class="actions-container">
      <button @click="redirectToCreateProduct" class="add-product-button">
        <i class="fas fa-plus"></i> Adicionar Produto
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
          <th>Imagem</th>
          <th v-for="column in sortableColumns" 
              :key="column.key"
              @click="sort(column.key)"
              class="sortable">
            {{ column.label }}
            <i :class="getSortIcon(column.key)"></i>
          </th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in paginatedProducts" :key="product.id">
          <td>
            <img 
              :src="getImageSrc(product)" 
              :alt="product.title"
              style="width: 50px; height: auto;"
              @error="handleImageError"
            />
          </td>
          <td>{{ product.title }}</td>
          <td>{{ product.category }}</td>
          <td>{{ formatPrice(product.price) }}</td>
          <td>
            <div class="rating">
              <span class="stars">
                <i v-for="n in 5" 
                   :key="n"
                   :class="['fas', getStarClass(product.rating?.rate, n)]">
                </i>
              </span>
              <span class="rating-text">
                {{ formatRating(product.rating?.rate) }}
              </span>
            </div>
          </td>
          <td class="actions">
            <button v-for="action in actions"
                    :key="action.type"
                    :class="['action-button', action.type]"
                    @click="action.handler(product.id)">
              <i :class="action.icon"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button 
        :disabled="pagination.currentPage === 1"
        @click="pagination.currentPage--"
        class="pagination-button"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      
      <span class="page-info">
        Página {{ pagination.currentPage }} de {{ totalPages }}
      </span>
      
      <button 
        :disabled="pagination.currentPage === totalPages"
        @click="pagination.currentPage++"
        class="pagination-button"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import defaultImage from '../assets/default-image.png';

export default {
  name: 'ProductList',
  data() {
    return {
      filters: {
        price: '',
        rating: '',
        category: this.getCategoryFromRoute(),
        search: ''
      },
      pagination: {
        currentPage: 1,
        itemsPerPage: 10
      },
      sortConfig: {
        key: null,
        direction: 'asc'
      },
      sortableColumns: [
        { key: 'title', label: 'Nome' },
        { key: 'category', label: 'Categoria' },
        { key: 'price', label: 'Preço' },
        { key: 'rating', label: 'Classificação' }
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
          handler: this.editProduct
        },
        { 
          type: 'delete', 
          icon: 'fas fa-trash',
          handler: this.confirmDelete
        }
      ]
    }
  },
  computed: {
    ...mapState(['products']),
    uniqueCategories() {
      return [...new Set(this.products.map(p => p.category))].sort();
    },
    filteredProducts() {
      return this.products
        .filter(this.applySearchFilter)
        .filter(this.applyCategoryFilter)
        .filter(this.applyPriceFilter)
        .filter(this.applyRatingFilter)
        .sort(this.applySorting);
    },
    paginatedProducts() {
      const start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
      return this.filteredProducts.slice(start, start + this.pagination.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.pagination.itemsPerPage);
    }
  },
  watch: {
  'pagination.itemsPerPage'() {
    this.pagination.currentPage = 1;
  },
  filteredProducts() {
    this.pagination.currentPage = 1;
  },
  '$route'() {  // Removido o parâmetro 'to' que não estava sendo usado
    this.filters.category = this.getCategoryFromRoute();
  },
  'filters.category'(newCategory) {
    this.updateCategoryUrl(newCategory);
  }
},
  created() {
    this.$store.dispatch('loadProducts');
    this.filters.category = this.getCategoryFromRoute();
  },
  methods: {
    getCategoryFromRoute() {
      return this.$route.query.category || '';
    },
    updateCategoryUrl(category) {
      if (category) {
        this.$router.replace({
          query: { ...this.$route.query, category }
        });
      } else {
        const query = { ...this.$route.query };
        delete query.category;
        this.$router.replace({ query });
      }
    },
    applySearchFilter(product) {
      if (!this.filters.search) return true;
      const search = this.filters.search.toLowerCase();
      return product.title.toLowerCase().includes(search) ||
             product.category.toLowerCase().includes(search);
    },
    applyCategoryFilter(product) {
      return !this.filters.category || product.category === this.filters.category;
    },
    applyPriceFilter(product) {
      if (!this.filters.price) return true;
      const [min, max] = this.filters.price.split('-');
      if (max === '+') {
        return product.price >= parseInt(min);
      }
      return product.price >= parseInt(min) && product.price <= parseInt(max);
    },
    applyRatingFilter(product) {
      if (!this.filters.rating) return true;
      return product.rating && product.rating.rate >= parseFloat(this.filters.rating);
    },
    applySorting(a, b) {
      if (!this.sortConfig.key) return 0;
      
      const aValue = this.getSortValue(a, this.sortConfig.key);
      const bValue = this.getSortValue(b, this.sortConfig.key);
      
      const comparison = this.compareValues(aValue, bValue);
      return this.sortConfig.direction === 'asc' ? comparison : -comparison;
    },
    getSortValue(product, key) {
      const value = key === 'rating' ? product.rating?.rate || 0 : product[key];
      return typeof value === 'string' ? value.toLowerCase() : value;
    },
    compareValues(a, b) {
      if (a === b) return 0;
      return a > b ? 1 : -1;
    },
    getImageSrc(product) {
      return product.image || defaultImage;
    },
    handleImageError(event) {
      event.target.src = defaultImage;
    },
    getStarClass(rating, position) {
      return position <= Math.round(rating || 0) ? 'fa-star' : 'fa-star-o';
    },
    formatRating(rating) {
      return rating ? rating.toFixed(1) : 'N/A';
    },
    formatPrice(price) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'USD'
      }).format(price);
    },
    clearFilters() {
      this.filters = {
        price: '',
        rating: '',
        category: '',
        search: ''
      };
      this.sortConfig = {
        key: null,
        direction: 'asc'
      };
      const query = { ...this.$route.query };
      delete query.category;
      this.$router.replace({ query });
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
    redirectToCreateProduct() {
      this.$router.push('/create-product');
    },
    viewDetails(productId) {
      this.$router.push(`/product-details/${productId}`);
    },
    editProduct(productId) {
      this.$router.push(`/edit-product/${productId}`);
    },
    async confirmDelete(productId) {
      if (confirm('Tem certeza que deseja excluir este produto?')) {
        try {
          await this.$store.dispatch('deleteProduct', productId);
          alert('Produto excluído com sucesso!');
        } catch (error) {
          alert('Erro ao excluir produto: ' + error.message);
        }
      }
    }
  }
};
</script>

<style scoped>
.add-product-button {
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

.add-product-button:hover {
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

.filters-container {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: 600;
  color: #495057;
  min-width: 100px;
}

.filter-group select,
.filter-group input {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  min-width: 150px;
  background-color: white;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  min-width: 200px;
}

.clear-filters {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.clear-filters:hover {
  background-color: #c82333;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  color: #ffc107;
}

.rating-text {
  color: #6c757d;
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

