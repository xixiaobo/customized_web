<template >
    <div class="layout">
        <Row>
            <i-col span="18" push="3">
                <Layout>
                    <Header>
                        <Menu mode="horizontal" theme="dark" active-name="1" @on-select="open">
                            <div style="float: left;width: 100px;color: white">
                                logo
                            </div>
                            <div>
                                <MenuItem name="1" to="/home">
                                    <Icon type="ios-home-outline" />
                                    首页
                                </MenuItem>
                                <MenuItem name="2" to="/">
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

                                <MenuItem name="注册" style="float: right" >
                                    注册
                                </MenuItem>
                                <MenuItem name="登录" style="float: right">
                                    登录
                                </MenuItem>
                            </div>

                        </Menu>
                    </Header>
                    <Content :style="{padding: '10px 5px'}">
                        <router-view />
                    </Content>
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
                if (nodesc === '4') {
                    this.$Notice.open({
                        title: '未完成',
                        desc: '后台功能暂时未做'
                    });
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