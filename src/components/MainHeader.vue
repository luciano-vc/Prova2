<template>
  <header>
    <div class="logo">
      <img src="@/assets/logo.png" alt="Logo da Loja" />
    </div>
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/products">Produtos</router-link></li>
        <li><router-link to="/categories">Categorias</router-link></li>
        <li><router-link to="/cart">Carrinhos</router-link></li>
        <li><router-link to="/users">Usuários</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'MainHeader',
};
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #6200ea;
  padding: 1rem;
  color: white;
}

.logo img {
  height: 150px; 
}

nav ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}

nav a {
  color: white;
  text-decoration: none;
}
</style>