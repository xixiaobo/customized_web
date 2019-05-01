<template >
    <div class="layout">
        <Row>
            <i-col span="18" push="3">
                <Layout>
                    <Header >
                        <Menu mode="horizontal" theme="dark" active-name="1" @on-select="open">
                            <div style="float: left;width: 100px;color: white">
                                <span v-if="$store.state.webdata.logoImage===null || $store.state.webdata.logoImage===undefined || $store.state.webdata.logoImage===''">
                                    logo
                                </span>
                                <img :src="$store.state.webdata.logoImage" alt="logo" style="width: 100px;height: 60px" v-else>
                            </div>
                            <div>
                                <MenuItem name="1" to="/home">
                                    <Icon type="ios-home-outline" />
                                    首页
                                </MenuItem>
                                <MenuItem name="2" to="/TaskationDetails">
                                    <Icon type="ios-paper-outline" />
                                    任务中心
                                </MenuItem>
                                <MenuItem name="3" :to="{path:'/classificationdetails?data='+(new Date()).toString()}">
                                    <Icon type="ios-photos-outline" />
                                    产品平台
                                </MenuItem>
                                <!--<Submenu name="3">-->
                                    <!--<template slot="title">-->
                                        <!--<Icon type="ios-photos-outline" />-->
                                        <!--产品展示-->
                                    <!--</template>-->
                                    <!--&lt;!&ndash;<MenuGroup title="使用">&ndash;&gt;-->
                                    <!--<MenuItem name="3-1" v-for="data in cheDatas" :key="data . keynum" ">{{data.classname}}</MenuItem>-->
                                    <!--&lt;!&ndash;</MenuGroup>&ndash;&gt;-->
                                <!--</Submenu>-->
                                <MenuItem name="4">
                                    <Icon type="md-heart-outline" />
                                    关于我们
                                </MenuItem>
                                <MenuItem name="注册" style="float: right" to="/register"  v-if="this.$store.state.islogin===false">
                                    注册
                                </MenuItem>
                                <MenuItem name="登录" style="float: right" to="/login" v-if="this.$store.state.islogin===false">
                                    登录
                                </MenuItem>

                                <MenuItem name="logout" style="float: right" v-if="this.$store.state.islogin===true">
                                    退出登录
                                </MenuItem>

                                <MenuItem name="用户" style="float: right" to="/backstage" v-if="this.$store.state.islogin===true">
                                    <Avatar :src="this.$store.state.user.userimg" />
                                </MenuItem>

                            </div>

                        </Menu>
                    </Header>
                    <Content :style="{margin: '70px 10px 20px 10px', minHeight: '71vh'}">
                        <router-view />
                    </Content>
                    <Footer style="height: 50px;text-align: center;margin-top: 10px;margin-bottom: 20px ">
                        蒙ICP备10000000号-1  蒙公网安备 100000000000000号 © 2019 XXXXXXXX版权所有
                    </Footer>
                </Layout>
            </i-col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: "index",
        data: function () {
            return {
                // cheDatas: [],
            };
        },
        methods: {
            open(nodesc) {
                let vm=this
                if (nodesc === '4') {
                    vm.$Notice.open({
                        title: '未完成',
                        desc: '后台功能暂时未做'
                    });
                }else if (nodesc === 'logout'){
                    vm.$store.commit('setUser',null)
                    vm.$router.push({path:'/home'});
                }
            },
            // initdata(){
            //     let vm=this
            //     vm.$axios.get("classifyManage/getAllClassify").then(function (data) {
            //         let result=data.data.result
            //         if (result.length>0){
            //             vm.cheDatas=result
            //         } else {
            //             vm.cheDatas=[{"id":null,"classname":"没有分类"}]
            //         }
            //     }).catch(function (error) {
            //         console.info(error)
            //         // vm.data1=error.data
            //     })
            // }
        },
        created() {
            // this.initdata()
        }
    }

</script>

<style scoped>

</style>
