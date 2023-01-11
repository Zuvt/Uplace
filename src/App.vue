<template>
  <div class="w-full max-w-screen-lg m-auto md:h-screen">
    <div class="top-bar">
      <a class="logo" href="/">UPlace</a>

      <NavBar class="hidden md:flex" />
      <div
        @click="menuOn = !menuOn"
        class="flex text-white text-right md:hidden items-center"
      >
        <span class="uppercase text-gray-200 text-sm font-medium mr-2"
          >menu</span
        >
        <MenuIcon class="h-7 w-7" v-show="!menuOn" />
        <XIcon class="h-7 w-7" v-show="menuOn" />
      </div>
    </div>
    <NavBarMobile v-show="menuOn" @hide="hideMenu" />
    <div class="h-min">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NavBarMobile from "./components/NavBarMobile.vue";
import { MenuIcon, XIcon } from "@heroicons/vue/solid";
import NavBar from "./components/NavBar.vue";
export default {
  components: { NavBarMobile, MenuIcon, XIcon, NavBar },
  data() {
    return {
      menuOn: false,
      hideMenu: () => {
        this.menuOn = !this.menuOn;
      },
    };
  },
  methods: {},
};
</script>

<style lang="css" scoped>
.logo {
  @apply text-xl text-white font-bold uppercase ml-6;
}

.top-bar {
  @apply bg-gradient-to-b to-cyan-600 from-sky-600 px-2 py-2 flex justify-between border-b-2 border-yellow-500 pr-6;
}
</style>
