<template>
       <Card dis-hover style="margin-top: 15px;">
           <p slot="title">
               添加产品
           </p>
           <Form ref="formProduct" :model="product" :rules="ruleProduct" :label-width="180" style="width: 600px;">
              <FormItem label="产品名称" prop="productname">
                   <i-input v-model="product.productname" placeholder="Enter your productname"></i-input>
               </FormItem>
               <FormItem label="分类" prop="classid">
                   <Select v-model="product.classid" placeholder="Select your role">
                       <Option v-for="item in classfiyGroup" :value="item.id" :key="item.id">{{ item.classname }}</Option>
                   </Select>
               </FormItem>
               <FormItem label="产品简介">
                   <Input type="textarea" v-model="product.productabstract"  placeholder="Enter your productabstract">
                   </Input>
               </FormItem>
               <FormItem label="产品封面图片" >
                   <div class="demo-upload-list" v-if="isdefaultImage">
                       <template>
                           <img :src="product.defaultImage">
                           <div class="demo-upload-list-cover">
                               <Icon type="ios-eye-outline" @click.native="handleView(product.defaultImage)"></Icon>
                               <Icon type="ios-trash-outline" @click.native="defaultImageRemove"></Icon>
                           </div>
                       </template>
                   </div>
                   <div v-if="isdefaultImage === false">
                       <Upload
                               ref="defaultImageUpload"
                               :show-upload-list="false"
                               :format="['jpg','jpeg','png']"
                               :max-size="2048"
                               :before-upload="defaultImageAdd"
                               multiple
                               type="drag"
                               action=""
                               style="display: inline-block;width:58px;">
                           <div style="width: 58px;height:58px;line-height: 58px;">
                               <Icon type="ios-camera" size="20"></Icon>
                           </div>
                       </Upload>
                   </div>

               </FormItem>
               <FormItem label="产品详情" >
               </FormItem>
               <div class="edit_container" style="margin-left: 100px;width: 700px;height: 270px;margin-bottom: 20px">
                       <quill-editor
                               v-model="product.content"
                               ref="myQuillEditor"
                               :options="editorOption" style="height: 200px;">
                       </quill-editor>
                   </div>
               <FormItem label="产品展示图片" >
                   <div class="demo-upload-list" v-for="(item,index)  in imagesList" :key="index">
                       <template>
                           <img :src="item">
                           <div class="demo-upload-list-cover">
                               <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                               <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                           </div>
                       </template>
                   </div>
                   <Upload
                           ref="imagesupload"
                           :show-upload-list="false"
                           :format="['jpg','jpeg','png']"
                           :max-size="2048"
                           :before-upload="imagesListAdd"
                           multiple
                           type="drag"
                           action=""
                           style="display: inline-block;width:58px;">
                       <div style="width: 58px;height:58px;line-height: 58px;">
                           <Icon type="ios-camera" size="20"></Icon>
                       </div>
                   </Upload>
               </FormItem>
               <FormItem>
                   <Button @click="handleReset('formProduct')">重置</Button>
                   <Button style="margin-left: 8px" type="primary" @click="handleSubmit('formProduct')">添加</Button>
               </FormItem>
           </Form>
           <Modal title="展示图片" v-model="visible">
               <img :src="imgName" v-if="visible" style="width: 100%">
           </Modal>
       </Card>
</template>

<script>

    export default {
        name: "addproduct",
        components: {
        },
        data () {
            return {
                product:{
                    "classid": 0,
                    "productabstract":"",
                    "content": "",
                    "defaultImage": "",
                    "productname": "",
                    "userid": "",
                },
                isdefaultImage:false,
                imgName: '',
                visible: false,
                imagesList: [],
                editorOption: {},
                ruleProduct: {
                    productname: [{
                        required: true,
                        message: '产品名称不能为空',
                        trigger: 'blur'
                    }],
                    classid: [{
                        required: true,
                        message: '分类不能为空',
                        type: 'number',
                        trigger: 'change'
                    }],
                },
                classfiyGroup:[],
            }
        },
        methods: {
            handleSubmit(name) {
                let vm = this
                vm.product.userid=vm.$store.state.user.id
                vm.$refs[name].validate((valid) => {
                    if (valid) {
                        let body = {
                            "product":vm.product,
                            "images":vm.imagesList
                        }
                        console.info(body)
                        vm.$axios.post("/productManage/addProduct", body).then(function (data) {
                            let code = data.data.code
                            if (code === '1') {
                                vm.$Message.success('产品添加成功!');
                                vm.product={
                                    "classid": 0,
                                        "productabstract":"",
                                        "content": "",
                                        "defaultImage": "",
                                        "productname": "",
                                        "userid": "",
                                }
                            } else {
                                vm.$Message.error('产品添加失败!');
                                vm.$Message.error(data.data.message);
                            }
                        }).catch(function (error) {
                            vm.$Message.error(error);
                        })
                    } else {
                        // this.$Message.error('Fail!');
                    }
                })
            },
            handleReset(name) {
                this.$refs[name].resetFields();
            },
            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            defaultImageRemove(){
                this.product.defaultImage=null
                this.isdefaultImage=false
            },
            defaultImageAdd(file){
                if (file.type!=="image/png"&&file.type!=="image/jpeg"&&file.type!=="image/jpg") {
                    this.$Notice.warning({
                        title: '这个文件的类型有误',
                        desc: '文件：' + file.name + ' 经检测类似不是jpg or png.'
                    });
                    return false
                }
                const check = this.imagesList.length < 1;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传1张图片.'
                    });
                    return false
                }
                let reader = new FileReader();
                let imgFile
                // let that = this
                reader.readAsDataURL(file)
                reader.onload = e => {
                    imgFile = e.target.result;
                    this.product.defaultImage=imgFile
                    this.isdefaultImage=true
                }
                return false
            },
            handleRemove (index) {
                this.imagesList.splice(index,1);
            },
            imagesListAdd (file) {
                if (file.type!=="image/png"&&file.type!=="image/jpeg"&&file.type!=="image/jpg") {
                    this.$Notice.warning({
                        title: '这个文件的类型有误',
                        desc: '文件：' + file.name + ' 经检测类似不是jpg or png.'
                    });
                    return false
                }
                const check = this.imagesList.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: '最多只能上传5张图片.'
                    });
                    return false
                }
                let reader = new FileReader();
                let imgFile
                // let that = this
                reader.readAsDataURL(file)
                reader.onload = e => {
                    imgFile = e.target.result;
                    this.imagesList.push(imgFile)
                }
                return false
            },
            getClassfiy(){
                let vm=this
                vm.$axios.get("classifyManage/getAllClassify").then(function (data) {
                    let code=data.data.code
                    if (code===1){
                        vm.classfiyGroup=data.data.result
                    } else {
                        vm.classfiyGroup=[]
                        vm.$Notice.open({
                            title: '错误',
                            desc: '服务器出现故障请修理'
                        });
                    }
                }).catch(function (error) {
                    console.info(error)
                    // vm.data1=error.data
                })
            }
        },
        // computed: {
        //     editor() {
        //         return this.$refs.myQuillEditor.quill;
        //     },
        // },
        created() {
            this.getClassfiy()

        }

    }
</script>

<style>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
