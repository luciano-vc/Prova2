<template>
    <div class="user-form-container">
      <h1>Criar Novo Usuário</h1>
      
      <form @submit.prevent="createUser" class="user-form">
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
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserCreate',
    data() {
      return {
        user: {
          name: '',
          email: '',
          username: '',
          phone: ''
        }
      }
    },
    methods: {
      async createUser() {
        try {
          await this.$store.dispatch('createUser', this.user);
          this.$router.push('/users');
          alert('Usuário criado com sucesso!');
        } catch (error) {
          alert('Erro ao criar usuário: ' + error.message);
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
  </style>