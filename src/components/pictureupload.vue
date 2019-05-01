<template>

    <div :style="'width:'+headImgwidth+'px;height:'+headImgheight+'px;'">
        <div @click="cropperShow" @mouseover="editshow='block'" @mouseout="editshow='none'" :style="' cursor: pointer;position: relative;width:'+headImgwidth+'px;height:'+headImgheight+'px;border-radius:'+borderRadius+'%;overflow:hidden;border:'+borderSize+'px solid '+borderColor ">
            <span class="edit-mask" :style="'height: '+headImgheight/3+'px;line-height: '+headImgheight/3+'px;display:'+editshow" >更换头像</span>
            <img :style="'width:'+headImgwidth+'px;height:'+headImgheight+'px;'" :src="headImg" alt="头像">
        </div>
        <Card class="cropper" :style="'display:'+cardshow">
            <p slot="title">
                修改头像
            </p>
            <Button icon="md-close" size="small" slot="extra" @click="cropperHidden"></Button>
            <Row>
                <i-col span="14" style="width: 260px;height: 260px;"  >
                    <vue-cropper
                    ref="cropper"
                    :img="option.img"
                    :outputSize="option.size"
                    :outputType="option.outputType"
                    :info="true"
                    :full="option.full"
                    :canMove="option.canMove"
                    :canMoveBox="option.canMoveBox"
                    :original="option.original"
                    :autoCrop="option.autoCrop"
                    :autoCropWidth="option.autoCropWidth"
                    :autoCropHeight="option.autoCropHeight"
                    :fixedBox="option.fixedBox"
                    @realTime="realTime"
                    @imgLoad="imgLoad"
                    ></vue-cropper>
                </i-col>
                <i-col span="10">
                    <Row type="flex" justify="space-around" style="margin-top: 10px">
                        <i-col span="5">
                            <label  class="ivu-btn ivu-btn-primary" for="uploads" >选择图片</label>
                            <input type="file" id="uploads"  style="position:absolute; clip:rect(0 0 0 0);"  :value="imgFile"  accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg">
                        </i-col>
                        <i-col span="5">
                            <Button @click="finish()">确定头像</Button>
                        </i-col>
                    </Row>
                    <Row type="flex" justify="space-around" style="margin-top: 10px">
                        <i-col span="5">
                            <Button size="small"  style="line-height: 15px;width:30px;height:30px;font-size: 18px;font-weight: bolder" @click="changeScale(1)">+</Button>
                        </i-col>
                        <i-col span="5">
                            <Button size="small"  style="line-height: 15px;width:30px;height:30px;font-size: 18px;font-weight: bolder" @click="changeScale(-1)">-</Button>
                        </i-col>
                    </Row>
                    <Row type="flex" justify="space-around" style="margin-top: 10px">
                        <i-col span="5">
                            <Button size="small" style="line-height: 15px;width:30px;height:30px;font-size: 18px;font-weight: bolder" @click="rotateLeft">↺</Button>
                        </i-col>
                        <i-col span="5">
                            <Button size="small"  style="line-height: 15px;width:30px;height:30px;font-size: 18px;font-weight: bolder" @click="rotateRight">↻</Button>
                        </i-col>
                    </Row>
                    <div style="margin-left:20px;">
                        <div class="show-preview" :style="{'width': '150px', 'height':'155px',  'overflow': 'hidden', 'margin': '5px'}">
                            <div :style="previews.div" class="preview">
                                <img :src="previews.url" :style="previews.img">
                            </div>
                        </div>
                    </div>
                </i-col>
            </Row>
        </Card>
    </div>
</template>

<script>
    import { VueCropper }  from 'vue-cropper'
    export default {
        name: "pictureupload",
        components:{
            'vue-cropper':VueCropper,
        },
        data() {
            return {
                //剪切图片上传
                headImg:'',
                crap: false,
                editshow:'none',
                cardshow:'none',
                previews: {},
                option: {
                    img: '',
                    outputSize:1, //剪切后的图片质量（0.1-1）
                    full: false,//输出原图比例截图 props名full
                    outputType: 'png',
                    canMove: true,
                    original: false,
                    canMoveBox: true,
                    autoCrop: true,
                    autoCropWidth: 150,
                    autoCropHeight: 150,
                    fixedBox: true
                },
                fileName:'',  //本机文件地址
                downImg: '#',
                imgFile:'',
                uploadImgRelaPath:'', //上传后的图片的地址（不带服务器域名）
            }
        },
        props: {
            headImage: {
                type: [String],
                default: ''
            },
            headImgwidth: {
                type: [Number],
                default: 100
            },
            headImgheight: {
                type: [Number],
                default: 100
            },
            borderSize:{
                type: [Number],
                default: 1
            },
            borderColor:{
                type: [String],
                default: '#ddd'
            },
            borderRadius:{
                type: [Number],
                default: 50
            },
            onSuccess: {
                type: Function,
                default: (data) => {
                    console.info(data)
                }
            },
        },
        methods: {
            cropperShow(){
                this.cardshow='block'
            },
            cropperHidden(){
                this.cardshow='none'
                this.option= {
                        img: '',
                        outputSize:1, //剪切后的图片质量（0.1-1）
                        full: false,//输出原图比例截图 props名full
                        outputType: 'png',
                        canMove: true,
                        original: false,
                        canMoveBox: true,
                        autoCrop: true,
                        autoCropWidth: 150,
                        autoCropHeight: 150,
                        fixedBox: true
                }
                this.$refs.cropper.refresh()
            },
            //放大/缩小
            changeScale(num) {
                console.log('changeScale')
                num = num || 1;
                this.$refs.cropper.changeScale(num);
            },
            //坐旋转
            rotateLeft() {
                console.log('rotateLeft')
                this.$refs.cropper.rotateLeft();
            },
            //右旋转
            rotateRight() {
                console.log('rotateRight')
                this.$refs.cropper.rotateRight();
            },
            //上传图片（点击上传按钮）
            finish() {
                console.log('finish')
                // 输出
                this.$refs.cropper.getCropData((data) => {
                    this.headImg = data;
                    this.onSuccess(data);
                    this.cropperHidden()
                })
            },
            // 实时预览函数
            realTime(data) {
                this.previews = data
            },
            //选择本地图片
            uploadImg(event) {
                console.log('uploadImg');
                var _this = this;
                if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(event.target.value)) {
                    _this.$Message.error('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
                    _this.imgFile=''
                    return false
                }
                //上传图片
                var file = event.target.files[0]
                _this.fileName = file.name;

                var reader = new FileReader();
                reader.onload =(event) => {
                    let data;
                    data = event.target.result
                    _this.option.img = data
                }
                // 转化为base64
                reader.readAsDataURL(file)

            },
            imgLoad (msg) {
                console.log('imgLoad')
                console.log(msg)
            }
        },
        created () {
            this.headImg = this.headImage
        },

    }
</script>

<style lang="less" scoped>
    .cropper{
        width: 500px;
        height: 350px;
        position:fixed;
        left: 0;
        right: 0;
        top: 200px;
        margin:0 auto;
        z-index: 1000;
    }

    .show-preview{
        display: flex;
        display: -webkit-flex;
        justify-content: flex-end;
        -webkit-justify-content: flex-end;
        flex: 1;
        -webkit-flex: 1;
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        -webkit-justify-content: center;
        .preview{
            overflow: hidden;
            border-radius: 50%;
            border:1px solid #cccccc;
            background: #cccccc;
            margin-left: 40px;
        }
    }
    .show-preview .preview {margin-left: 0;}
    .edit-mask{
        width: 100%;
        position: absolute;
        text-align: center;
        background: #000;
        color: #fff;
        opacity: .6;
        bottom: 0;left: 0;right: 0;margin:0 auto;
    }
</style>
