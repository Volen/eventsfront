<template>
  <div>
    <form class="login" @submit.prevent="login">
      <h1>
        Войдите под своим логином и паролем, или
        <a href="/register">Зарегистрируйтесь</a>
      </h1>
      <label>Имя пользователя</label>
      <input required v-model="username" type="text" placeholder="Username" />
      <label>Пароль</label>
      <input required v-model="password" type="text" placeholder="Password" />
      <hr />
      <button type="submit">Зайти</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login: function () {
      let username = this.username;
      let password = this.password;
      this.$store
        .dispatch("login", { username, password })
        .then(() => this.$router.push("/create_poll"))
        .catch((err) => console.log(err));
    },
  },
};
</script>
