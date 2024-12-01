import { createStore } from 'vuex';

export default createStore({
  state: {
    users: [],
    products: [],
    carts: [],
    categories: [],
    loading: false,
    error: null,
    currentUser: null
  },

  mutations: {
    setUsers(state, users) {
      state.users = users;
    },
    setProducts(state, products) {
      state.products = products;
    },
    setCategories(state, categories) {
      state.categories = categories;
    },
    setCarts(state, carts) {
      state.carts = carts;
    },
    updateCartInState(state, updatedCart) {
      const index = state.carts.findIndex(cart => cart.id === updatedCart.id);
      if (index !== -1) {
        state.carts.splice(index, 1, updatedCart);
      }
    },
    setLoading(state, status) {
      state.loading = status;
    },
    setError(state, error) {
      state.error = error;
    },
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    updateUserInState(state, updatedUser) {
      const index = state.users.findIndex(user => user.id === updatedUser.id);
      if (index !== -1) {
        state.users.splice(index, 1, updatedUser);
      }
    },
    addUserToState(state, newUser) {
      state.users.push(newUser);
    },
    removeUserFromState(state, userId) {
      state.users = state.users.filter(user => user.id !== userId);
    }
  },

  actions: {
    // User management actions
    async loadUsers({ commit }) {
      try {
        commit('setLoading', true);
        const response = await fetch('https://fakestoreapi.com/users');
        const users = await response.json();
        commit('setUsers', users);
        commit('setLoading', false);
        return users;
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
        throw error;
      }
    },

    async getUserById({ commit }, userId) {
      try {
        commit('setLoading', true);
        const response = await fetch(`https://fakestoreapi.com/users/${userId}`);
        const user = await response.json();
        commit('setLoading', false);
        return user;
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
        throw error;
      }
    },

    async createUser({ commit }, userData) {
      try {
        commit('setLoading', true);
        const response = await fetch('https://fakestoreapi.com/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
        const newUser = await response.json();
        commit('addUserToState', newUser);
        commit('setLoading', false);
        return newUser;
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
        throw error;
      }
    },

    async updateUser({ commit }, { userId, userData }) {
      try {
        commit('setLoading', true);
        const response = await fetch(`https://fakestoreapi.com/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
        const updatedUser = await response.json();
        commit('updateUserInState', updatedUser);
        commit('setLoading', false);
        return updatedUser;
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
        throw error;
      }
    },

    async deleteUser({ commit }, userId) {
      try {
        commit('setLoading', true);
        await fetch(`https://fakestoreapi.com/users/${userId}`, {
          method: 'DELETE'
        });
        commit('removeUserFromState', userId);
        commit('setLoading', false);
      } catch (error) {
        commit('setError', error.message);
        commit('setLoading', false);
        throw error;
      }
    },

    async loginUser({ commit }, credentials) {
      try {
        commit('setLoading', true);
        const response = await fetch('https://fakestoreapi.com/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        });
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          commit('setCurrentUser', credentials.username);
          return data;
        } else {
          throw new Error('Login falhou');
        }
      } catch (error) {
        commit('setError', error.message);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },

    // Existing product actions
    async loadProducts({ commit }) {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();
        commit('setProducts', products);
        return products;
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        throw error;
      }
    },

    async loadCategories({ commit }) {
      try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        const categories = await response.json();
        commit('setCategories', categories);
        return categories;
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        throw error;
      }
    },

    async loadCarts({ commit }) {
      try {
        const response = await fetch('https://fakestoreapi.com/carts');
        const carts = await response.json();
        commit('setCarts', carts);
        return carts;
      } catch (error) {
        console.error('Erro ao carregar carrinhos:', error);
        throw error;
      }
    },

    async getProduct(_, productId) {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        return await response.json();
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
        throw error;
      }
    },

    async getCart(_, cartId) {
      try {
        const response = await fetch(`https://fakestoreapi.com/carts/${cartId}`);
        return await response.json();
      } catch (error) {
        console.error('Erro ao buscar carrinho:', error);
        throw error;
      }
    },

    async updateCart({ commit }, cart) {
      try {
        const response = await fetch(`https://fakestoreapi.com/carts/${cart.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(cart)
        });
        const updatedCart = await response.json();
        commit('updateCartInState', updatedCart);
        return updatedCart;
      } catch (error) {
        console.error('Erro ao atualizar carrinho:', error);
        throw error;
      }
    },

    async deleteCart({ commit }, cartId) {
      try {
        await fetch(`https://fakestoreapi.com/carts/${cartId}`, {
          method: 'DELETE'
        });
        const response = await fetch('https://fakestoreapi.com/carts');
        const carts = await response.json();
        commit('setCarts', carts);
      } catch (error) {
        console.error('Erro ao deletar carrinho:', error);
        throw error;
      }
    }
  },

  getters: {
    getCartById: (state) => (id) => {
      return state.carts.find(cart => cart.id === id);
    },
    getUserById: (state) => (id) => {
      return state.users.find(user => user.id === id);
    },
    getProductById: (state) => (id) => {
      return state.products.find(product => product.id === id);
    },
    isAuthenticated: (state) => {
      return !!state.currentUser && !!localStorage.getItem('token');
    },
    getCurrentUser: (state) => {
      return state.currentUser;
    }
  }
})