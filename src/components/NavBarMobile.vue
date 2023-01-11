<template>
  <nav
    class="w-full mr-6 bg-gradient-to-r from-sky-600 to-cyan-500 py-2 md:hidden"
  >
    <router-link
      @click="$emit('hide')"
      to="/"
      active-class="active-nav"
      class="nav-link"
      ><HomeIcon class="nav-icon" />Accueil</router-link
    >

    <router-link
      @click="$emit('hide')"
      to="/about"
      active-class="active-nav"
      class="nav-link"
      ><ChatAltIcon class="nav-icon" />Apropos</router-link
    >
  </nav>
</template>
<style scoped>
.nav-link {
  @apply flex text-sm uppercase font-semibold px-3  whitespace-nowrap hover:shadow-md items-center rounded-md text-gray-100  transition ease-in-out delay-75 items-center mt-1.5 ml-4 w-36 py-1 hover:ring-2 hover:ring-white;
}
.active-nav {
  @apply text-slate-600 bg-white;
}

.nav-icon {
  @apply inline-block h-5 w-5 mr-1;
}
</style>
<script>
import {
  HomeIcon,
  BriefcaseIcon,
  CubeIcon,
  ChatAltIcon,
} from "@heroicons/vue/solid";
export default {
  name: "NavBarMobile",
  components: { HomeIcon, BriefcaseIcon, CubeIcon, ChatAltIcon },
};
</script>
