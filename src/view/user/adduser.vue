<template>
    <!-- 账户增加 -->
    <Card dis-hover style="margin-top: 15px;">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="180" style="width: 600px;">
            <vue-pictureupload :headImage="formValidate.userimg" :headImgwidth=80 :headImgheight="80"
                               :onSuccess="updataHearImg" style="margin: 0 auto;margin-bottom: 20px"></vue-pictureupload>
            <FormItem label="用户名称" prop="username">
                <i-input v-model="formValidate.username" placeholder="Enter your username"></i-input>
            </FormItem>
            <FormItem label="角色" prop="role">
                <Select v-model="formValidate.role" placeholder="Select your role">
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
            <FormItem label="密码" prop="password">
                <i-input type="password" v-model="formValidate.password" placeholder="Enter your password"></i-input>
            </FormItem>
            <FormItem label="确认密码" prop="passwdCheck">
                <i-input type="password" v-model="formValidate.passwdCheck"
                       placeholder="Enter your Confirm password"></i-input>
            </FormItem>
            <FormItem>
                <Button @click="handleReset('formValidate')">重置</Button>
                <Button style="margin-left: 8px" type="primary" @click="handleSubmit('formValidate')">添加</Button>
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
            const validateUsername = (rule, value, callback) => {
                let vm = this
                if (!value) {
                    return callback(new Error('登录名不能为空'));
                }

                vm.$axios.get("userManage/getUserByName", {
                    params: {
                        "userName": value
                    }
                }).then(function (data) {
                    if (data.data.code === '1') {
                        if (data.data.isHave === true) {
                            callback(new Error('用户名已存在'));
                        } else {
                            callback();

                        }
                    } else {
                        callback(new Error('检验失败，请刷新重试'));
                    }
                }).catch(function (error) {
                    callback(new Error('检验失败，请刷新重试：' + error));
                })
            };
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.formValidate.passwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formValidate.validateField('passwdCheck');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.formValidate.password) {
                    callback(new Error('俩次密码不正确'));
                } else {
                    callback();
                }
            };
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
                    }
                ],
                ruleValidate: {
                    username: [{
                        required: true,
                        message: '用户名称不能为空！',
                        trigger: 'blur'
                    }, {validator: validateUsername, trigger: 'blur'}],
                    role: [{
                        required: true,
                        message: '角色不能为空',
                        trigger: 'blur'
                    },
                        {
                            type: 'string'
                        }
                    ],
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
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                },
                customerList: []
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
                        let body = vm.formValidate
                        console.info(body)
                        vm.$axios.post("/userManage/addUser", body).then(function (data) {
                            let code = data.data.code
                            if (code === '1') {
                                vm.$Message.success('用户添加成功!');
                            } else {
                                vm.$Message.error('用户添加失败!');
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
            }
        },
        created() {
            /* global require */
            let data = require("../../assets/headerImg.json")
            this.formValidate.userimg = data.img
        },

    }
</script>

<style>

</style>
