<template>
    <div class="edit-cart">
        <h2>Editar Carrinho</h2>

        <div class="form-group">
            <label>Usuário:</label>
            <select v-model="selectedUser" class="form-control">
                <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.username }}
                </option>
            </select>
        </div>

        <div class="cart-items">
            <h3>Produtos no Carrinho:</h3>
            <div v-for="item in cartItems" :key="item.id" class="cart-item">
                <div class="item-details">
                    <span>{{ item.title }}</span>
                    <div class="quantity-controls">
                        <button @click="decrementQuantity(item)" 
                                class="quantity-btn" 
                                :disabled="item.quantity <= 1">-</button>
                        <input type="number" 
                               v-model.number="item.quantity" 
                               min="1" 
                               class="quantity-input"
                               @change="validateQuantity(item)">
                        <button @click="incrementQuantity(item)" 
                                class="quantity-btn">+</button>
                    </div>
                    <span>R$ {{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
                <button @click="removeItem(item)" class="btn-remove">Remover</button>
            </div>
            
            <div class="cart-total">
                <strong>Total: R$ {{ cartTotal.toFixed(2) }}</strong>
            </div>
        </div>

        <!-- Modal de Seleção de Produtos -->
        <div v-if="showProductModal" class="product-modal">
            <div class="modal-content">
                <h3>Selecionar Produto</h3>
                <div class="product-list">
                    <div v-for="product in availableProducts" :key="product.id" class="product-item"
                        @click="selectProduct(product)">
                        <span>{{ product.title }}</span>
                        <span>R$ {{ product.price.toFixed(2) }}</span>
                    </div>
                </div>
                <button @click="closeModal" class="btn-cancel">Fechar</button>
            </div>
        </div>

        <button @click="openProductModal" class="btn-add">Adicionar Produto</button>

        <div class="actions">
            <button @click="cancel" class="btn-cancel">Cancelar</button>
            <button @click="save" class="btn-save">Salvar</button>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
    name: 'EditCart',

    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();

        const cartId = parseInt(route.params.id);
        const selectedUser = ref(null);
        const cartItems = ref([]);
        const users = ref([]);
        const showProductModal = ref(false);
        const availableProducts = ref([]);

        const cartTotal = computed(() => {
            return cartItems.value.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0);
        });

        // Carregar todos os produtos disponíveis
        const loadAvailableProducts = async () => {
            try {
                const products = await store.dispatch('loadProducts');
                // Filtrar produtos que já não estão no carrinho
                availableProducts.value = products.filter(product =>
                    !cartItems.value.some(item => item.id === product.id)
                );
            } catch (error) {
                console.error('Erro ao carregar produtos:', error);
            }
        };

        onMounted(async () => {
            try {
                // Carregar dados do carrinho
                const cart = await store.dispatch('getCart', cartId);
                selectedUser.value = cart.userId;

                // Carregar produtos no carrinho
                const products = await Promise.all(
                    cart.products.map(async (item) => {
                        const product = await store.dispatch('getProduct', item.productId);
                        return {
                            ...product,
                            quantity: item.quantity
                        };
                    })
                );
                cartItems.value = products;

                // Carregar usuários
                const usersList = await store.dispatch('loadUsers');
                users.value = usersList;

                // Carregar produtos disponíveis
                await loadAvailableProducts();
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        });

        const incrementQuantity = (item) => {
            item.quantity++;
        };

        const decrementQuantity = (item) => {
            if (item.quantity > 1) {
                item.quantity--;
            }
        };

        const validateQuantity = (item) => {
            if (item.quantity < 1 || !item.quantity) {
                item.quantity = 1;
            }
            item.quantity = Math.floor(item.quantity);
        };

        const openProductModal = () => {
            showProductModal.value = true;
        };

        const closeModal = () => {
            showProductModal.value = false;
        };

        const selectProduct = (product) => {
            cartItems.value.push({
                ...product,
                quantity: 1
            });
            closeModal();
            loadAvailableProducts();
        };

        const removeItem = (item) => {
            cartItems.value = cartItems.value.filter(i => i.id !== item.id);
            loadAvailableProducts();
        };

        const save = async () => {
            try {
                const updatedCart = {
                    id: cartId,
                    userId: selectedUser.value,
                    products: cartItems.value.map(item => ({
                        productId: item.id,
                        quantity: item.quantity
                    }))
                };

                await store.dispatch('updateCart', updatedCart);
                router.push('/cart');
            } catch (error) {
                console.error('Erro ao salvar carrinho:', error);
            }
        };

        const cancel = () => {
            router.push('/cart');
        };

        return {
            selectedUser,
            cartItems,
            users,
            showProductModal,
            availableProducts,
            cartTotal,
            save,
            cancel,
            removeItem,
            openProductModal,
            closeModal,
            selectProduct,
            incrementQuantity,
            decrementQuantity,
            validateQuantity
        };
    }
});
</script>

<style scoped>
.edit-cart {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    position: relative;
}

.form-group {
    margin-bottom: 20px;
}

.form-control {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.cart-items {
    margin: 20px 0;
}

.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    border-radius: 4px;
    background-color: #fff;
}

.item-details {
    display: flex;
    align-items: center;
    flex-grow: 1;
    margin-right: 10px;
}

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 0 15px;
}

.quantity-btn {
    background-color: #e9ecef;
    border: 1px solid #ced4da;
    border-radius: 4px;
    padding: 2px 8px;
    cursor: pointer;
    font-size: 14px;
}

.quantity-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.quantity-btn:hover:not(:disabled) {
    background-color: #dde2e6;
}

.quantity-input {
    width: 60px;
    text-align: center;
    padding: 4px;
    border: 1px solid #ced4da;
    border-radius: 4px;
}

.quantity-input:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

.btn-remove {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-remove:hover {
    background-color: #c82333;
}

.btn-add {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 20px;
    width: 100%;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.btn-cancel {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
}

.btn-save {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
}

.product-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
}

.product-list {
    margin: 20px 0;
}

.product-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    border-radius: 4px;
    cursor: pointer;
}

.product-item:hover {
    background-color: #f8f9fa;
}

.cart-total {
    margin-top: 20px;
    text-align: right;
    font-size: 1.2em;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 4px;
}
</style>