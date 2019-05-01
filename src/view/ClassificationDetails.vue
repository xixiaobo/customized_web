<template>
    <div>
        <card style="margin-bottom: 20px;margin-top: 10px;font-family: '黑体';font-size: 14px;    ">
            <Row style="margin-left: 20px">
                <i-col span="2" :class="{'colordisplay':sortfield==='createtime'}" style="cursor:pointer;margin-top: 6px" id="time" @click.native="time('createtime')">
                    <Row >
                        <i-col span="15" >按时间</i-col>
                        <i-col span="2" v-if="sortfield==='createtime'"  style="line-height:15px">
                            <Icon type="md-arrow-dropup" v-if="sortingdirection==='ASC'"/>
                            <Icon type="md-arrow-dropdown" v-else/>
                        </i-col>
                    </Row>
                </i-col>
                <i-col span="2" :class="{'colordisplay':sortfield==='productscore'}" style="cursor:pointer;margin-top: 6px" id="hot" @click.native="time('productscore')">
                    <Row>
                        <i-col span="15">按评分</i-col>
                        <i-col span="2" v-if="sortfield==='productscore'"  style="line-height:15px">
                            <Icon type="md-arrow-dropup" v-if="sortingdirection==='ASC'"/>
                            <Icon type="md-arrow-dropdown" v-else/>
                        </i-col>
                    </Row>
                </i-col>
                <i-col span="2" offset="1"  style="margin-top: 6px">
                    分类：
                </i-col>
                <i-col span="2"  style="width:150px" >
                    <Select v-model="classifyselect" clearable filterable @on-change="getmeroproduct" >
                        <Option v-for="item in classify" :value="item.id" :key="item.id">{{ item.classname }}</Option>
                    </Select>
                </i-col>
                <i-col span="2" offset="5" style="width: 200px">
                    <Input v-model="productselect" @on-enter="getmeroproduct" placeholder="商品名称" clearable  />
                </i-col>
                <i-col span="1">
                    <Button  icon="ios-search"  @click="getmeroproduct"></Button>
                </i-col>
            </Row>
        </card>
        <card v-if="products.length===0">没有产品</card>
        <Row type="flex" justify="space-around" style="margin-left: 20px" v-else>
            <i-col span="4"  style="width: 250px;height: 270px" v-for="p in products" :key="p.id" >
                <router-link :to="'/productDetails/'+p.id" style="color: black">
                <card style="width: 250px;height: 270px" >
                    <Row>
                        <i-col>
                            <img name="hava" :src="defaultimage"
                                 v-if="p.defaultImage === null||p.defaultImage === 'null'" width="200px" height="200px">
                            <img name="no" :src="p.defaultImage" v-else width="200px" height="200px">
                        </i-col>
                        <i-col>
                            <ul>
                                <li>
                                    {{p.productname}}
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
                sortfield:"createtime",
                sortingdirection:'DESC',
                classifyselect:"",
                productselect:''
            }
        },
        methods: {
            time:function (name) {
                let vm=this
                if (vm.sortfield===name){
                   if (vm.sortingdirection==='DESC'){
                       vm.sortingdirection='ASC'
                   } else {
                       vm.sortingdirection='DESC'
                   }
                } else{
                    vm.sortfield=name
                    vm.sortingdirection='DESC'
                }
                this.getmeroproduct()
            },
            init() {
                this.getClass()
                this.getmeroproduct()
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
            getmeroproduct(){
                let vm=this
                if(vm.classifyselect===undefined){
                    vm.classifyselect=''
                }
                let body={
                    "productname":vm.productselect,
                    "classid":vm.classifyselect,
                    "sortfield": vm.sortfield,
                    "sortingdirection": vm.sortingdirection
                }
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
        created() {
            this.init()
        }
    }
</script>

<style scoped>
    .colordisplay {
        color: red;
    }
    li {list-style-type:none;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;}
</style>
