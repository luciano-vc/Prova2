<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <img src="@/assets/logo.png" alt="Logo" class="login-logo">
        <h1>Login</h1>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Usuário</label>
          <input type="text" id="username" v-model="credentials.username" required placeholder="Digite seu usuário">
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <div class="password-input">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="credentials.password" required
              placeholder="Digite sua senha">
            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="login-button" :disabled="loading">
          <span v-if="!loading">Entrar</span>
          <i v-else class="fas fa-spinner fa-spin"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',

  data() {
    return {
      credentials: {
        username: '',
        password: ''
      },
      showPassword: false,
      loading: false,
      error: null
    }
  },

  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = null;

      try {
        await this.$store.dispatch('loginUser', this.credentials);
        this.$router.push('/');
      } catch (error) {
        this.error = 'Usuário ou senha inválidos';
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  padding: 1rem;
}

.login-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-logo {
  width: 120px;
  margin-bottom: 1rem;
}

.login-header h1 {
  color: #8B5CF6;
  font-size: 1.8rem;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #4B5563;
  font-weight: 500;
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #8B5CF6;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6B7280;
  cursor: pointer;
  padding: 0;
}

.login-button {
  background: #8B5CF6;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background: #7C3AED;
}

.login-button:disabled {
  background: #9CA3AF;
  cursor: not-allowed;
}

.error-message {
  color: #DC2626;
  text-align: center;
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .login-card {
    padding: 1.5rem;
  }
}
</style>