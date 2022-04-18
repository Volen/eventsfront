<template>
  <div v-if="showForm">
    <p>Пожалуйста, инициируйте новое голосование.</p>
    <form class="poll-initiation-form" @submit.prevent="createPoll">
      <label>Продолжительность первой фазы голосования в минутах</label>
      <input v-model="firstPhaseMinutes" type="number" min="1" max="600" />
      <label>Продолжительность первой фазы голосования в минутах</label>
      <input v-model="secondPhaseMinutes" type="number" min="1" max="600" />
      <button type="submit">Инициировать голосование</button>
    </form>

    Time: {{ this.time }}
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      showForm: false,
      firstPhaseMinutes: 1,
      secondPhaseMinutes: 1,
      time: null,
    };
  },
  methods: {
    createPoll() {
      axios({
        url: "http://localhost:8000/poll",
        data: {
          first_phase_minutes: this.firstPhaseMinutes,
          second_phase_minutes: this.secondPhaseMinutes,
          is_active: true,
        },
        method: "POST",
      })
        .then(() => {
          alert("Голосование успешно инициировано!");
          window.location.replace("http://localhost:8081/first_phase");
        })
        .catch(() => {
          // ошибка 404 - уже есть активное голосование - редирект на первую фазу
          alert(
            "Уже есть активное голосование! Активное голосование может быть только одно! Переводим на страницу первой фазы голосования."
          );
          window.location.replace("http://localhost:8081/first_phase");
        });
    },
  },
  computed: {
    getCurrentUser() {
      return this.$store.state.user;
    },
  },
  mounted() {
    axios({
      url: "http://localhost:8000/poll/active",
      data: {},
      method: "GET",
    })
      .then(() => {
        // уже есть активное голосование - редирект
        alert(
          "Есть активное голосование! Переводим на страницу первой фазы голосования!"
        );
        window.location.replace("http://localhost:8081/first_phase");
      })
      .catch(() => {
        alert("Нет активного голосования!");
        // ошибка 404 - нет активного голосования - форма создания голосования
        this.showForm = true;
      });
  },
};
</script>

<style scoped>
.poll-initiation-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
