<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode';

export default {
  name: 'app',
  created() {
    // 重新获取登录用户的信息
    this.getAdminInfo()
  },
  methods: {
    getAdminInfo: function () {
      if (!localStorage.getItem('adminToken')) {
        return;
      }
      const decoded = jwtDecode(localStorage.getItem('adminToken'));
      this.$store.dispatch('setAdminInfo', decoded);
    }
  }

}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}

#app {
  color: #2c3e50;
  height: 100vh;
  overflow: hidden;
}

</style>
