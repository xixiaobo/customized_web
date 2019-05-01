<template>
       <Card dis-hover style="margin-top: 15px;">
           <p slot="title">
               添加任务
           </p>
           <Form ref="formTask" :model="taskdata" :rules="ruleTask" :label-width="180" style="width: 600px;">
              <FormItem label="任务标题" prop="title">
                   <i-input v-model="taskdata.title" placeholder="Enter your productname"></i-input>
               </FormItem>
               <FormItem label="分类" prop="classid">
                   <Select v-model="taskdata.classid" placeholder="Select your role">
                       <Option v-for="item in classfiyGroup" :value="item.id" :key="item.id">{{ item.classname }}</Option>
                   </Select>
               </FormItem>
               <FormItem label="截止时间" prop="taskdeadline">
                   <DatePicker type="date" v-model="taskdata.taskdeadline"  @on-change="dataok" show-week-numbers placeholder="Select date" style="width: 200px"></DatePicker>
               </FormItem>
               <FormItem label="最低薪酬">
                   <InputNumber
                           :max="10000"
                           :min="1"
                           v-model="taskdata.minsalary"
                           :formatter="value => `$ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')"
                           :parser="value => value.replace(/$s?|(,*)/g, '')"></InputNumber>
               </FormItem>
               <FormItem label="最高薪酬">
                   <InputNumber
                           :max="10000"
                           :min="1"
                           v-model="taskdata.maxsalary"
                           :formatter="value => `$ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')"
                           :parser="value => value.replace(/$s?|(,*)/g, '')"></InputNumber>
               </FormItem>
               <FormItem label="任务详情" >
               </FormItem>
               <div class="edit_container" style="margin-left: 100px;width: 700px;height: 270px;margin-bottom: 20px">
                       <quill-editor
                               v-model="taskdata.content"
                               ref="myQuillEditor"
                               :options="editorOption" style="height: 200px;">
                       </quill-editor>
                   </div>
               <FormItem>
                   <Button @click="handleReset('formTask')">重置</Button>
                   <Button style="margin-left: 8px" type="primary" @click="handleSubmit('formTask')">添加</Button>
               </FormItem>
           </Form>
       </Card>
</template>

<script>

    export default {
        name: "addTask",
        components: {
        },
        data () {
            return {
                taskdata:{
                    "content": "",
                    "maxsalary":0,
                    "minsalary": 0,
                    "title": "",
                    "taskdeadline": "",
                    "userid": ""
                },
                editorOption: {},
                ruleTask: {
                    title: [{
                        required: true,
                        message: '标题不能为空',
                        trigger: 'blur'
                    }],
                    classid: [{
                        required: true,
                        message: '分类不能为空',
                        type: 'number',
                        trigger: 'change'
                    }],
                    taskdeadline: [{
                        required: true,
                        message: '截止时间不能为空',
                    }],
                },
                classfiyGroup:[],
            }
        },
        methods: {
            dataok(){
                let date = this.taskdata.taskdeadline;
                let seperator1 = "-";
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                let currentdate = year + seperator1 + month + seperator1 + strDate;
                this.taskdata.taskdeadline=currentdate
            },
            handleSubmit(name) {
                let vm = this
                vm.$refs[name].validate((valid) => {
                    if (valid&&vm.taskdata.userid!=="") {
                        vm.$axios.post("/TaskManage/addTask", vm.taskdata).then(function (data) {
                            let code = data.data.code
                            if (code === '1') {
                                vm.$Message.success('任务添加成功!');
                                vm.$refs[name].resetFields();
                                vm.taskdata={
                                        "content": "",
                                        "maxsalary":0,
                                        "minsalary": 0,
                                        "title": "",
                                        "userid": ""
                                }
                            } else {
                                vm.$Message.error('产品添加失败!');
                                vm.$Message.error(data.data.message);
                            }
                        }).catch(function (error) {
                            vm.$Message.error(error);
                        })
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset(name) {
                this.$refs[name].resetFields();
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
        created() {
            this.taskdata.userid=this.$store.state.user.id
            this.getClassfiy()
        }

    }
</script>

<style>
</style>
