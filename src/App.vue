<template>
  <div id="app"  >
    <div v-wechat-title="$store.state.webdata.title"></div>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data(){
      return{
        tite :'dsas'
      }
    },
    methods:{
      getData(){
        let vm=this
        vm.$axios.get("readJSON/webData.json").then(function (data) {
          let code=data.data.code
          if (code==='1'){
            vm.$store.commit('setWebData',data.data.result)
          }else {
            vm.$Message.error("未初始化");
          }
        }).catch(function (error) {
          vm.$Message.error(error);
        })
      },
    },
    created () {
      this.getData()
      //在页面加载时读取sessionStorage里的状态信息
      if (sessionStorage.getItem("store") ) {
        this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
      }

      //在页面刷新时将vuex里的信息保存到sessionStorage里
      window.addEventListener("beforeunload",()=>{
        sessionStorage.setItem("store",JSON.stringify(this.$store.state))
      })

    }
  }

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #F5F7F9;
}
</style>
