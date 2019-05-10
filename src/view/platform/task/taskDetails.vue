<template>
    <div>
        <div style="text-align: left;margin: -20px 0 10px 15px">
            <Button size="small" type="primary" @click="$router.back(-1)">
                <Icon type="ios-arrow-back" />
                返回
            </Button>
        </div>
        <Row>
            <i-col style="text-align: left" span="16">
                <card>
                    <div slot="title">
                        <h1 v-html="taskdata.title"></h1>
                        <br>
                        <div>
                            <span>{{taskdata.createtime}}</span><span style="margin-left: 20px;font-size: 12px">所属类型：{{taskdata.classname}}</span>
                        </div>
                        <br>
                        <h3>薪酬范围：{{taskdata.minsalary}}~{{taskdata.maxsalary}} 元</h3>
                    </div>
                    <div :class="taskdata.status==='0'?'project-status doing':'project-status end'">
                        <span>截稿时间：{{taskdata.taskdeadline}}</span>
                        <br>
                        {{taskdata.status==='0'?'进行中':'已结束'}}
                    </div>
                    <div v-html="taskdata.content"></div>
                    <div style="margin-top: 30px">
                        <Button type="primary" @click="addOrder">我要应征</Button>
                    </div>
                </card>
            </i-col>
            <i-col style="background-color: chocolate" span="8">
                <card>
                    <div style="margin-bottom: 20px;text-align: left">征招用户</div>
                    <Avatar :src="taskdata.userimg" style="width: 80px;height: 80px;"/>
                    <div v-html="taskdata.username" style="margin-top: 20px;margin-bottom: 20px"></div>
                </card>
            </i-col>
        </Row>
        <div style="color:#aaa;margin-top: 20px;margin-bottom: 10px;text-align: left">
            &nbsp; 共 {{data1.length}} 个应征人员
        </div>
        <Card>
            <Row>
                <Spin fix v-if="loading"></Spin>
                <Card v-if="data1.length===0" >
                    暂无应征人员
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
                    <div v-html='item.receipt_explain' style="padding: 10px"></div>
                    <hr style="margin-top: 10px;margin-bottom: 3px"/>
                    <Row style="text-align: right"> 申请时间：{{item.createtime}}</Row>
                </Card>
            </Row>
            <Row>
                <Page style="margin-top: 10px;float: right;" :total="pagetotal" :page-size="pagesize" @on-change="changepage" @on-page-size-change="changepagesize" show-elevator show-total show-sizer/>
            </Row>
        </Card>
        <Modal v-model="model1" title="应征" width="500px">
            <Form ref="addOrderdataForm" :model="orderdata" :rules="ruleAddOrderdata" :label-width="90" style="width: 400px;">
                <FormItem label="应征描述" prop="receipt_explain">
                    <Input v-model="orderdata.receipt_explain" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="handleReturn" style="margin-left: 8px">返回</Button>
                <Button type="primary" @click="handleSubmit('addOrderdataForm')">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "taskDetails",
        data() {
            return {
                taskid: '',
                onlyuser: {},
                taskdata: {},
                model1:false,
                loading:true,
                pagetotal: 0,
                page: 0,
                pagesize: 10,
                data1:[],
                orderdata:{
                    "orderuserid": "",
                    "receipt_explain": "",
                    "taskid": ""
                },
                ruleAddOrderdata: {
                    receipt_explain: [{
                        required: true,
                        message: '应征描述不能为空！',
                        trigger: 'blur'
                    }],
                },
            }
        },
        methods: {
            addOrder() {
                let vm = this
                if (vm.taskdata.status !== '0') {
                    vm.$Message.error("任务已经结束")
                } else {
                    if (!vm.$store.state.islogin) {
                        vm.$Message.error("请登录")
                        vm.$router.push({
                            path: '/login',
                            query: {redirect: vm.$route.path}
                        })
                    } else {
                        vm.model1=true
                    }
                }

            },
            handleReturn() {
                this.model1 = false;
            },
            handleSubmit(name) { // 修改表格信息提交
                let vm =this
                vm.$refs[name].validate((valid) => { // 验证
                    if(valid) {
                        vm.getTask()
                        if (vm.taskdata.status !== '0') {
                            vm.$Message.error("任务已经结束")
                        } else {
                            vm.$axios.put("/OrderManage/addOrder", vm.orderdata).then(function (data) {
                                let code = data.data.code
                                if (code === "1") {
                                    vm.$Message.success('Success!');
                                    vm.modal = false;
                                } else {
                                    vm.$Message.error('应征失败请重试!');
                                }
                            }).catch(function (error) {
                                vm.$Message.error(error);
                            })
                        }
                    } else {
                        // this.$Message.error('Fail!');
                    }
                })
            },

            getTask() {
                let vm = this
                vm.$axios.get("/TaskManage/getTaskById", {
                    params: {
                        taskid: vm.taskid
                    }
                }).then(function (data) {
                    let code = data.data.code
                    if (code === '1') {
                        vm.taskdata = data.data.result
                    } else {
                        vm.$Message.error('任务信息查询失败!');
                        vm.$Message.error(data.data.message);
                    }
                }).catch(function (error) {
                    vm.$Message.error(error);
                })
            },
            changepage(page) {
                this.page = page
                this.getOrders()
            },
            changepagesize(pagesize) {
                this.pagesize = pagesize
                this.getOrders()
            },
            getOrders() {
                let vm=this
                vm.loading = true
                let body={
                    "taskid": vm.taskid
                }
                let url="/OrderManage/getAllOrder?ispage=true&pageNum="+vm.page+"&pageSize="+vm.pagesize
                vm.$axios.post(url,body).then(function (data) {
                    let code = data.data.code
                    if (code === 1) {
                        vm.loading = false
                        vm.data1 = data.data.result.list
                        vm.pagetotal = data.data.result.total
                    } else {
                        vm.loading = false
                        vm.$Message.error('留言查询失败失败!');
                        vm.$Message.error(data.data.message);
                    }
                }).catch(function (error) {
                    vm.$Message.error(error);
                })
            },
            init() {
                let vm = this
                vm.taskid = vm.$route.params.id
                vm.orderdata.taskid= vm.$route.params.id
                if (vm.$store.state.islogin) {
                    vm.onlyuser = vm.$store.state.user
                    vm.orderdata.orderuserid =vm.onlyuser.id
                }
                vm.getTask()
                vm.getOrders()
            }
        },
        created() {
            this.init()
        }

    }
</script>
<style scoped>
    .project-status {
        position: absolute;
        right: 30px;
        top: 15px;
        text-align: center;
        border: dashed 2px transparent;
        padding: 10px;
    }

    .project-status span {
        color: #333;
    }

    .project-status.end {
        color: #ccc;
        border-color: #ccc;
    }

    .project-status.doing {
        color: #339933;
        border-color: #339933;
    }
</style>
