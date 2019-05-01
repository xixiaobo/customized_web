<template>
    <div>
        <card style="width: 500px;margin: 50px auto;" >
            <vue-pictureupload :headImage="formdata.userimg" :headImgwidth=100 :headImgheight="100" :onSuccess="updataHearImg" style="margin: 0 auto"></vue-pictureupload>
            <Form ref="formRegister" :model="formdata" :rules="ruleInline" style="width: 400px;margin: 50px auto">
                <FormItem label="注册类型" prop="role">
                    <Select v-model="formdata.role" placeholder="Select your role">
                        <Option v-for="item in permissionGroup" :value="item.label" :key="item.label">{{ item.value }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="登录名称" prop="username">
                    <Input type="text" v-model="formdata.username">
                    </Input>
                </FormItem>
                <FormItem label="登录密码" prop="password">
                    <Input type="password" v-model="formdata.password" >
                    </Input>
                </FormItem>
                <FormItem label="再次输入密码" prop="passwdCheck">
                    <Input type="password" v-model="formdata.passwdCheck"  >
                    </Input>
                </FormItem>
                <FormItem label="真实姓名" prop="realname">
                    <Input type="text" v-model="formdata.realname" >
                    </Input>
                </FormItem>
                <FormItem label="手机号" prop="phone">
                    <Input type="text"  v-model="formdata.phone"  >
                    </Input>
                </FormItem>
                <FormItem label="邮箱"  prop="email">
                    <Input type="text" v-model="formdata.email"  >
                    </Input>
                </FormItem>
                <FormItem>
                    <Button id="registerSubmit" type="primary" @click="registerSubmit">注册</Button>
                    <Button @click="registerReset" style="margin-left: 8px">重置</Button>
                </FormItem>
            </Form>
        </card>
    </div>
</template>

<script>
    import pictureupload from '../components/pictureupload.vue'

    export default {
        name: "register",
        components:{
            'vue-pictureupload':pictureupload,
        },
        data(){
            const validateUsername = (rule, value, callback) => {
                console.info(rule)
                console.info(value)
                let vm=this
                if (!value) {
                    return callback(new Error('登录名不能为空'));
                }

                vm.$axios.get("userManage/getUserByName",{
                    params:{
                        "userName":value
                    }
                }).then(function (data) {
                    if (data.data.code==='1'){
                        if (data.data.isHave===true){
                            callback(new Error('用户名已存在'));
                        } else {
                            callback();

                        }
                    } else {
                        callback(new Error('检验失败，请刷新重试'));
                    }
                }).catch(function (error) {
                    callback(new Error('检验失败，请刷新重试：'+error));
                })
            };
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.formdata.passwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formRegister.validateField('passwdCheck');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.formdata.password) {
                    callback(new Error('俩次密码不正确'));
                } else {
                    callback();
                }
            };
            const validatePhone = (rule, value, callback) => {
                var reg=11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
                if (value === '') {
                    callback(new Error('请输入手机号'));
                } else if (!reg.test(value)) {
                    callback(new Error('手机号码格式不正确!'));
                } else {
                    callback();
                }
            };
            return{
                formdata:{
                    username:'',
                    password:'',
                    userimg:'',
                    passwdCheck:'',
                    realname:'',
                    phone:'',
                    email:'',
                    role:'user'
                },
                permissionGroup: [
                    {
                        value: '创作人',
                        label: 'creators'
                    },
                    {
                        value: '消费用户',
                        label: 'consumer'
                    }
                ],
                ruleInline: {
                    username: [
                        { validator: validateUsername, trigger: 'blur' }
                    ],
                    role: [{
                        required: true,
                        message: '注册类型不能为空',
                        trigger: 'blur'
                    },
                        {
                            type: 'string'
                        }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { required: true, message: '请再一次输入密码', trigger: 'blur' },
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                    realname: [
                        { required: true, message: '请输入你的真实姓名', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { validator: validatePhone, trigger: 'blur' }
                    ],email: [{
                        required: true,
                        message: '邮箱不能为空！',
                        trigger: 'blur'
                    },
                        {
                            type: 'email',
                            message: '邮箱错误！',
                            trigger: 'blur'
                        }
                    ],
                }
            }
        },
        methods:{
            updataHearImg(data){
                this.formdata.userimg=data
            },
            registerSubmit (){
                let vm=this
                vm.$refs["formRegister"].validate((valid) => {
                    if (valid) {
                        let body=vm.formdata

                        vm.$axios.post("register",body).then(function (data) {
                            let code=data.data.code
                            if (code==='1'){
                                vm.$Message.success('注册成功，请登录!');
                                vm.$router.push({path:'/login'});
                            } else {
                                vm.$Message.error('注册失败，请重试!');
                                vm.$Message.error(data.data.message);
                            }
                        }).catch(function (error) {
                            vm.$Message.error(error);
                        })
                    }else {
                        vm.$Message.error('请输入注册信息!');
                    }
                })
            },
            registerReset(){
                this.$refs['formRegister'].resetFields();
            },
            getBase64(img) {
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, img.width, img.height);
                var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
                var dataURL = canvas.toDataURL("image/"+ext);
                return dataURL;
            }
        },
        created(){
            /* global require */
            let data=require("../assets/headerImg.json")
            this.formdata.userimg=data.img
        }
    }
</script>

<style scoped>

</style>
