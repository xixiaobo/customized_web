<template>
    <div>
        <div style="text-align: left;margin: -20px 0 10px 15px">
            <Button size="small" type="primary" @click="$router.back(-1)">
                <Icon type="ios-arrow-back" />
                返回
            </Button>
        </div>
        <Card>
            <Row>
                <i-col span="8">
                    <img name="hava" :src="defaultimage"
                         v-if="product.defaultImage === null||product.defaultImage === 'null'" width="200px" height="200px">
                    <img name="no" :src="product.defaultImage" v-else width="200px" height="200px">
                </i-col>
                <i-col span="15">
                    产品名称: {{product.productname}}<br/>
                    产品描述: {{product.productabstract}}<br/>
                    所属分类: {{product.classname}}<br/>
                    所属用户: {{product.username}}<br/>
                    <Rate v-model="product.productscore" show-text allow-half disabled v-if="isscore"/>
                    <Poptip confirm transfer
                            :title="'打分为'+score+'星?'"
                            @on-ok="ok"
                            @on-cancel="cancel" v-else>
                        <Rate v-model="score" show-text allow-half/>
                    </Poptip>
                </i-col>
            </Row>
            <Row>
                <i-col >
                    <card style="width: 350px;margin: 0 auto" v-if="images.length>0">
                        <Carousel autoplay model=0  radius-dot :autoplay-speed="4000" style="width: 300px">
                            <CarouselItem v-for="(item,index)  in images" :key="index">
                                <div class="demo-carousel"><img :src="item.imagebase64" height="200" width="200"/></div>
                            </CarouselItem>
                        </Carousel>
                    </card>
                </i-col>
            </Row>
            <Row>
                <i-col> <div v-html='product.content'></div></i-col>
            </Row>


        </Card>
       <Card>
           <Row class="edit_container" style="height: 300px">
               <quill-editor
                       v-model="message.content"
                       ref="myQuillEditor"
                       :options="editorOption" style="height: 200px;">
               </quill-editor>
           </Row>
           <Row style="margin-bottom: 20px" v-if="$store.state.islogin">
               <Button @click="handleReset">重置</Button>
               <Button style="margin-left: 8px" type="primary" @click="handleSubmit">留言</Button>
           </Row>
           <Row style="margin-bottom: 20px" v-else>
               <Button @click="$router.push({
					path: '/login',
                    query: {redirect: $route.path}
				})">请登录后留言</Button>
           </Row>
           <Row>
           <Spin fix v-if="loading"></Spin>
           <Card v-if="data1.length===0" >
             暂无留言
           </Card>
           <Card style="text-align: left" v-for="(item,index)  in data1" :key="index">
               <div slot="title">
                   <Row>
                       <i-col span="1">
                           <Avatar :src="item.userimg" />
                       </i-col>
                       <i-col span="1" style="margin-left:10px;text-align: center;line-height: 30px">
                           {{item.username}}
                       </i-col>
                   </Row>
               </div>
               <div slot="extra" v-if="item.userid===onlyuser.id || onlyuser.role==='admin'">
                   <Button type="error" ghost @click="deleteMessage(item.id)">删除</Button>
               </div>
               <div v-html='item.content' style="padding: 10px"></div>
               <hr style="margin-top: 10px;margin-bottom: 3px"/>
               <Row style="text-align: right"> 发表时间：{{item.createtime}}</Row>
           </Card>
           </Row>
           <Row>
               <Page style="margin-top: 10px;float: right;" :total="pagetotal" :page-size="pagesize" @on-change="changepage" @on-page-size-change="changepagesize" show-elevator show-total show-sizer/>
           </Row>
       </Card>

    </div>
</template>

<script>
    export default {
        name: "productDetails",
        data(){
            return{
                /* global require */
                defaultimage:require("../../../assets/productonerror.jpg"),
                productid:'',
                product:{},
                message:{
                    "content": "",
                    "productid": this.$route.params.id,
                    "userid": ""
                },
                editorOption: {},
                images:[],
                score:0.0,
                isscore:true,
                pagetotal: 0,
                page: 0,
                pagesize: 10,
                data1: [],
                loading: false,
                onlyuser:{},
            }
        },
        methods: {
            ok () {
                let vm = this
                vm.$axios.get("/productManage/updataProductscore", {
                    params:{
                        productId : vm.productid,
                        score : vm.score,
                        userid : vm.onlyuser.id
                    }
                }).then(function (data) {
                    let code = data.data.code
                    if (code === '1') {
                        vm.$Message.success('产品评星成功!');
                        vm.getproduct()
                        vm.isscore=true
                    } else {
                        vm.$Message.error('产品评星失败!');
                        vm.$Message.error(data.data.message);
                    }
                }).catch(function (error) {
                    vm.$Message.error(error);
                })

            },
            cancel () {
                let vm = this
                vm.score=0.0
            },
            handleReset(){
                this.message.content=''
            },
            handleSubmit(){
                let vm=this
                vm.message.userid=vm.onlyuser.id
                vm.$axios.post("/messageManage/addMessage",vm.message).then(function (data) {
                    let code = data.data.code
                    if (code === '1') {
                        vm.$Message.success('留言成功!');
                        vm.message.content=''
                        vm.getMessage()
                    } else {
                        vm.$Message.error('产品信息查询失败!');
                        vm.$Message.error(data.data.message);
                    }
                }).catch(function (error) {
                    vm.$Message.error(error);
                })
            },
            getproduct(){
                let vm =this
                vm.$axios.get("/productManage/getProductById", {
                  params:{
                      productid:vm.productid
                  }
                }).then(function (data) {
                  let code = data.data.code
                  if (code === '1') {
                      vm.product=data.data.result.product
                      vm.images=data.data.result.images
                  } else {
                      vm.$Message.error('产品信息查询失败!');
                      vm.$Message.error(data.data.message);
                  }
                }).catch(function (error) {
                  vm.$Message.error(error);
                })
            },
            getscore(){
                let vm =this
                vm.$axios.get("/productManage/JudgingWhetherUsersScoreOrNot", {
                    params:{
                        id:vm.productid,
                        userid:vm.onlyuser.id
                    }
                }).then(function (data) {
                    let code = data.data.code
                    if (code === '1') {
                        vm.isscore=data.data.ishave
                        if (vm.isscore) {
                            vm.score=data.data.score
                        }
                    }else {
                        vm.isscore=false
                    }
                }).catch(function (error) {
                    vm.$Message.error(error);
                    vm.isscore=false
                })
            },
            changepage(page) {
                this.page = page
                this.getMessage()
            },
            changepagesize(pagesize) {
                this.pagesize = pagesize
                this.getMessage()
            },
            getMessage() {
                let vm=this
                vm.loading = true
                vm.$axios.get('/messageManage/getMessageByProductId', {
                    params:{
                        ispage: true,
                        pageNum: this.page,
                        pageSize: this.pagesize,
                        productId : this.productid
                    }
                }).then(function (data) {
                    let code = data.data.code
                    if (code === 1) {
                        vm.loading = false
                        vm.data1 = data.data.result.list
                        vm.pagetotal = data.data.result.total
                    } else {
                        vm.$Message.error('留言查询失败失败!');
                        vm.$Message.error(data.data.message);
                    }
                }).catch(function (error) {
                    vm.$Message.error(error);
                })
            },
            deleteMessage(id){
                let vm = this
                vm.$axios.delete('/messageManage/deleteMessage/'+id).then(function (data) {
                    let code = data.data.code
                    if (code === '1') {
                        vm.$Message.success('留言删除成功!');
                        vm.getMessage()
                    } else {
                        vm.$Message.error('留言删除失败!');
                        vm.$Message.error(data.data.message);
                    }
                }).catch(function (error) {
                    vm.$Message.error(error);
                })
            },
            init(){
                let vm = this
                vm.productid=vm.$route.params.id
                if(vm.$store.state.islogin){
                    vm.onlyuser=vm.$store.state.user
                    vm.getscore()
                }
                vm.getproduct()
                vm.getMessage()
            }
        },
        created() {
            this.init()
        }

    }
</script>

<style scoped>

</style>
