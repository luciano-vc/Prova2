<template>
    <div>
      <h1>Dados de Usuários e Carrinhos</h1>
      <p>Os dados foram processados e estão disponíveis.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DataComponent',
    data() {
      return {
        users: [
          { email: 'john@gmail.com', name: 'John Doe' },
          { email: 'morrison@gmail.com', name: 'Morrison' },
          { email: 'derek@gmail.com', name: 'Derek' },
          { email: 'kate@gmail.com', name: 'Kate' },
          { email: 'jamie@gmail.com', name: 'Jamie' }
        ],
        products: [
          { id: 1, name: 'Produto 1', price: 100 },
          { id: 2, name: 'Produto 2', price: 200 },
          { id: 3, name: 'Produto 3', price: 300 }
        ],
        carts: [
          { userId: 1, productId: 1, quantity: 2 },
          { userId: 2, productId: 2, quantity: 1 },
          { userId: 3, productId: 3, quantity: 3 }
        ]
      };
    },
    mounted() {
      this.processData();
    },
    methods: {
      processData() {
        // Processa os dados e os exibe no console
        console.log('Usuários:', this.users);
        console.log('Produtos:', this.products);
        console.log('Carrinhos:', this.carts);
        
        // Adicione lógica para manipular ou enviar os dados conforme necessário
      }
    }
  };
  </script>
  
  <style scoped>
  /* Estilização opcional */
  </style>