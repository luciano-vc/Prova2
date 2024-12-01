import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProductsView from '../views/ProductsView.vue';
import CartView from '../views/CartView.vue';
import UsersView from '../views/UsersView.vue';
import LoginView from '../views/LoginView.vue';
import CategoryView from '../views/CategoryView.vue';
import ProductDetailsView from '../views/ProductDetailView.vue';
import ProductEditView from '../views/ProductEditView.vue';
import CreateProductView from '../views/ProductCreateView.vue';
import UserCreateView from '@/views/UserCreateView.vue';
import UserEditView from '@/views/UserEditView.vue';
import UserDetailView from '@/views/UserDetailView.vue';
import CartCreate from '@/views/CartCreate.vue';
import CartDetails from '@/views/CartDetails.vue';
import CartEdit from '@/views/CartEdit.vue';
import store from '../store';

const routes = [
  { 
    path: '/', 
    name: 'Home',
    component: HomeView 
  },
  { 
    path: '/products', 
    name: 'Products',
    component: ProductsView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/cart', 
    name: 'Cart',
    component: CartView,
    props: route => ({ userId: route.query.userId }),
    meta: { requiresAuth: true }
  },
  { 
    path: '/users', 
    name: 'Users',
    component: UsersView,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-user',
    name: 'create-user',
    component: UserCreateView,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-user/:id',
    name: 'edit-user',
    component: UserEditView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/user-details/:id',
    name: 'user-details',
    component: UserDetailView,
    props: true,
    meta: { requiresAuth: true }
  },
  { 
    path: '/login', 
    name: 'Login',
    component: LoginView 
  },
  { 
    path: '/categories', 
    name: 'Categories',
    component: CategoryView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/categories/:category', 
    name: 'CategoryProducts',
    component: ProductsView,
    props: true,
    meta: { requiresAuth: true }
  },
  { 
    path: '/product-details/:id', 
    name: 'ProductDetails',
    component: ProductDetailsView,
    props: true,
    meta: { requiresAuth: true }
  },
  { 
    path: '/edit-product/:id', 
    name: 'ProductEdit',
    component: ProductEditView,
    props: true,
    meta: { requiresAuth: true }
  },
  { 
    path: '/create-product', 
    name: 'CreateProduct',
    component: CreateProductView,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-cart',
    name: 'CreateCart',
    component: CartCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/cart-details/:id',
    name: 'cart-details',
    component: CartDetails,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-cart/:id',
    name: 'cart-edit',
    component: CartEdit,
    props: true,
    meta: { requiresAuth: true }
  } 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;