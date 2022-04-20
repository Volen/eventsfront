<template>
  <div>
    <p>First Phase Time: {{ this.endtime }}</p>
    <form
      v-if="isVote === false"
      class="first-phase-form"
      @submit.prevent="firstPhase"
    >
      <label>Выберите время проведения мероприятия.</label>
      <select id="time-select" v-model="eventTime"></select>
      <label>Мероприятие</label>
      <vue-simple-suggest
        v-model="eventText"
        :list="eventSuggestionList"
        :filter-by-query="true"
      >
      </vue-simple-suggest>
      <!-- <input v-model="eventText" type="text" /> -->
      <button type="submit">Внести мероприятие</button>
    </form>
    <p v-else>Вы уже проголосовали!</p>
    <p>Active Poll: {{ this.activePoll }}</p>
    <p>Polling users: {{ this.items }}</p>
    <p>Event Text: {{ this.eventText }}</p>
    <p>
      Число проголосовавших пользователей:
      {{ this.items === null ? "loading..." : this.items.length }}
    </p>
  </div>
</template>

<script>
import axios from "axios";
import VueSimpleSuggest from "vue-simple-suggest";
import "vue-simple-suggest/dist/styles.css";

export default {
  components: { VueSimpleSuggest },
  data() {
    return {
      endtime: null,
      eventText: null,
      eventTime: null,
      activePoll: null,
      isVote: false,
      ws: null,
      items: null,
      eventDict: [],
    };
  },
  methods: {
    async eventSuggestionList() {
      await axios({
        url: "http://localhost:8000/event_dict",
        data: {},
        method: "GET",
      })
        .then((response) => {
          this.eventDict = response.data.map((event) => event.event);
        })
        .catch((error) => {
          console.log(error);
        });
      return this.eventDict;
    },
    onMessage(ev) {
      const recv = JSON.parse(ev.data);
      let endTime = recv.endtime;
      let date1 = new Date();
      let date2 = new Date();
      date2.setHours(endTime.split(":")[0]);
      date2.setMinutes(endTime.split(":")[1]);
      date2.setSeconds(endTime.split(":")[2]);
      let diff = date2.getTime() - date1.getTime();
      let msec = diff;
      let hh = Math.floor(msec / 1000 / 60 / 60);
      msec -= hh * 1000 * 60 * 60;
      let mm = Math.floor(msec / 1000 / 60);
      msec -= mm * 1000 * 60;
      let ss = Math.floor(msec / 1000);
      msec -= ss * 1000;
      this.endtime = `${hh}:${mm}:${ss}`;
      this.items = recv.first_phase_items;
      console.log(this.items);
      console.log(recv);
    },
    firstPhase() {
      axios({
        url: "http://localhost:8000/first_phase",
        data: {
          poll_key: this.activePoll.key,
          time: this.eventTime,
          event: this.eventText,
          username: localStorage.getItem("user"),
        },
        method: "POST",
      })
        .then((response) => {
          console.log(response);
          this.isVote = true;
        })
        .catch((error) => {
          console.log(error);
          this.isVote = true;
          alert("Вы уже голосовали!");
        });
    },
  },
  beforeMount() {
    const ws = new WebSocket("ws://localhost:8000/first_phase");
    ws.onmessage = this.onMessage;
    this.ws = ws;
  },
  mounted() {
    const select = document.getElementById("time-select");
    const currentTime = new Date();
    const hour = currentTime.getHours();
    const hourMax = 23;
    const minutes = currentTime.getMinutes();

    if (minutes < 15) {
      let opt1 = document.createElement("option");
      opt1.value = `${hour}:15:00`;
      opt1.innerHTML = `${hour}:15:00`;
      select.appendChild(opt1);
      let opt2 = document.createElement("option");
      opt2.value = `${hour}:30:00`;
      opt2.innerHTML = `${hour}:30:00`;
      select.appendChild(opt2);
      let opt3 = document.createElement("option");
      opt3.value = `${hour}:45:00`;
      opt3.innerHTML = `${hour}:45:00`;
      select.appendChild(opt3);
    } else if (minutes < 30) {
      let opt2 = document.createElement("option");
      opt2.value = `${hour}:30:00`;
      opt2.innerHTML = `${hour}:30:00`;
      select.appendChild(opt2);
      let opt3 = document.createElement("option");
      opt3.value = `${hour}:45:00`;
      opt3.innerHTML = `${hour}:45:00`;
      select.appendChild(opt3);
    } else {
      let opt3 = document.createElement("option");
      opt3.value = `${hour}:45:00`;
      opt3.innerHTML = `${hour}:45:00`;
      select.appendChild(opt3);
    }

    for (let i = hour + 1; i <= hourMax; i++) {
      let opt = document.createElement("option");
      opt.value = `${i}:00:00`;
      opt.innerHTML = `${i}:00:00`;
      select.appendChild(opt);
      let opt1 = document.createElement("option");
      opt1.value = `${i}:15:00`;
      opt1.innerHTML = `${i}:15:00`;
      select.appendChild(opt1);
      let opt2 = document.createElement("option");
      opt2.value = `${i}:30:00`;
      opt2.innerHTML = `${i}:30:00`;
      select.appendChild(opt2);
      let opt3 = document.createElement("option");
      opt3.value = `${i}:45:00`;
      opt3.innerHTML = `${i}:45:00`;
      select.appendChild(opt3);
    }

    axios({
      url: "http://localhost:8000/poll/active",
      data: {},
      method: "GET",
    })
      .then((response) => {
        console.log(response);
        this.activePoll = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style scoped></style>
