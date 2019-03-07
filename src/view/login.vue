<template>
    <div>
        <card style="width: 300px;margin: 50px auto;" >
            <Form ref="formInline" :model="formInline" :rules="ruleInline" style="width: 200px;margin: 50px auto">
                <FormItem prop="user">
                    <Input type="text" v-model="formInline.user" placeholder="Username">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input type="password" v-model="formInline.password" placeholder="Password">
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <Mypuzzle :on-success="sutest" :on-error="ertest" width="200" height="120" :isinit="formInline.puzzle"  :puzzle-img-list="imgList"></Mypuzzle>
                <FormItem>
                    <Button id="loginSubmit" type="primary" @click="loginSubmit">登录</Button>
                </FormItem>
            </Form>
        </card>
    </div>
</template>

<script>
    import Mypuzzle from '../components/mypuzzle.vue'
    export default {
        name: "login",
        components:{
            Mypuzzle
        },
        data () {
            return {
                imgList:[
                    /* global require */
                    require("../assets/img/ver-1.png"),
                    require("../assets/img/ver-2.png"),
                    require("../assets/img/ver-3.png"),
                ],
                formInline: {
                    user: '',
                    password: '',
                    puzzle: false,
                },
                ruleInline: {
                    user: [
                        { required: true, message: 'Please fill in the user name', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: 'Please fill in the password.', trigger: 'blur' },
                    ]
                }
            }

        },
        methods: {
            sutest(){
                this.$refs["formInline"].validate((valid) => {
                    if (valid) {
                        this.loginSubmit();
                    }else {
                        this.$Message.success('请输入账号密码!');
                    }
                })
                this.$Message.info("ok!!!")
                this.formInline.puzzle=true
            },
            ertest(){
                this.$Message.info("ERROR!!!")
                this.formInline.puzzle=false
            },
            loginSubmit() {
                let vm =this
                if(vm.formInline.puzzle){
                    let body={
                        "username": vm.formInline.user,
                        "password": vm.formInline.password
                    }

                    vm.$axios.post("login",body).then(function (data) {
                        let code=data.data.code
                        if (code==='1'){
                            let result=data.data.result
                            vm.$store.commit('setUser',result)
                            vm.formInline.puzzle=false
                            vm.$router.push({path:'/home'});
                        } else {
                            vm.$Message.error('登录失败!');
                            vm.formInline.puzzle=false
                            vm.$store.commit('setUser',null)
                        }
                    }).catch(function (error) {
                        vm.$Message.error(error);
                        vm.formInline.puzzle=false
                        vm.$store.commit('setUser',null)
                    })
                }else {
                    vm.$Message.info("请进行图片验证")
                    vm.$store.commit('setUser',null)
                }

            }
        }
    };
</script>

<style>
</style>
