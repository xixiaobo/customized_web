<template>
    <div class="layout">
        <Layout>
            <Sider  ref="side1" :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}" width="210"  hide-trigger collapsible   :collapsed-width="78" v-model="isCollapsed">
                <Menu  theme="dark" width="auto" :class="menuitemClasses" :on-select="toview">
                    <MenuItem name="1-1" to="/backstage/updatauser">
                        <Icon type="md-contact" />
                        <span  >个人资料管理</span>
                    </MenuItem>
                    <Submenu name="0" v-if="this.$store.state.user.role==='admin'">
                        <template slot="title">
                            <Icon type="ios-contacts" />
                            <span>系统设置</span>
                        </template>
                        <MenuItem name="0-1" to="/backstage/test">
                            <Icon type="md-person-add" />
                            <span>界面设置</span>
                        </MenuItem>
                    </Submenu>
                    <Submenu name="1" v-if="this.$store.state.user.role==='admin'">
                        <template slot="title">
                            <Icon type="ios-contacts" />
                            <span>用户管理</span>
                        </template>
                        <MenuItem name="1-1" to="/backstage/adduser">
                            <Icon type="md-person-add" />
                            <span>添加用户</span>
                        </MenuItem>
                        <MenuItem name="1-2" to="/backstage/userlist">
                            <Icon type="ios-podium" />
                            <span>用户列表</span>
                        </MenuItem>
                    </Submenu>
                    <Submenu name="2" v-if="this.$store.state.user.role==='admin'||this.$store.state.user.role==='creators'">
                        <template slot="title">
                            <Icon type="ios-contacts" />
                            <span>平台服务</span>
                        </template>
                        <MenuItem name="2-1" to="/backstage/classfiylist" v-if="this.$store.state.user.role==='admin'">
                            <Icon type="ios-podium" />
                            <span>分类管理</span>
                        </MenuItem>
                        <MenuItem name="2-2" to="/backstage/addproduct">
                            <Icon type="ios-podium" />
                            <span>添加产品</span>
                        </MenuItem>
                        <MenuItem name="2-3" to="/backstage/productlist">
                            <Icon type="ios-podium" />
                            <span>产品列表</span>
                        </MenuItem>
                    </Submenu>
                    <Submenu name="3" v-if="this.$store.state.user.role==='admin'||this.$store.state.user.role==='consumer'">
                        <template slot="title">
                            <Icon type="ios-contacts" />
                            <span>任务管理</span>
                        </template>
                        <MenuItem name="3-1" to="/backstage/addTask">
                            <Icon type="ios-podium" />
                            <span>添加任务</span>
                        </MenuItem>
                        <MenuItem name="3-2" to="/backstage/taskmanger">
                            <Icon type="ios-podium" />
                            <span>任务列表</span>
                        </MenuItem>
                    </Submenu>
                    <Submenu name="4" v-if="this.$store.state.user.role==='admin'||this.$store.state.user.role==='creators'">
                        <template slot="title">
                            <Icon type="ios-contacts" />
                            <span>订单管理</span>
                        </template>
                        <MenuItem name="4-1" to="/backstage/ordermanger">
                            <Icon type="ios-podium" />
                            <span>订单列表</span>
                        </MenuItem>
                    </Submenu>
                </Menu>
            </Sider>
            <Layout :class="rotateright">
                <Header :style="{padding: 0}" class="layout-header-bar" style="z-index: 999;margin-top: -3px">
                    <Row>
                        <i-col span="2">
                            <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24"></Icon>
                        </i-col>
                        <i-col span="22" >
                            <Row >
                                <i-col span="1" :offset="headeroffset">
                                    <Button shape="circle"  to="/home" >首页</Button>
                                </i-col>
                                <i-col span="2">
                                    <Dropdown @on-click="clickDropdown">
                                        <Avatar :src="this.$store.state.user.userimg" />
                                        <DropdownMenu slot="list" >
                                            <DropdownItem name="changePassword">修改个人密码</DropdownItem>
                                            <DropdownItem name="logout">退出登录</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </i-col>
                            </Row>
                        </i-col>
                    </Row>
                </Header>
                <Content :style="{margin: '70px 10px 20px 10px', minHeight: '100vh'}">
                    <router-view />
                </Content>
            </Layout>
        </Layout>
        <Modal v-model="modal2" title="密码修改" width="500px">
            <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="90" style="width: 400px;">
                <FormItem label="现密码" prop="old_password">
                    <Input type="password" v-model="formValidate2.old_password" placeholder="Enter your old password"></Input>
                </FormItem>
                <FormItem label="新密码" prop="new_password1">
                    <Input type="password" v-model="formValidate2.new_password1" placeholder="Enter your new password"></Input>
                </FormItem>
                <FormItem label="确认新密码" prop="new_password2">
                    <Input type="password" v-model="formValidate2.new_password2" placeholder="Enter your new password again"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="handleReturn2" style="margin-left: 8px">返回</Button>
                <Button type="primary" @click="handleSubmit2('formValidate2')">修改</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "backstage",
        data () {
            const isPwdCorrect = (rule, value, callback) => {
                let vm = this;
                if(!value) {
                    callback(new Error("请输入现密码"));
                } else {
                    let body={
                        "id": vm.changeUser_id,
                        "password": value
                    }
                    vm.$axios.put("/userManage/decidePasswprd", body).then(function (data) {
                        let code = data.data.code
                        if (code === '1') {
                            let isRight = data.data.isRight
                            if (isRight === true) {
                                callback();
                            }else {
                                callback(new Error("现密码错误"));
                            }
                        } else {
                            callback(new Error("判断失败"));
                        }
                    }).catch(function (error) {
                        vm.$Message.error(error);
                    })
                }
            };
            const isSamePassword = (rule, value, callback) => {
                let vm = this;
                if(!value) {
                    callback(new Error("请再次輸入新密码!"));
                } else {
                    if(vm.formValidate2.new_password1 !== vm.formValidate2.new_password2) {
                        callback(new Error("密码不一致!"));
                    } else {
                        callback();
                    }
                }
            };
            return {
                changeUser_id: '', //  修改密碼時
                isCollapsed: false,
                headeroffset: 17,
                modal2: false, // 修改密码模态框
                formValidate2: {
                    old_password: '',
                    new_password1: '',
                    new_password2: ''
                },
                ruleValidate2: {
                    old_password: [{
                        validator: isPwdCorrect,
                        trigger: 'blur'
                    }],
                    new_password1: [{
                        required: true,
                        type: 'string',
                        message: '请输入新密码！'
                    }],
                    new_password2: [{
                        validator: isSamePassword,
                        trigger: 'blur'
                    }]
                },
            }
        },
        computed: {
            rotateIcon () {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
            rotateright(){
                return [
                    'layout-right',
                    this.isCollapsed ? 'layout-right-max' : ''
                ];
            },
            menuitemClasses () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            },

        },
        methods: {
            toview(name){
                console.info(name)
            },
            collapsedSider () {
                console.info("dsd")
                this.$refs.side1.toggleCollapse();
                this.isCollapsed ? this.headeroffset=19 : this.headeroffset=17
            },
            clickDropdown(name) { // 修改密码模态框
                let vm = this;
                if(name==="changePassword"){
                    vm.modal2 = true;
                    vm.changeUser_id = vm.$store.state.user.id;
                }else if (name === "logout"){
                    vm.$store.commit('setUser',null)
                    vm.$router.push({path:'/home'});
                }
            },
            handleReturn2() {
                this.modal2 = false;
            },
            handleSubmit2(name) { // 修改密码提交
                let vm =this
                vm.$refs[name].validate((valid) => { // 验证
                    if(valid) {
                        let body={
                            "id":vm.changeUser_id,
                            "Password": vm.formValidate2.new_password1
                        }
                        vm.$axios.put("/userManage/updataUserPassword", body).then(function (data) {
                            let code = data.data.code
                            if (code === "1") {
                                vm.$Message.success('Success!');
                                vm.modal2 = false;
                            } else {
                                vm.$Message.error('修改失败!');
                            }
                        }).catch(function (error) {
                            vm.$Message.error(error);
                        })
                    }
                })

            },
        }
    }
</script>

<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-right{
        margin-left: 210px;
        transition: margin-left .3s ease;
    }
    .layout-right-max{
        margin-left: 78px;
        transition: margin-left .2s ease;
    }
    .layout-header-bar{
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
        position: fixed;
        width: 100%;
    }

    .menu-icon{
        transition: all .3s;
    }
    .rotate-icon{
        transform: rotate(-90deg);
    }
    .menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 100px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }
    .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }

    .collapsed-menu span{
        width: 0px;
        transition: width .2s ease;
    }
    .collapsed-menu i{
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 20px;
    }
    .collapsed-menu ul a i{
        margin-left: -25px;
    }
</style>
