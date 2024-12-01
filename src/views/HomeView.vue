<template>
  <div class="home">
    <div class="main-content">
      <h1 class="title">Bem-vindo ao Painel de Controle</h1>
      
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-box"></i>
          </div>
          <div class="stat-content">
            <h3>Total de Produtos</h3>
            <p class="stat-number">{{ totalProducts }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-tags"></i>
          </div>
          <div class="stat-content">
            <h3>Total de Categorias</h3>
            <p class="stat-number">{{ totalCategories }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="stat-content">
            <h3>Total de Pedidos</h3>
            <p class="stat-number">{{ totalCarts }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <h3>Total de Usuários</h3>
            <p class="stat-number">{{ totalUsers }}</p>
          </div>
        </div>
      </div>

      <div class="chart-container">
        <PieChart
          v-if="dataLoaded"
          :productsCount="totalProducts"
          :usersCount="totalUsers"
          :cartsCount="totalCarts"
        />
        <p v-else class="loading">Carregando dados...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PieChart from '../components/PieChart.vue';

export default {
  name: 'HomeView',
  
  components: {
    PieChart
  },

  computed: {
    ...mapState(['products', 'users', 'carts', 'categories']),
    
    totalProducts() {
      return this.products?.length || 0;
    },
    
    totalUsers() {
      return this.users?.length || 0;
    },
    
    totalCarts() {
      return this.carts?.length || 0;
    },

    totalCategories() {
      return this.categories?.length || 0;
    },

    dataLoaded() {
      return this.totalProducts !== 0 && 
             this.totalUsers !== 0 && 
             this.totalCarts !== 0 &&
             this.totalCategories !== 0;
    }
  },

  created() {
    this.loadData();
  },

  methods: {
    async loadData() {
      try {
        await Promise.all([
          this.$store.dispatch('loadProducts'),
          this.$store.dispatch('loadUsers'),
          this.$store.dispatch('loadCarts'),
          this.$store.dispatch('loadCategories')
        ]);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    },
  },
};
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #f3f4f6;
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  color: #8B5CF6;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2em;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  background: #8B5CF6;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.stat-icon i {
  font-size: 1.5em;
}

.stat-content {
  flex-grow: 1;
}

.stat-content h3 {
  margin: 0;
  color: #4B5563;
  font-size: 1em;
  font-weight: 500;
}

.stat-number {
  margin: 5px 0 0;
  font-size: 1.8em;
  font-weight: bold;
  color: #1F2937;
}

.chart-container {
  background: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
}

.loading {
  text-align: center;
  color: #6B7280;
  font-size: 1.1em;
  padding: 2rem;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }

  .stats-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .chart-container {
    padding: 1rem;
  }
}
</style>