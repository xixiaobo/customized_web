<template>
    <div>
        <Button @click="icomode=true">更换ico</Button>
        <br>
        <Input v-model="webTitle" placeholder="default size" style="width: 150px" /> <Button @click="uodataTitle">更换网站名称</Button>
        <br>
        <Button @click="logomode=true">更换网站logo</Button>
        <br>
        <Button @click="indexmode=true">更换首页轮播图片</Button>
        <br>
        <Button @click="loginmode=true">更换登录验证图片</Button>

        <Modal title="修改ico" v-model="icomode">
            <div class="demo-upload-list">
                <template>
                    <img :src="IcoImage" v-if="IcoImage!==''">
                    <img alt="未知" v-else>
                    <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(IcoImage)"></Icon>
                        <Icon type="md-build" @click.native="IcoImageChange"></Icon>
                    </div>
                </template>
            </div>
            <vue-mycropper v-if="isIcoImage" :onClear="icoClear" :imgType="'ico'" :generateWidth=64 :generateHeight=64  :onSuccess="IcoImageAdd" style="margin: 0 auto"></vue-mycropper>
            <div slot="footer">
                <Button @click="icoReturn" style="margin-left: 8px">返回</Button>
                <Button type="primary" @click="updateIco">修改</Button>
            </div>
        </Modal>
        <Modal title="更换网站logo" v-model="logomode">
            <div class="demo-upload-list">
                <template>
                    <img :src="logoImage" v-if="logoImage!==''">
                    <img alt="未知" v-else>
                    <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(logoImage)"></Icon>
                        <Icon type="md-build" @click.native="logoImageChange"></Icon>
                    </div>
                </template>
            </div>
            <vue-mycropper v-if="islogoImage" :onClear="logoClear" :imgType="'png'" :generateWidth=100 :generateHeight=60  :onSuccess="logoImageAdd" style="margin: 0 auto"></vue-mycropper>
            <div slot="footer">
                <Button @click="logoReturn" style="margin-left: 8px">返回</Button>
                <Button type="primary" @click="updateLogo">修改</Button>
            </div>
        </Modal>
        <Modal title="更换首页轮播图片" v-model="indexmode">
            <div class="demo-upload-list" v-for="(item,index)  in webIndexImgs" :key="index">
                <template>
                    <img :src="item" />
                    <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="indexImgRemove(index)"></Icon>
                    </div>
                </template>
            </div>
            <Icon type="ios-camera" style="width: 58px;height:58px;line-height: 58px;" size="20" @click="addindexImgs"></Icon>
            <vue-mycropper v-if="isindexImage" :onClear="indexClear" :imgType="'jpeg'" :generateWidth=150 :generateHeight=100  :onSuccess="indexImageAdd" style="margin: 0 auto"></vue-mycropper>
            <div slot="footer">
                <Button @click="indexReturn" style="margin-left: 8px">返回</Button>
                <Button type="primary" @click="updateIndex">修改</Button>
            </div>
        </Modal>
        <Modal title="更换登录验证图片" v-model="loginmode">
            <div class="demo-upload-list" v-for="(item,index)  in webLoginImgs" :key="index">
                <template>
                    <img :src="item" />
                    <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="loginImgRemove(index)"></Icon>
                    </div>
                </template>
            </div>
            <Icon type="ios-camera" style="width: 58px;height:58px;line-height: 58px;" size="20" @click="addloginImgs"></Icon>
            <vue-mycropper v-if="isloginImage" :onClear="loginClear" :imgType="'jpeg'" :generateWidth=200 :generateHeight=120  :onSuccess="loginImageAdd" style="margin: 0 auto"></vue-mycropper>
            <div slot="footer">
                <Button @click="loginReturn" style="margin-left: 8px">返回</Button>
                <Button type="primary" @click="updateLogin">修改</Button>
            </div>
        </Modal>
        <Modal title="展示图片" v-model="visible">
            <img :src="imgName" v-if="visible" style="width: 100%" alt="未知">
        </Modal>
    </div>
</template>

<script>
    import mycropper from '../components/mycropper.vue'
    export default {
        name: "test",
        components:{
            'vue-mycropper':mycropper,
        },
        data () {
            return{
                isIcoImage:false,
                islogoImage:false,
                isindexImage:false,
                isloginImage:false,
                visible:false,
                IcoImage:"http://127.0.0.1:8080/api/image/newfavicon.ico",
                logoImage:"",
                imgName:"",
                icomode:false,
                logomode:false,
                indexmode:false,
                loginmode:false,
                webdata:{
                    title:'web',
                    log:'',
                    indexImgs:[],
                    loginImgs:[]
                },
                webTitle:"",
                webLog:"",
                webIndexImgs:[],
                webLoginImgs:[]
            }
        },
        methods:{
            handleView (name) {
                this.imgName = name;
                this.visible = true;
            },
            IcoImageChange(){
                this.isIcoImage=true
            },
            logoImageChange(){
                this.islogoImage=true
            },
            addindexImgs(){
                this.isindexImage=true
            },
            addloginImgs(){
                this.isloginImage=true
            },
            IcoImageAdd(data){
                this.IcoImage=data
                this.isIcoImage=false
            },
            logoImageAdd(data){
                this.logoImage=data
                this.islogoImage=false
            },
            indexImageAdd(data){
                this.webIndexImgs.push(data)
                this.isindexImage=false
            },
            loginImageAdd(data){
                this.webLoginImgs.push(data)
                this.isloginImage=false
            },
            icoClear(){
                this.isIcoImage=false
            },
            logoClear(){
                this.islogoImage=false
            },
            indexClear(){
                this.isindexImage=false
            },
            loginClear(){
                this.isloginImage=false
            },
            icoReturn() {
                this.visible = false;
                this.icomode= false;
                this.isIcoImage=false;
                this.IcoImage="http://127.0.0.1:8080/api/image/newfavicon.ico"
            },
            logoReturn(){
                this.visible = false;
                this.logomode= false;
                this.islogoImage=false;
                this.logoImage=this.webdata.logoImage
            },
            indexReturn(){
                this.visible = false;
                this.indexmode= false;
                this.webIndexImgs=this.webdata.indexImgs
            },
            loginReturn(){
                this.visible = false;
                this.loginmode= false;
                this.webLoginImgs=this.webdata.loginImgs
            },
            updateIco() {
                let vm =this
                if(vm.IcoImage === "http://127.0.0.1:8080/api/image/newfavicon.ico"){
                    vm.$Message.warning('没有进行修改!');
                    return
                }
                let body={
                    "imageName":'newfavicon.ico',
                    "base64":vm.IcoImage,
                }
                vm.$axios.post("/uploadImage", body).then(function (data) {
                    let code = data.data.code
                    if (code === "1") {
                        vm.$Message.success('Success!');
                        vm.icomode = false;
                        location.reload()
                    } else {
                        vm.$Message.error('修改失败!');
                    }
                }).catch(function (error) {
                    vm.$Message.error(error);
                })
            },
            updateLogo(){
                let vm =this
                vm.webdata.logoImage=vm.logoImage
                vm.updataWebData()
            },
            updateIndex(){
                let vm =this
                vm.webdata.indexImgs=vm.webIndexImgs
                vm.updataWebData()
            },
            updateLogin(){
                let vm =this
                vm.webdata.loginImgs=vm.webLoginImgs
                vm.updataWebData()
            },
            updataWebData(){
                let vm =this
                vm.$axios.post("/writeJSON/webData.json", vm.webdata).then(function (data) {
                    let code = data.data.code
                    if (code === "1") {
                        vm.$Message.success('Success!');
                        vm.loginmode = false;
                        vm.getData()
                    } else {
                        vm.$Message.error('修改失败!');
                    }
                }).catch(function (error) {
                    vm.$Message.error(error);
                })
            },
            indexImgRemove (index) {
                this.webIndexImgs.splice(index, 1);
            },
            loginImgRemove (index) {
                this.webLoginImgs.splice(index, 1);
            },
            getData(){
                let vm=this
                vm.$axios.get("readJSON/webData.json").then(function (data) {
                    let code=data.data.code
                    if (code==='1'){
                        vm.webdata=data.data.result
                        vm.$store.commit('setWebData',data.data.result)
                        vm.webTitle=vm.webdata.title
                        vm.webIndexImgs=vm.webdata.indexImgs
                        vm.webLoginImgs=vm.webdata.loginImgs
                        vm.logoImage=vm.webdata.logoImage

                    }else {
                        vm.$Message.error("未初始化");
                    }
                }).catch(function (error) {
                    vm.$Message.error(error);
                })
            },
            updataData(){
                let vm=this
                vm.$axios.post("writeJSON/webData.json",vm.webdata).then(function (data) {
                    let code=data.data.code
                    if (code==='1'){
                        vm.$Message.success('修改成功!');
                        vm.getData()
                    } else {
                        vm.$Message.error('修改失败，请重试!');
                    }
                }).catch(function (error) {
                    vm.$Message.error(error);
                })
            },
            uodataTitle(){
                let vm = this
                vm.webdata.title= vm.webTitle
                vm.updataData()
                vm.$router.go(0);
            }
        },
        created() {
            this.getData();
        },
    }
</script>

<style scoped>
    .demo-upload-list{
        display: inline-block;
        width: 150px;
        height: 100px;
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
