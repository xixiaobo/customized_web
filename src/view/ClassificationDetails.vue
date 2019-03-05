<template>
    <div>
        <card style="margin-bottom: 20px;margin-top: 10px;font-family: '黑体';font-size: 14px;    ">
            <Row style="margin-left: 20px">
                <i-col span="2" :class="{'colordisplay':timeselect}" style="cursor:pointer;" id="time" @click.native="time('time')">
                    <Row >
                        <i-col span="15" >按时间</i-col>
                        <i-col span="2" v-if="timeselect=== true"  style="line-height:15px">
                            <Icon type="md-arrow-dropup" v-if="timeadta===true"/>
                            <Icon type="md-arrow-dropdown" v-else/>
                        </i-col>
                    </Row>
                </i-col>
                <i-col span="2" :class="{'colordisplay':hotselect}" style="cursor:pointer;" id="hot" @click.native="time('hot')">
                    <Row>
                        <i-col span="15">按人气</i-col>
                        <i-col span="2" v-if="hotselect=== true"  style="line-height:15px">
                            <Icon type="md-arrow-dropup" v-if="hotdata===true"/>
                            <Icon type="md-arrow-dropdown" v-else/>
                        </i-col>
                    </Row>
                </i-col>
            </Row>
        </card>
        <card v-if="products.length===0">没有产品</card>
        <Row :gutter="30" style="margin-left: 20px" v-else>

            <i-col span="11" v-for="p in products" :key="p .num">
                <card>
                    <Row>
                        <i-col span="6">
                            <img name="hava" :src="defaultimage"
                                 v-if="p.defaultImage === null||p.defaultImage === 'null'" width="50px" height="100px">
                            <img name="no" :src="p.defaultImage" v-else width="50px" height="100px">
                        </i-col>
                        <i-col span="18">
                            <ul>
                                <li>
                                    产品名称：{{p.productname}}
                                </li>
                                <li>
                                    产品介绍：{{p.content}}
                                </li>
                            </ul>
                        </i-col>
                    </Row>
                </card>
            </i-col>
        </Row>
        <BackTop></BackTop>
    </div>
</template>

<script>
    export default {
        name: "product",
        data() {
            return {
                /* global require */
                defaultimage:require("../assets/productonerror.jpg"),
                classifyid: "",
                classify:[],
                products:[],
                timeselect:false,
                hotselect:false,
                timeadta:false,
                hotdata:false,
            }
        },
        methods: {
            time:function (a) {
                let vm=this
                console.info(a)
                if (a==='time'){
                    if (vm.timeselect){
                        vm.timeadta=!vm.timeadta
                        let a=''
                        if (vm.timeadta) {
                            a='ASC'
                        }else {
                            a='DESC'
                        }
                        let body={
                            "sortfield": "createtime",
                            "sortingdirection": a
                        }
                        this.getmeroproduct(body)
                    }else {
                        vm.timeselect=true
                        vm.hotselect=false
                        vm.timeadta=false
                        vm.hotdata=false
                        let body={
                            "sortfield": "createtime",
                            "sortingdirection": "DESC"
                        }
                        this.getmeroproduct(body)
                    }
                } else if(a==='hot'){
                    if (vm.hotselect){
                        vm.hotdata=!vm.hotdata
                        let a=''
                        if (vm.hotdata) {
                            a='ASC'
                        }else {
                            a='DESC'
                        }
                        let body={
                            "sortfield": "productscore",
                            "sortingdirection": a
                        }
                        this.getmeroproduct(body)
                    }else {
                        vm.timeselect=false
                        vm.hotselect=true
                        vm.timeadta=false
                        vm.hotdata=false
                        let body={
                            "sortfield": "productscore",
                            "sortingdirection": "DESC"
                        }
                        this.getmeroproduct(body)
                    }
                }
            },
            init() {
                // if (this.$route.params.a === null || this.$route.params.a === 'null') {
                //     this.$router.go(-1)
                // }
                // this.classifyid = this.$route.params.a
                this.getClass()
                let body={
                    "sortfield": "createtime",
                    "sortingdirection": "DESC"
                }
                this.getmeroproduct(body)
                this.timeselect=true
                this.hotselect=false


            },
            getClass(){
                let vm=this
                vm.$axios.get("classifyManage/getAllClassify").then(function (data) {
                    let code=data.data.code
                    if (code===1){
                        vm.classify=data.data.result
                    } else {
                        vm.classify=[]
                        vm.$Notice.open({
                            title: '错误',
                            desc: '服务器出现故障请修理'
                        });
                    }
                }).catch(function (error) {
                    console.info(error)
                    // vm.data1=error.data
                })
            },
            getmeroproduct(body){
                let vm=this
                vm.$axios.post("productManage/getmeroProduct?ispage=false",body).then(function (data) {
                    let result=data.data.result
                    if (result.length>0){
                        vm.products=result
                    } else {
                        vm.products=[]
                    }
                }).catch(function (error) {
                    console.info(error)
                    // vm.data1=error.data
                })
            }
        },
        watch: {
            "$route": {
                handler() {
                    this.init()
                }
            }
        },
        created() {
            this.init()
        }
    }
</script>

<style scoped>
    .colordisplay {
        color: red;
    }
</style>