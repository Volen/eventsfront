import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: "",
    token: localStorage.getItem("token") || "",
    user: localStorage.getItem("user") || "",
  },
  mutations: {
    auth_request(state) {
      state.status = "loading";
    },
    auth_success(state, { token, user }) {
      state.status = "success";
      state.token = token;
      state.user = user;
    },
    auth_error(state) {
      state.status = "error";
    },
    logout(state) {
      state.status = "";
      state.token = "";
    },
  },
  actions: {
    login({ commit }, user) {
      let formData = new FormData();
      formData.append("username", user.username);
      formData.append("password", user.password);
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: "http://localhost:8000/token",
          data: formData,
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
        })
          .then((resp) => {
            const token = resp.data.access_token;
            const user = resp.data.username;
            localStorage.setItem("token", token);
            localStorage.setItem("user", user);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            commit("auth_success", { token, user });
            resolve(resp);
          })
          .catch((err) => {
            commit("auth_error");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            reject(err);
          });
      });
    },
    // eslint-disable-next-line
    register({ commit }, user) {
      return new Promise((resolve, reject) => {
        axios({
          url: "http://localhost:8000/user",
          data: user,
          method: "POST",
          headers: { "content-type": "application/json" },
        })
          .then((resp) => {
            // eslint-disable-next-line
            alert("Успешная регистрация! Теперь вы можете зайти под своим логином и паролем.");
            resolve(resp);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit("logout");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        resolve();
      });
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    authStatus: (state) => state.status,
  },
});
