<!-- UsersView.vue -->
<template>
  <div>
    <h1>Lista de Usuários</h1>

    <div class="actions-container">
      <button @click="redirectToCreateUser" class="add-user-button">
        <i class="fas fa-plus"></i> Adicionar Usuário
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
        <tr v-for="user in paginatedUsers" :key="user.id">
          <td>{{ formatName(user.name) }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.phone }}</td>
          <td class="actions">
            <button v-for="action in actions" :key="action.type" :class="['action-button', action.type]"
              @click="action.handler(user.id)">
              <i :class="action.icon"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button :disabled="pagination.currentPage === 1" @click="pagination.currentPage--" class="pagination-button">
        <i class="fas fa-chevron-left"></i>
      </button>

      <span class="page-info">
        Página {{ pagination.currentPage }} de {{ totalPages }}
      </span>

      <button :disabled="pagination.currentPage === totalPages" @click="pagination.currentPage++"
        class="pagination-button">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'UserList',
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
        { key: 'name', label: 'Nome' },
        { key: 'email', label: 'Email' },
        { key: 'username', label: 'Username' },
        { key: 'phone', label: 'Telefone' }
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
          handler: this.editUser
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
    ...mapState(['users']),
    sortedUsers() {
      return [...this.users].sort(this.applySorting);
    },
    paginatedUsers() {
      const start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
      return this.sortedUsers.slice(start, start + this.pagination.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.sortedUsers.length / this.pagination.itemsPerPage);
    }
  },
  watch: {
    'pagination.itemsPerPage'() {
      this.pagination.currentPage = 1;
    }
  },
  created() {
    this.$store.dispatch('loadUsers');
  },
  methods: {
    formatName(name) {
      if (!name || !name.firstname || !name.lastname) return '';

      try {
        const firstname = name.firstname.charAt(0).toUpperCase() + name.firstname.slice(1).toLowerCase();
        const lastname = name.lastname.charAt(0).toUpperCase() + name.lastname.slice(1).toLowerCase();

        return `${firstname} ${lastname}`;
      } catch (error) {
        console.error('Erro ao formatar nome:', error);
        return '';
      }
    },
    applySorting(a, b) {
      if (!this.sortConfig.key) return 0;

      const aValue = a[this.sortConfig.key].toLowerCase();
      const bValue = b[this.sortConfig.key].toLowerCase();

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
    redirectToCreateUser() {
      this.$router.push('/create-user');
    },
    viewDetails(userId) {
      this.$router.push(`/user-details/${userId}`);
    },
    editUser(userId) {
      this.$router.push(`/edit-user/${userId}`);
    },
    async confirmDelete(userId) {
      if (confirm('Tem certeza que deseja excluir este usuário?')) {
        try {
          await this.$store.dispatch('deleteUser', userId);
          alert('Usuário excluído com sucesso!');
        } catch (error) {
          alert('Erro ao excluir usuário: ' + error.message);
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

th,
td {
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