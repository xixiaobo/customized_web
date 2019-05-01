<template>
	<!-- 账户管理 -->
	<!-- ctgcdn CTGCDN321 -->
	<div>
		<Row :gutter="15">
			<Col span="3" style="float: right;">
				<Button @click="toAddClass" icon="md-add" type="primary" style="width: 100%;">增加分类</Button>
			</Col>
		</Row>
		<Card dis-hover style="margin-top: 15px;">
			<Row>
				<Table border :columns="columns1" :data="data1" :loading="loading">
				</Table>
			</Row>
		</Card>
		<Modal v-model="modal" title="分类修改" width="500px">
			<Form ref="updataClassForm" :model="myclassify" :rules="ruleClass" :label-width="90" style="width: 400px;">
				<FormItem label="分类名称"  prop="classname">
					<i-input v-model="myclassify.classname"   placeholder="Enter classname"></i-input>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button @click="handleReturn" style="margin-left: 8px">返回</Button>
				<Button type="primary" @click="handleSubmit('updataClassForm')">修改</Button>
			</div>
		</Modal>
		<Modal v-model="modal3" title="添加分类" width="500px">
			<Form ref="addClassForm" :model="myclassify" :rules="ruleClass" :label-width="90" style="width: 400px;">
				<FormItem label="分类名称" prop="classname">
					<i-input v-model="myclassify.classname"   placeholder="Enter classname"></i-input>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button @click="handleReturn3" style="margin-left: 8px">返回</Button>
				<Button type="primary" @click="handleSubmit3('addClassForm')">添加</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	export default {
		name: 'workorder',
		data() {
			return {
				updateClass_id: '', // 修改信息時用户ID
				resetClass_id: '', //   重置密碼時
				loading: false,
				pagetotal: 0,
				page: 0,
				pagesize: 10,
				modal: false, // 修改模态框
				modal3: false, // 重置密码模态框
				myclassify: {
					classname: '',
					id:""
				},
				ruleClass: {
					classname: [{
						required: true,
						message: '分类名称不能为空！',
						trigger: 'blur'
					}],
				},
				columns1: [
					{
						title: '分类名',
						key: 'classname'
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
										content: '编辑',
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
											this.openModal(params.row, params.index)
										}
									}
								})]),
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
												this.delete(params.row.id)
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
				data1:[],
			}
		},
		methods: {
			toAddClass() {
				this.modal3 = true;
			},
			openModal(data) { // 修改表格信息模态框
				this.modal = true;
				this.myclassify = data
			},
			handleSubmit(name) { // 修改表格信息提交
				let vm = this
				vm.$refs[name].validate((valid) => {
					if(valid) {
						vm.$axios.put("/classifyManage/updaClassify", vm.myclassify).then(function (data) {
							let code = data.data.code
							if (code === "1") {
								vm.$Message.success('Success!');
								vm.modal = false;
							} else {
								vm.$Message.error('修改失败!');
							}
						}).catch(function (error) {
							vm.$Message.error(error);
						})

					}
				})
			},

			handleSubmit3(name) {
				let vm =this
				vm.$refs[name].validate((valid) => { // 验证
					if(valid) {
						vm.$axios.post("/classifyManage/addClassify", this.myclassify).then(function (data) {
							let code = data.data.code
							if (code === "1") {
								vm.$Message.success('Success!');
								vm.modal3 = false;
								vm.getdata()
							} else {
								vm.$Message.error('添加失败!');
							}
						}).catch(function (error) {
							vm.$Message.error(error);
						})
					}
				})

			},
			handleReturn() {
				this.modal = false;
			},
			handleReturn3() {
				this.modal3 = false;
			},
			handleReset(name) {
				this.$refs[name].resetFields();
			},
			delete(index) { // 删除
				let vm =this
				vm.$axios.get("/classifyManage/getProductNumById",{
					params:{
						classifyid:index
					}
				}).then(function (data) {
					let code = data.data.code
					if(code === '0') {
						vm.$Message.error('分类查询为空删除失败，请稍后重试！');
					} else {
						if(data.data.result<=0){
							vm.$axios.delete("/classifyManage/deleteClassify/"+index).then(function (data) {
								let code = data.data.code
								if(code === '0') {
									vm.$Message.error('分类删除失败，请稍后重试！');
								} else {
									vm.$Message.success('分类删除成功');
									vm.getdata()
								}
							}).catch(function (error) {
								vm.$Message.error(error);
							})
						}else {
							vm.$Message.error('分类下产品数不为空删除失败');
						}
					}
				}).catch(function (error) {
					vm.$Message.error(error);
				})

			},
			getdata() {
				let vm=this
				vm.loading = true
				vm.$axios.get("/classifyManage/getAllClassify", {
					params:{
						ispage: true,
						pageNum: this.page,
						pageSize: this.pagesize
					}
				}).then(function (data) {
					let code = data.data.code
					if (code === 1) {
						vm.loading = false
						vm.data1 = data.data.result
					} else {
						vm.$Message.error('分类列表查询失败失败!');
						vm.$Message.error(data.data.message);
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
					this.handleReset('updataClassForm');
					this.getdata();
			},
			modal3(val) {
				if(val === false) {
					this.handleReset('addClassForm');
				}
			},
		}
	}
</script>

<style lang="less">
	.cropper-example {
		height: 400px;
	}
</style>
