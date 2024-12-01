<template>
    <div class="user-details-container">
        <h1>Detalhes do Usuário</h1>

        <div class="user-card" v-if="user">
            <div class="user-info">
                <div class="info-group">
                    <label>Nome:</label>
                    <span>{{ user.name?.firstname }} {{ user.name?.lastname }}</span>
                </div>

                <div class="info-group">
                    <label>Email:</label>
                    <span>{{ user.email }}</span>
                </div>

                <div class="info-group">
                    <label>Username:</label>
                    <span>{{ user.username }}</span>
                </div>

                <div class="info-group">
                    <label>Telefone:</label>
                    <span>{{ user.phone }}</span>
                </div>

                <div class="info-group" v-if="user.address">
                    <label>Endereço:</label>
                    <span>
                        {{ user.address.street }},
                        {{ user.address.number }},
                        {{ user.address.city }} -
                        {{ user.address.zipcode }}
                    </span>
                </div>
            </div>

            <div class="card-actions">
                <button @click="goBack" class="back-button">
                    <i class="fas fa-arrow-left"></i> Voltar
                </button>
                <button @click="editUser" class="edit-button">
                    <i class="fas fa-edit"></i> Editar
                </button>
            </div>
        </div>

        <div v-else class="loading">
            Carregando informações do usuário...
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'UserDetail',
    computed: {
        ...mapState(['users']),
    },
    data() {
        return {
            user: null,
        }
    },
    created() {
        const userId = this.$route.params.id;
        this.loadUser(userId);
    },
    methods: {
        async loadUser(userId) {
            // Primeiro tenta encontrar o usuário no state do Vuex
            this.user = this.users.find(user => user.id === Number(userId));

            // Se não encontrar no state, busca através da action
            if (!this.user) {
                try {
                    this.user = await this.$store.dispatch('getUserById', Number(userId));
                } catch (error) {
                    console.error('Erro ao carregar usuário:', error);
                }
            }

            if (!this.user) {
                console.error('Usuário não encontrado');
            }
        },
        goBack() {
            this.$router.push('/users');
        },
        editUser() {
            const userId = this.user?.id;
            if (userId) {
                this.$router.push(`/edit-user/${userId}`);
            }
        }
    }
}
</script>


<style scoped>
.user-details-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.user-card {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-info {
    margin-bottom: 20px;
}

.info-group {
    margin-bottom: 15px;
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.info-group label {
    font-weight: 600;
    color: #666;
    display: block;
    margin-bottom: 5px;
}

.info-group span {
    font-size: 16px;
    color: #333;
}

.card-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.back-button,
.edit-button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: background-color 0.3s;
}

.back-button {
    background-color: #6c757d;
    color: white;
}

.edit-button {
    background-color: #ffc107;
    color: #212529;
}

.back-button:hover {
    background-color: #5a6268;
}

.edit-button:hover {
    background-color: #e0a800;
}

.loading {
    text-align: center;
    padding: 20px;
    color: #666;
}
</style>