<template>
  <div>
    <h4>Регистрация</h4>
    <form @submit.prevent="register">
      <label for="useruser">Имя пользователя</label>
      <div>
        <input
          id="username"
          type="text"
          v-model="username"
          required
          autofocus
        />
      </div>
      <label for="password">Пароль</label>
      <div>
        <input id="password" type="text" v-model="password" required />
      </div>
      <div>
        <button type="submit">Зарегистрироваться</button>
      </div>
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
    register: function () {
      let data = {
        username: this.username,
        password: this.password,
      };
      this.$store
        .dispatch("register", data)
        .then(() => this.$router.push("/"))
        .catch((err) => console.log(err));
    },
  },
};
</script>
