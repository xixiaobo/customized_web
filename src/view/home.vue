<template>
    <div>
        <card style="width: auto">
            <Carousel autoplay model=0 loop radius-dot :autoplay-speed="setting.autoplaySpeed">
                <CarouselItem>
                    <div class="demo-carousel"><img src="../assets/logo.png" height="200" width="200"/></div>
                </CarouselItem>
                <CarouselItem>
                    <div class="demo-carousel"><img src="../assets/productonerror.jpg" height="200" width="200"/></div>
                </CarouselItem>
                <CarouselItem>
                    <div class="demo-carousel">3</div>
                </CarouselItem>
                <CarouselItem>
                    <div class="demo-carousel">4</div>
                </CarouselItem>
            </Carousel>
        </card>

        <h2 class="hm-title">
            <span style="text-align: right;float: left">最新产品</span>
            <a style="text-align: right;color: #337ab7;font-size: 13px;float: right;line-height: 30px" @click="test()">
            更多&nbsp;<Icon type="ios-more" />
            </a>
        </h2>
        <card v-if="newProductDatas.length===0">没有产品</card>
        <Row :gutter="30" style="margin-left: 20px" v-else>
            <i-col span="7" v-for="p in newProductDatas"   :key="p .num">
                <router-link :to="'/aa/'+p.id" style="color: black">
                <card >
                    <Row>
                        <i-col span="6">
                            <img name="hava" :src="defaultimage" v-if="p.defaultImage === null||p.defaultImage === 'null'" width="50px" height="100px">
                            <img name="no" :src="p.defaultImage" v-else  width="50px" height="100px">
                        </i-col>
                        <i-col span="18">
                            <ul>
                                <li>
                                    产品名称：{{p.productname}}
                                </li>
                                <li>
                                    产品介绍：{{p.content}}
                                </li>
                                <li>
                                    所属分类：{{p.classname}}
                                </li>
                                <li>
                                    <router-link to="/">{{p.username}}</router-link> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  <Rate disabled v-model="p.productscore" />
                                </li>

                            </ul>
                        </i-col>
                    </Row>
                </card>
                </router-link>
            </i-col>
        </Row>


        <h2 class="hm-title">
            <span style="text-align: right;float: left">评分最高</span>
            <a style="text-align: right;color: #337ab7;font-size: 13px;float: right;line-height: 30px" @click="test()">
                更多&nbsp;<Icon type="ios-more" />
            </a>
        </h2>
        <card v-if="hotProductDatas.length===0">没有产品</card>
        <Row :gutter="30" style="margin-left: 20px" v-else>
            <i-col span="7" v-for="p in hotProductDatas"   :key="p .num">
                <router-link :to="'/aa/'+p.id" style="color: black">
                    <card >
                        <Row>
                            <i-col span="6">
                                <img name="hava" :src="defaultimage" v-if="p.defaultImage === null||p.defaultImage === 'null'" width="50px" height="100px">
                                <img name="no" :src="p.defaultImage" v-else  width="50px" height="100px">
                            </i-col>
                            <i-col span="18">
                                <ul>
                                    <li>
                                        产品名称：{{p.productname}}
                                    </li>
                                    <li>
                                        产品介绍：{{p.content}}
                                    </li>
                                    <li>
                                        所属分类：{{p.classname}}
                                    </li>
                                    <li>
                                        <router-link to="/">{{p.username}}</router-link> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  <Rate disabled v-model="p.productscore" />
                                    </li>

                                </ul>
                            </i-col>
                        </Row>
                    </card>
                </router-link>
            </i-col>
        </Row>


    </div>
</template>
<script>
    export default {
        name: "home",
        data() {
            return {
                setting: {
                    autoplaySpeed: 4000,
                },
                /* global require */
                defaultimage:require("../assets/productonerror.jpg"),
                newProductDatas:[],
                hotProductDatas:[]
            }
        },
        methods:{
            test(){
                console.info("11111")
            },
            getNewProduct(){
                let vm=this
                vm.$axios.get("productManage/getNewProduct").then(function (data) {
                    let result=data.data.result
                    if (result.length>0){
                        vm.newProductDatas=result
                    } else {
                        vm.newProductDatas=[]
                    }
                }).catch(function (error) {
                    console.info(error)
                    // vm.data1=error.data
                })
            },
            getHotProduct(){
                let vm=this
                let body={
                    "sortfield": "productscore",
                    "sortingdirection": "DESC"
                }
                vm.$axios.post("productManage/getmeroProduct?ispage=false",body).then(function (data) {
                    let result=data.data.result
                    if (result.length>0){
                        for (let i=0;i<result.length;i++){
                            vm.hotProductDatas.push(result[i])
                        }
                    } else {
                        vm.products=[]
                    }
                }).catch(function (error) {
                    console.info(error)
                    // vm.data1=error.data
                })
            },
            init(){
                this.getNewProduct()
                this.getHotProduct()
            }
        },
        created() {
            this.init()
        }
    }
</script>

<style scoped>
 .hm-title{
     margin: 10px 0;
    font-size: 20px;
    border-left: solid 4px #FF6666;
    padding: 6px;
    background-color: white;
     overflow:hidden
    }
 li {list-style-type:none;
     overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;}
</style>