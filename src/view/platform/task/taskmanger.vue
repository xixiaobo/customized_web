<template>
	<!-- 账户管理 -->
	<!-- ctgcdn CTGCDN321 -->
	<div>
		<Row :gutter="15">
			<Col span="3" style="float: right;">
				<Button @click="toAddTask" icon="md-add" type="primary" style="width: 100%;">增加任务</Button>
			</Col>
		</Row>
		<Card dis-hover style="margin-top: 15px;">
			<Row>
				<Table border :columns="columns1" :data="data1" :loading="loading">
				</Table>
				<Page style="margin-top: 10px;float: right;" :total="pagetotal" :page-size="pagesize" @on-change="changepage" @on-page-size-change="changepagesize" show-elevator show-total show-sizer/>
			</Row>
		</Card>
		<Modal v-model="modal" title="任务修改" width="750px">
			<Form ref="updataTaskForm" :model="updatatask" :rules="ruleUpadtaTask" :label-width="90" style="width: 400px;">
				<FormItem label="任务标题" prop="title">
					<i-input v-model="updatatask.title" readonly placeholder="Enter your productname"></i-input>
				</FormItem>
				<FormItem label="分类" prop="classid">
					<Select v-model="updatatask.classid" disabled placeholder="Select your role">
						<Option v-for="item in classfiyGroup" :value="item.id" :key="item.id">{{ item.classname }}</Option>
					</Select>
				</FormItem>
				<FormItem label="截止时间" prop="taskdeadline">
					<DatePicker type="date" v-model="updatatask.taskdeadline" :readonly="updatatask.status!=='0'"  @on-change="dataok" show-week-numbers placeholder="Select date" style="width: 200px"></DatePicker>
				</FormItem>
				<FormItem label="最低薪酬">
					<InputNumber
							:max="10000"
							:min="1"
							v-model="updatatask.minsalary"
							:formatter="value => `$ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')"
							:parser="value => value.replace(/$s?|(,*)/g, '')"
							:readonly="updatatask.status!=='0'" ></InputNumber>
				</FormItem>
				<FormItem label="最高薪酬">
					<InputNumber
							:max="10000"
							:min="1"
							v-model="updatatask.maxsalary"
							:formatter="value => `$ ${value}`.replace(/B(?=(d{3})+(?!d))/g, ',')"
							:parser="value => value.replace(/$s?|(,*)/g, '')"
							:readonly="updatatask.status!=='0'" ></InputNumber>
				</FormItem>
				<FormItem label="任务详情" >
					<div v-if="updatatask.status!=='0'" v-html="updatatask.content" style="height: 200px;width: 630px;overflow-y: auto"></div>
				</FormItem>
				<div class="edit_container" v-if="updatatask.status==='0'" style="margin-left: 10px;width: 700px;height: 270px;margin-bottom: 20px">
					<quill-editor
							v-model="updatatask.content"
							ref="myQuillEditor"
							:options="editorOption" style="height: 200px;">
					</quill-editor>
				</div>
			</Form>
			<div slot="footer" >
				<Button @click="handleReturn" style="margin-left: 8px">返回</Button>
				<Button type="primary" v-if="updatatask.status==='0'" @click="handleSubmit('updataTaskForm')">修改</Button>
			</div>
		</Modal>
		<Modal v-model="moda2" title="应聘详情" width="750px">
			<Card dis-hover style="margin-top: 15px;">
				<Row>
					<Table border :columns="columns2" :data="data2" :loading="loading2">
					</Table>
					<Page style="margin-top: 10px;float: right;" :total="pagetotal2" :page-size="pagesize2" @on-change="changepage2" @on-page-size-change="changepagesize2" show-elevator show-total show-sizer/>
				</Row>
			</Card>
			<div slot="footer" >
				<Button @click="handleReturn" style="margin-left: 8px">返回</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	export default {
		name: 'workorder',
		data() {
			return {
				loading: false,
				classfiyGroup: [],
				pagetotal: 0,
				page: 0,
				pagesize: 10,
				modal: false,
				updatatask:{
					"content": "",
					"maxsalary":0,
					"minsalary": 0,
					"title": "",
					"taskdeadline": "",
					"userid": ""
				},
				oldData:{},
				ruleUpadtaTask: {
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
				columns1: [
					{
						title: '任务标题',
						key: 'title',
						render: (h, params) => {
							return h('div', [
									h('a',{
										on: {
											click: () => {
												this.$router.push({
													path: '/taskDetails/'+params.row.id
												})
											},
										}
									},params.row.title)
							]);
						}
					},
					{
						title: '所属分类',
						key: 'classname',
					},
					{
						title: '所属用户',
						key: 'username'
					},
					{
						title: '状态',
						key: 'status',
						render: (h, params) => {
							let name=''
							if(params.row.status==='0'){
								name="发布中"
							}else if(params.row.status==='1'){
								name="已接单"
							}else if(params.row.status==='2'){
								name="已关闭"
							}
							return h('div', [
								h('Tag',name),
								h('Tooltip', {
									props: {
										content: '应聘人数',
										placement: 'top'
									},
								}, [h('Button', {
									props: {
										type: 'primary',
                                        size: 'small',
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.showOrder(params.row.id)
										}
									}
								},params.row.applicantsnum)]),
							])
						}
					},
					{
						title: '薪酬范围',
						render: (h, params) => {
							let name=''
							if(params.row.minsalary===params.row.maxsalary){
								name="￥"+params.row.minsalary
							}else {
								name="￥"+params.row.minsalary+"~￥"+params.row.maxsalary
							}
							return h('div', name)
						}
					},
					{
						title: '截止时间',
						key: 'taskdeadline'
					},
					{
						title: '创建时间',
						key: 'createtime'
					},
					{
						title: '操作',
						key: 'action',
						// width: 150,
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('Tooltip', {
									props: {
										content: '修改产品信息',
										placement: 'top'
									},
								}, [h('Button', {
									props: {
										type: 'primary',
										size: 'small',
										icon: 'md-create',
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.openModal(params.row)
										}
									}
								})]),
								h('Tooltip', {
									props: {
										content: '关闭',
										placement: 'top'
									},
									style: {
										display:(params.row.status==='0')?"inline-block":"none",
									},
								}, [
									h('Poptip', {
										props: {
											confirm: true,
											title: '确定要关闭吗！',
											type: 'primary',
											transfer: true
										},
										on: {
											'on-ok': () => {
												this.closeTask(params.row.id)
											}
										}
									}, [
										h('Button', {
											props: {
												type: 'warning',
												size: 'small',
												icon: 'md-close-circle',
											},
											style: {
												marginRight: '5px'
											}
										})
									])
								]),
								h('Tooltip', {
									props: {
										content: '删除',
										placement: 'top'
									}
								}, [
									h('Poptip', {
										props: {
											confirm: true,
											title: '确定要删除吗！',
											type: 'primary',
											transfer: true
										},
										on: {
											'on-ok': () => {
												this.delete(params.row)
											}
										}
									}, [
										h('Button', {
											props: {
												type: 'error',
												size: 'small',
												icon: 'md-trash',
											},
											style: {
												marginRight: '5px'
											}
										})
									])
								])
							])
						}
					}
				],
				data1: [],
				data2: [],
				editorOption: {},
				moda2:false,
				loading2: false,
				pagetotal2: 0,
				page2: 0,
				pagesize2: 10,
				columns2:[
					{
						title: '接单用户',
						key: 'username',
					},
					{
						title: '接单说明',
						key: 'receipt_explain',
                        render: (h, params) => {
                            return h('div',{
                                style: {
                                    textOverflow:'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace:'nowrap'
                                }
                            },params.row.receipt_explain)
						}
					},
					{
						title: '操作',
						key: 'action',
						// width: 150,
						align: 'center',
						render: (h, params) => {
							let name=''
							if(params.row.status==='0'){
								name="待确认"
							}else if(params.row.status==='1'){
								name="已确认"
							}else if(params.row.status==='-2'){
								name="已拒绝"
							}else if(params.row.status==='-1'){
								name="已失效"
							}
							return h('div', [
								h('Tooltip', {
									props: {
										content: '说明详情',
										placement: 'top'
									},
								}, [
                                    h('Button', {
                                        props: {
                                            type: 'primary',
                                            size: 'small',
                                            icon: 'ios-clipboard',
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                let config={
                                                    title:'说明详情',
                                                    content:params.row.receipt_explain,
                                                    closable:true
                                                }
                                                this.$Modal.success(config)
                                            }
                                        }
                                    })

								]),
                                h('Tooltip', {
                                    props: {
                                        content: '同意',
                                        placement: 'top'
                                    },
                                    style: {
                                        display:(params.row.status==='0')?"inline-block":"none",
                                    },
                                }, [
                                    h('Poptip', {
                                        props: {
                                            confirm: true,
                                            title: '确定选择该用户吗！',
                                            type: 'primary',
                                            transfer: true
                                        },
                                        on: {
                                            'on-ok': () => {
                                                this.changeOrder(params.row.id,'ok')
                                            }
                                        }
                                    }, [
                                        h('Button', {
                                            props: {
                                                type: 'primary',
                                                size: 'small',
                                                icon: 'md-checkmark',
                                            },
                                            style: {
                                                marginRight: '5px'
                                            }
                                        })
                                    ])
                                ]),
								h('Tooltip', {
									props: {
										content: '拒绝',
										placement: 'top'
									},
									style: {
										display:(params.row.status==='0')?"inline-block":"none",
									},
								}, [
									h('Poptip', {
										props: {
											confirm: true,
											title: '确定拒绝该用户吗！',
											type: 'primary',
											transfer: true
										},
										on: {
											'on-ok': () => {
												this.changeOrder(params.row.id,'no')
											}
										}
									}, [
										h('Button', {
											props: {
												type: 'error',
												size: 'small',
												icon: 'md-close',
											},
											style: {
												marginRight: '5px'
											}
										})
									])
								]),
								h('Tag',{style: {display:(params.row.status!=='0')?"inline-block":"none"}},name),
							])
						}
					}
				],
				showtaskid:'',
			}
		},
		methods: {
			dataok(){
				let date = this.updatatask.taskdeadline;
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
				this.updatatask.taskdeadline=currentdate
			},
			toAddTask() {
				this.$router.push({
					name: 'addTask'
				})
			},
			openModal(data) {
				this.modal = true;
				this.updatatask = data
				this.updatatask.minsalary=parseInt(this.updatatask.minsalary)
				this.updatatask.maxsalary=parseInt(this.updatatask.maxsalary)
				this.getClassfiy()
				for(let key in this.updatatask) {
					this.oldData[key]=this.updatatask[key]
				}
			},
			showOrder(id) {
				this.moda2 = true;
				this.showtaskid=id
				this.getOrderData()
			},
			handleSubmit(name) { // 修改表格信息提交
				let vm =this
				vm.$refs[name].validate((valid) => { // 验证
					if(valid) {
						let params = vm.updatatask;
						let oldparams = vm.oldData;
						let newparams = {};
						for(let key in params) {
							if (params[key] !== oldparams[key]){
								newparams[key]=params[key]
							}
						}
						newparams.id=params.id
						vm.$axios.put("/TaskManage/updaTask", newparams).then(function (data) {
							let code = data.data.code
							if (code === "1") {
								vm.$Message.success('Success!');
								vm.modal = false;
								vm.getdata()
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
			handleReturn() {
				this.modal = false;
				this.moda2 = false;
			},
			closeTask(index) { // 关闭任务
				let vm =this
				let body={
					'id':index,
					'status':'2'
				}
				vm.$axios.put("/TaskManage/updaTask", body).then(function (data) {
					let code = data.data.code
					if (code === "1") {
						vm.$Message.success('Success!');
						vm.modal = false;
						vm.getdata()
					} else {
						vm.$Message.error('关闭失败!');
					}
				}).catch(function (error) {
					vm.$Message.error(error);
				})
			},
			delete(data) { // 删除
				let vm =this
				if (data.status==='0'){
					vm.$Message.error('任务为完成或未关闭不容许删除');
				}else {
					vm.$axios.delete("/TaskManage/deleteTask/"+data.id).then(function (data) {
						let code = data.data.code
						if(code === '0') {
							vm.$Message.error('任务删除失败，请稍后重试！');
						} else {
							vm.$Message.success('任务删除成功');
							vm.getdata()
						}
					}).catch(function (error) {
						vm.$Message.error(error);
					})
				}
			},
			changepage(page) {
				this.page = page
				this.getdata()
			},
			changepagesize(pagesize) {
				this.pagesize = pagesize
				this.getdata()
			},
			getdata() {
				let vm=this
				let body={}
				if(vm.$store.state.user.role!=='admin'){
					body["userid"]=vm.$store.state.user.id
					body["isdelete"]=0
				}
				vm.loading = true
				let url="/TaskManage/getAllTask?ispage=true&pageNum="+vm.page+"&pageSize="+vm.pagesize
				vm.$axios.post(url, body).then(function (data) {
					let code = data.data.code
					if (code === 1) {
						vm.loading = false
						vm.data1 = data.data.result.list
						vm.pagetotal = data.data.result.total
					} else {
						vm.$Message.error('产品列表查询失败失败!');
						vm.$Message.error(data.data.message);
					}
				}).catch(function (error) {
					vm.$Message.error(error);
				})
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
			},
			changepage2(page) {
				this.page2 = page
				this.getOrderData()
			},
			changepagesize2(pagesize) {
				this.pagesize2 = pagesize
				this.getOrderData()
			},
			getOrderData(){
				let vm = this
				let body={'taskid':vm.showtaskid}
				vm.loading2 = true
				let url="/OrderManage/getAllOrder?ispage=true&pageNum="+vm.page+"&pageSize="+vm.pagesize
				vm.$axios.post(url, body).then(function (data) {
					let code = data.data.code
					if (code === 1) {
						vm.loading2 = false
						vm.data2 = data.data.result.list
						vm.pagetotal2 = data.data.result.total
					} else {
						vm.$Message.error('产品列表查询失败失败!');
						vm.$Message.error(data.data.message);
					}
				}).catch(function (error) {
					vm.$Message.error(error);
				})
			},
			changeOrder(id,type){
				let vm = this
				let statue=type==='ok'? '1':'-2'

				let body={
					'id': id,
					'status': statue
				}
				vm.$axios.put("/OrderManage/updaOrder", body).then(function (data) {
					let code = data.data.code
					if (code === "1") {
						vm.$Message.success('Success!');
						vm.getOrderData()
					} else {
						vm.$Message.error('修改失败!');
					}
				}).catch(function (error) {
					vm.$Message.error(error);
				})
			}
		},
		created() {
			this.getdata();
		},
		watch: {
			modal(val) {
				if(val === false)
					this.$refs['updataTaskForm'].resetFields();
					this.getdata();
			},
		}
	}
</script>

<style lang="less">
	.cropper-example {
		height: 400px;
	}
</style>
