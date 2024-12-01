<script>
import axios from 'axios'
import { useToast } from 'vue-toastification'

export default {
    name: 'CartCreate',

    setup() {
        const toast = useToast()
        return { toast }
    },

    data() {
        return {
            loading: false,
            customers: [],
            products: [],
            error: null,
            cart: {
                userId: '',
                date: new Date().toISOString(),
                products: []
            }
        }
    },

    computed: {
        calculateCartTotal() {
            return this.cart.products.reduce((total, item) => {
                const product = this.products.find(p => p.id === parseInt(item.productId))
                return total + (product ? product.price * item.quantity : 0)
            }, 0).toFixed(2)
        },

        isValidCart() {
            return this.cart.userId && 
                   this.cart.products.length > 0 && 
                   this.cart.products.every(item => item.productId && item.quantity > 0)
        }
    },

    methods: {
        async loadCustomers() {
            try {
                const response = await axios.get('https://fakestoreapi.com/users')
                this.customers = response.data
            } catch (error) {
                console.error('Erro ao carregar clientes:', error)
                this.error = 'Não foi possível carregar a lista de clientes'
                this.toast?.error('Erro ao carregar lista de clientes')
            }
        },

        async loadProducts() {
            try {
                const response = await axios.get('https://fakestoreapi.com/products')
                this.products = response.data
            } catch (error) {
                console.error('Erro ao carregar produtos:', error)
                this.error = 'Não foi possível carregar a lista de produtos'
                this.toast?.error('Erro ao carregar lista de produtos')
            }
        },

        addItem() {
            this.cart.products.push({
                productId: '',
                quantity: 1
            })
        },

        removeItem(index) {
            this.cart.products.splice(index, 1)
        },

        async createCart() {
            if (this.loading || !this.isValidCart) return

            this.loading = true
            this.error = null

            try {
                const cartData = {
                    userId: parseInt(this.cart.userId),
                    date: this.cart.date,
                    products: this.cart.products.map(item => ({
                        productId: parseInt(item.productId),
                        quantity: parseInt(item.quantity)
                    }))
                }

                const response = await axios.post('https://fakestoreapi.com/carts', cartData)

                if (response.data) {
                    this.toast?.success('Carrinho criado com sucesso')
                    this.$router.push({ name: 'Cart' })
                }
            } catch (error) {
                console.error('Erro ao criar carrinho:', error)
                this.error = 'Erro ao criar o carrinho. Tente novamente.'
                this.toast?.error('Erro ao criar carrinho')
            } finally {
                this.loading = false
            }
        }
    },

    mounted() {
        this.loadCustomers()
        this.loadProducts()
    }
}
</script>

<template>
    <div class="cart-create">
        <h2>Criar Novo Carrinho</h2>

        <div v-if="error" class="error-message">
            {{ error }}
        </div>

        <form @submit.prevent="createCart" class="cart-form">
            <div class="form-group">
                <label>Cliente:</label>
                <select v-model="cart.userId" required class="form-select">
                    <option value="">Selecione um cliente</option>
                    <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                        {{ customer.username }} - {{ customer.email }}
                    </option>
                </select>
            </div>

            <div class="cart-items">
                <div v-for="(item, index) in cart.products" :key="index" class="cart-item">
                    <div class="product-select">
                        <label>Produto:</label>
                        <select v-model="item.productId" required class="form-select">
                            <option value="">Selecione um produto</option>
                            <option v-for="product in products" :key="product.id" :value="product.id">
                                {{ product.title }} - R$ {{ product.price }}
                            </option>
                        </select>
                    </div>
                    
                    <div class="quantity-input">
                        <label>Quantidade:</label>
                        <input type="number" v-model.number="item.quantity" min="1" required class="form-input">
                    </div>

                    <button type="button" @click="removeItem(index)" class="btn-remove">
                        Remover
                    </button>
                </div>
            </div>

            <div class="form-actions">
                <button type="button" @click="addItem" class="btn-add">
                    Adicionar Item
                </button>

                <div class="cart-total">
                    Total: R$ {{ calculateCartTotal }}
                </div>

                <button type="submit" :disabled="loading || !isValidCart" class="btn-submit">
                    {{ loading ? 'Criando...' : 'Criar Carrinho' }}
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped>
.cart-create {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-select, .form-input {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    width: 100%;
}

.cart-items {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.cart-item {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 15px;
    align-items: end;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 4px;
}

.product-select {
    flex: 1;
}

.quantity-input {
    width: 150px;
}

.form-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    gap: 15px;
}

.btn-add, .btn-remove, .btn-submit {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
}

.btn-add {
    background-color: #28a745;
    color: white;
}

.btn-remove {
    background-color: #dc3545;
    color: white;
}

.btn-submit {
    background-color: #007bff;
    color: white;
}

.btn-add:hover { background-color: #218838; }
.btn-remove:hover { background-color: #c82333; }
.btn-submit:hover { background-color: #0056b3; }

.cart-total {
    font-size: 1.2em;
    font-weight: bold;
    color: #2c3e50;
}

.error-message {
    padding: 10px;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
    border-radius: 4px;
    margin-bottom: 15px;
}

label {
    font-weight: 500;
    color: #495057;
}

button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .cart-item {
        grid-template-columns: 1fr;
    }

    .form-actions {
        flex-direction: column;
    }

    .btn-add, .btn-submit {
        width: 100%;
    }
}
</style>