<template>
  <nav class="w-min mr-6">
    <router-link to="/" active-class="active-nav" class="nav-link"
      ><HomeIcon class="nav-icon" />accueil</router-link
    >

    <router-link to="/about" active-class="active-nav" class="nav-link"
      ><ChatAltIcon class="nav-icon" />Apropos</router-link
    >
  </nav>
</template>
<style scoped>
.nav-link {
  @apply flex text-sm uppercase font-semibold px-2  whitespace-nowrap hover:shadow-md text-center rounded-md text-gray-200  transition ease-in-out delay-75 items-center hover:ring-2 hover:ring-white mx-1;
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
