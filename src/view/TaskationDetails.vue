<template>
    <div>
        <card style="margin-bottom: 20px;margin-top: 10px;font-family: '黑体';font-size: 14px;    ">
            <Row style="margin-left: 20px">
                <i-col span="3" :class="{'colordisplay':sortfield==='createtime'}" style="cursor:pointer;margin-top: 6px" id="time" @click.native="time('createtime')">
                    <Row >
                        <i-col span="15" >按发布时间</i-col>
                        <i-col span="2" v-if="sortfield==='createtime'"  style="line-height:15px">
                            <Icon type="md-arrow-dropup" v-if="sortingdirection==='ASC'"/>
                            <Icon type="md-arrow-dropdown" v-else/>
                        </i-col>
                    </Row>
                </i-col>
                <i-col span="3" :class="{'colordisplay':sortfield==='taskdeadline'}" style="cursor:pointer;margin-top: 6px" id="hot" @click.native="time('taskdeadline')">
                    <Row>
                        <i-col span="15">按截稿日期</i-col>
                        <i-col span="2" v-if="sortfield==='taskdeadline'"  style="line-height:15px">
                            <Icon type="md-arrow-dropup" v-if="sortingdirection==='ASC'"/>
                            <Icon type="md-arrow-dropdown" v-else/>
                        </i-col>
                    </Row>
                </i-col>
                <i-col span="3" :class="{'colordisplay':sortfield==='maxsalary'}" style="cursor:pointer;margin-top: 6px" id="hot" @click.native="time('maxsalary')">
                    <Row>
                        <i-col span="15">按稿费高低</i-col>
                        <i-col span="2" v-if="sortfield==='maxsalary'"  style="line-height:15px">
                            <Icon type="md-arrow-dropup" v-if="sortingdirection==='ASC'"/>
                            <Icon type="md-arrow-dropdown" v-else/>
                        </i-col>
                    </Row>
                </i-col>
                <i-col span="2" offset="1"  style="margin-top: 6px">
                    分类：
                </i-col>
                <i-col span="2"  style="width:150px" >
                    <Select v-model="classifyselect" clearable filterable @on-change="getAllTask" >
                        <Option v-for="item in classify" :value="item.id" :key="item.id">{{ item.classname }}</Option>
                    </Select>
                </i-col>
            </Row>
        </card>
        <card v-if="taskdata.length===0">没有平台任务</card>
        <Row type="flex" justify="space-around" style="margin-left: 20px" v-else>
            <i-col span="8"  style="width: 400px;height:140px" v-for="(t,index) in taskdata" :key="index" >
                <card style="width: 400px;height:140px" >
                    <Row>
                        <i-col span="5">
                            <Row>
                                <i-col>
                                    <Avatar style="width: 60px;height: 60px" :src="t.userimg" />
                                </i-col>
                                <i-col style="padding-top: 10px">
                                    {{t.username}}
                                </i-col>
                            </Row>
                        </i-col>
                        <i-col span="15">
                            <Row>
                                <i-col>
                                    <router-link :to="'/taskDetails/'+t.id" style="color: black">
                                    {{t.title}}
                                    </router-link>
                                </i-col>
                                <i-col style="padding-top: 10px">
                                    截止时间：{{t.taskdeadline}}
                                </i-col>
                                <i-col style="padding-top: 10px">
                                薪酬预算：{{t.minsalary}}~ {{t.maxsalary}}
                                </i-col>
                            </Row>
                        </i-col>
                        <i-col span="4">
                            <Button @click="$router.push({
													path: '/taskDetails/'+t.id
												})" v-if="t.status=='0'"><span class="toaaa">去应征</span></Button>
                            <Button disabled v-else><span class="toaaa">已结束</span></Button>
                        </i-col>
                    </Row>
                </card>
            </i-col>
        </Row>
        <BackTop></BackTop>
    </div>
</template>

<script>
    export default {
        name: "product",
        data() {
            return {
                classifyid: "",
                classify:[],
                taskdata:[],
                sortfield:"createtime",
                sortingdirection:'DESC',
                classifyselect:"",
            }
        },
        methods: {
            time:function (name) {
                let vm=this
                if (vm.sortfield===name){
                   if (vm.sortingdirection==='DESC'){
                       vm.sortingdirection='ASC'
                   } else {
                       vm.sortingdirection='DESC'
                   }
                } else{
                    vm.sortfield=name
                    vm.sortingdirection='DESC'
                }
                this.getAllTask()
            },
            getClassfiy(){
                let vm=this
                vm.$axios.get("classifyManage/getAllClassify").then(function (data) {
                    let code=data.data.code
                    if (code===1){
                        vm.classify=data.data.result
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
            },
            init() {
                this. getClassfiy()
                this.getAllTask()
            },

            getAllTask(){
                let vm=this
                if(vm.classifyselect===undefined){
                    vm.classifyselect=''
                }
                let body={
                    'classid':vm.classifyselect,
                }
                vm.$axios.post("/TaskManage/getAllTask?ispage=false&sortfield="+vm.sortfield+"&sortingdirection="+vm.sortingdirection,body).then(function (data) {
                    let result=data.data.result
                    vm.taskdata=result
                }).catch(function (error) {
                    console.info(error)
                    // vm.data1=error.data
                })
            }
        },
        created() {
            this.init()
        }
    }
</script>

<style scoped>
    .colordisplay {
        color: red;
    }
    li {list-style-type:none;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;}
    .ivu-btn{
        white-space:inherit
    }
    .toaaa{
        width: 15px;
        font-size: 16px;
        word-wrap: break-word;
    }
</style>
