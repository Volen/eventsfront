<template>
  <div>
    <p>First Phase Time: {{ this.time }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: null,
      ws: null,
    };
  },
  methods: {
    onMessage(ev) {
      const recv = JSON.parse(ev.data);
      this.time = recv.time;
      console.log(recv);
    },
  },
  beforeMount() {
    const ws = new WebSocket("ws://localhost:8000/first_phase");
    ws.onmessage = this.onMessage;
    this.ws = ws;
  },
};
</script>

<style scoped></style>
