<template>
  <div class="flex flex-col h-full min-h-screen bg-gray-600 mx-auto">
    <TheHeader />
    <div class="hidden lg:block text-white text-center mt-2">
      이 웹사이트는 모바일 및 태블릿(~768px)에 최적화되어있습니다
    </div>
    <main class="p-2 max-w-screen-md mx-auto container">
      <router-view />
    </main>
    <footer class="container mx-auto flex flex-col items-center py-2 mb-2">
      <div class="text-sm text-white">Today: {{ visitCount }}</div>
      <a
        href="https://github.com/Guest-01/trybit"
        class="text-black text-base underline flex items-center"
        ><span class="iconify" data-icon="logos:github-icon"></span>GitHub</a
      >
    </footer>
  </div>
</template>

<script>
import TheHeader from "./components/TheHeader.vue";
import axios from "axios";
import { doc, increment, setDoc, getDoc } from "@firebase/firestore";
import { db } from "./firebase/config";
import moment from "moment";

export default {
  name: "App",
  components: {
    TheHeader,
  },
  data() {
    return {
      visitCount: 0,
    };
  },
  methods: {
    async addCounter() {
      const res = await axios.get("https://api.ipify.org?format=json");
      const { ip } = res.data;
      console.log("visitor ip:", ip);
      const now = moment().format("YYYYMMDD");
      await setDoc(
        doc(db, "visitors", now),
        {
          [ip]: increment(1),
        },
        { merge: true }
      );
    },
    async loadCounter() {
      const now = moment().format("YYYYMMDD");
      const docRef = doc(db, "visitors", now);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        Object.values(data).forEach((visits) => {
          this.visitCount += visits;
        });
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document! (visitors)");
      }
    },
  },
  async created() {
    this.$store.dispatch("openSocket");
    await this.addCounter();
    await this.loadCounter();
    console.log("counter done");
  },
};
</script>

<style>
@import "@/assets/base.css";
</style>
