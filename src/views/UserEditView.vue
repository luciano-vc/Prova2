<template>
    <div class="user-form-container">
      <h1>Editar Usuário</h1>
      
      <form @submit.prevent="updateUser" class="user-form" v-if="user">
        <div class="form-group">
          <label for="name">Nome:</label>
          <input 
            id="name"
            v-model="user.name"
            type="text"
            required
          />
        </div>
  
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            id="email"
            v-model="user.email"
            type="email"
            required
          />
        </div>
  
        <div class="form-group">
          <label for="username">Username:</label>
          <input 
            id="username"
            v-model="user.username"
            type="text"
            required
          />
        </div>
  
        <div class="form-group">
          <label for="phone">Telefone:</label>
          <input 
            id="phone"
            v-model="user.phone"
            type="tel"
            required
          />
        </div>
  
        <div class="form-actions">
          <button type="button" @click="goBack" class="cancel-button">
            <i class="fas fa-times"></i> Cancelar
          </button>
          <button type="submit" class="submit-button">
            <i class="fas fa-save"></i> Salvar
          </button>
        </div>
      </form>
  
      <div v-else class="loading">
        Carregando informações do usuário...
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserEdit',
    data() {
      return {
        user: null
      }
    },
    created() {
      this.loadUser();
    },
    methods: {
      async loadUser() {
        try {
          const userId = this.$route.params.id;
          this.user = await this.$store.dispatch('getUserById', userId);
        } catch (error) {
          alert('Erro ao carregar usuário: ' + error.message);
          this.goBack();
        }
      },
      async updateUser() {
        try {
          await this.$store.dispatch('updateUser', this.user);
          this.$router.push('/users');
          alert('Usuário atualizado com sucesso!');
        } catch (error) {
          alert('Erro ao atualizar usuário: ' + error.message);
        }
      },
      goBack() {
        this.$router.push('/users');
      }
    }
  }
  </script>
  
  <style scoped>
  .user-form-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .user-form {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
  }
  
  .form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
  
  .submit-button, .cancel-button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: background-color 0.3s;
  }
  
  .submit-button {
    background-color: #4CAF50;
    color: white;
  }
  
  .cancel-button {
    background-color: #dc3545;
    color: white;
  }
  
  .submit-button:hover {
    background-color: #45a049;
  }
  
  .cancel-button:hover {
    background-color: #c82333;
  }
  
  .loading {
    text-align: center;
    padding: 20px;
    color: #666;
  }
  </style>