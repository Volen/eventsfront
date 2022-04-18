import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import LoginComponent from "../components/LoginComponent.vue";
import RegisterComponent from "../components/RegisterComponent.vue";
import CreatePollView from "../views/CreatePollView.vue";
import FirstPhaseView from "../views/FirstPhaseView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginComponent,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterComponent,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/create_poll",
    name: "create-poll",
    component: CreatePollView,
  },
  {
    path: "/first_phase",
    name: "first-phase",
    component: FirstPhaseView,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});

export default router;
