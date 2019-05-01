<template>
    <!-- 账户增加 -->
    <Card dis-hover style="margin-top: 15px;">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="180" style="width: 600px;">
            <vue-pictureupload :headImage="formValidate.userimg" :headImgwidth=80 :headImgheight="80"
                               :onSuccess="updataHearImg" style="margin: 0 auto;margin-bottom: 20px"></vue-pictureupload>
            <FormItem label="用户名称">
                <i-input v-model="formValidate.username" disabled placeholder="Enter your username"></i-input>
            </FormItem>
            <FormItem label="角色">
                <Select v-model="formValidate.role" disabled  placeholder="Select your role">
                    <Option v-for="item in permissionGroup" :value="item.label" :key="item.label">{{ item.value }}</Option>
                </Select>
            </FormItem>
            <FormItem label="真实姓名" prop="realname">
                <Input type="text" v-model="formValidate.realname"  placeholder="Enter your realname">
                </Input>
            </FormItem>
            <FormItem label="电话" prop="phone">
                <i-input v-model="formValidate.phone" placeholder="Enter your userphone"></i-input>
            </FormItem>
            <FormItem label="邮箱" prop="email">
                <i-input v-model="formValidate.email" placeholder="Enter your email"></i-input>
            </FormItem>
            <FormItem>
                <Button @click="handleReset('formValidate')">还原</Button>
                <Button style="margin-left: 8px" type="primary" @click="handleSubmit('formValidate')">修改</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    import pictureupload from '../../components/pictureupload.vue'

    export default {
        name: "adduser",
        components: {
            'vue-pictureupload': pictureupload,
        },
        data() {
            const validatePhone = (rule, value, callback) => {
                var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
                if (value === '') {
                    callback(new Error('请输入手机号'));
                } else if (!reg.test(value)) {
                    callback(new Error('手机号码格式不正确!'));
                } else {
                    callback();
                }
            };
            return {
                formValidate: {
                    username: '',
                    password: '',
                    userimg: '',
                    passwdCheck: '',
                    realname: '',
                    phone: '',
                    email: '',
                    role: 'user',
                },
                permissionGroup: [
                    {
                        value: '管理员',
                        label: 'admin'
                    },
                    {
                        value: '创作人',
                        label: 'creators'
                    },
                    {
                        value: '消费用户',
                        label: 'consumer'
                    },
                ],
                ruleValidate: {

                    realname: [
                        { required: true, message: '请输入你的真实姓名', trigger: 'blur' }
                    ],
                    phone: [
                        {
                            validator: validatePhone,
                            trigger: 'blur'
                        }
                    ],
                    email: [{
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
                },
                customerList: [],
                oldData:{},
            };
        },
        methods: {
            updataHearImg(data) {
                this.formValidate.userimg = data
            },
            handleSubmit(name) {
                let vm = this
                vm.$refs[name].validate((valid) => {
                    if (valid) {
                        let params = vm.formValidate;
                        let oldparams = vm.oldData;
                        let newparams = {};
                        for(let key in params) {
                            if (params[key] !== oldparams[key]){
                                newparams[key]=params[key]
                            }
                        }
                        newparams.id=params.id
                        console.info(newparams)
                        vm.$axios.put("/userManage/updaUser", newparams).then(function (data) {
                            let code = data.data.code
                            if (code === "1") {
                                vm.$Message.success('Success!');
                                vm.getuser()
                            } else {
                                vm.$Message.error('修改失败!');
                            }
                        }).catch(function (error) {
                            vm.$Message.error(error);
                        })
                    } else {
                        // this.$Message.error('Fail!');
                    }
                })
            },
            getuser(){
                let vm = this
                vm.$axios.get("/userManage/getUserById", {
                    params:{
                        userid:vm.$store.state.user.id
                    }
                }).then(function (data) {
                    let code = data.data.code
                    if (code === '1') {
                        vm.formValidate=data.data.result
                        for(let key in vm.formValidate) {
                            vm.oldData[key]=vm.formValidate[key]
                        }
                        let result=data.data.result
                        vm.$store.commit('setUser',result)
                    } else {
                        vm.$Message.error('用户信息查询失败失败!');
                        vm.$Message.error(data.data.message);
                    }
                }).catch(function (error) {
                    vm.$Message.error(error);
                })
                this.formValidate.userimg = this.$store.state.user.userimg
            },
            handleReset(name) {
                this.$refs[name].resetFields();
                this.getuser()
            }
        },
        created() {
            // /* global require */
            // let data = require("../../assets/headerImg.json")
            this.getuser()
        },

    }
</script>

<style>

</style>
