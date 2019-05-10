<template>
	<!-- 账户管理 -->
	<!-- ctgcdn CTGCDN321 -->
	<div>
		<Row :gutter="15">
			<Col span="3" style="float: right;">
				<Button @click="toAddUser" icon="md-add" type="primary" style="width: 100%;">增加用户</Button>
			</Col>
<!--			<Col span="10">-->
<!--				<i-input v-model="searchValue" placeholder="Enter search..." style="width: 250px"></i-input>-->
<!--				<Button style='margin-left: 15px;' @click="searchUser" icon="ios-search" type="primary">搜索</Button>-->
<!--			</Col>-->
		</Row>
		<Card dis-hover style="margin-top: 15px;">
			<Row>
				<Table border :columns="columns1" :data="data1" :loading="loading">
				</Table>
				<Page style="margin-top: 10px;float: right;" :total="pagetotal" :page-size="pagesize" @on-change="changepage" @on-page-size-change="changepagesize" show-elevator show-total show-sizer/>
			</Row>
		</Card>
		<Modal v-model="modal" title="账户修改" width="500px">
			<Form ref="updataUserForm" :model="updataUser" :rules="ruleUpdataUser" :label-width="90" style="width: 400px;">
				<FormItem label="登陆名称">
					<i-input v-model="updataUser.username" readonly placeholder="Enter your loginName"></i-input>
				</FormItem>
				<FormItem label="角色" prop="role">
					<i-select v-model="updataUser.role" placeholder="Select your role">
						<Option v-for="item in permissionGroup" :value="item.label" :key="item.label">{{ item.value }}</Option>
					</i-select>
				</FormItem>
				<FormItem label="用户名称" prop="realname">
					<i-input v-model="updataUser.realname" placeholder="Enter your realName"></i-input>
				</FormItem>
				<FormItem label="电话" prop="phone">
					<i-input v-model="updataUser.phone" placeholder="Enter your telephoneNumber"></i-input>
				</FormItem>
				<FormItem label="邮箱" prop="email">
					<i-input v-model="updataUser.email" placeholder="Enter your email"></i-input>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button @click="handleReturn" style="margin-left: 8px">返回</Button>
				<Button type="primary" @click="handleSubmit('updataUserForm')">修改</Button>
			</div>
		</Modal>
		<Modal v-model="modal3" title="重置密码" width="500px">
			<div style="text-align: center;">重置密码为: 123456</div>
			<div slot="footer">
				<Button @click="handleReturn3" style="margin-left: 8px">返回</Button>
				<Button type="primary" @click="handleSubmit3">修改</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	export default {
		name: 'workorder',
		data() {

			const isPhoneNum = (rule, value, callback) => {
				console.info(rule)
				console.info(value)
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
				updateUser_id: '', // 修改信息時用户ID
				resetUser_id: '', //   重置密碼時
				searchValue: '', // 搜索內容
				loading: false,
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
				pagetotal: 0,
				page: 0,
				pagesize: 10,
				modal: false, // 修改模态框
				modal3: false, // 重置密码模态框
				updataUser: {
					realname: '',
					username: '',
					role: '',
					phone: '',
					email: ''
				},
				ruleUpdataUser: {
					realname: [{
						required: true,
						message: '用户名称不能为空！',
						trigger: 'blur'
					}],
					role: [{
						required: true,
						message: '角色不能为空!',
						trigger: 'change'
					}],
					phone: [{
						validator: isPhoneNum,
						trigger: 'blur'
					}],
					email: [{
						required: true,
						message: '邮箱不能为空!',
						trigger: 'blur'
					},
						{
							type: 'email',
							message: '邮箱格式不正确!',
							trigger: 'blur'
						}
					],
				},
				columns1: [
					{
						title: '用户名',
						key: 'username'
					},
					{
						title: '角色',
						key: 'role',
						render: (h, params) => {
							let name = "-"
							this.permissionGroup.forEach(function(value) {
								if(params.row.role===value.label) {
									name = value.value
								}
							})
							return h('div', name)
						}
					},
					{
						title: '真实姓名',
						key: 'realname'
					},
					{
						title: '手机号',
						key: 'phone'
					},
					{
						title: '邮箱',
						key: 'email'
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
										content: '重置密码',
										placement: 'top'
									}
								}, [
									h('Poptip', {
										props: {
											confirm: true,
											title: '是否重置密码！',
											type: 'primary',
											transfer: true
										},
										on: {
											'on-ok': () => {
												this.resetPasswordModal(params.row, params.index)
											}
										}
									}, [
										h('Button', {
											props: {
												type: 'primary',
												size: 'small',
												icon: 'ios-lock',
											},
											style: {
												marginRight: '5px'
											}
										})
									])
								]),
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
				data1: [],
				oldData:{},
			}
		},
		methods: {
			searchUser() { // 根据指定条件查询用户
				this.loading = true
				//				console.log(this.searchValue)
				// userinfo_getUserByKeys({
				// 	realname: this.searchValue
				// }).then(res => {
				// 	this.loading = false
				// 	console.log(res)
				// 	this.searchValue = '';
				// 	this.data1 = res.data.result
				// 	this.pagetotal = res.data.result.length;
				// })
			},
			toAddUser() {
				this.$router.push({
					name: 'adduser'
				})
			},
			openModal(data) { // 修改表格信息模态框
				this.modal = true;
				this.updataUser = data
				for(let key in this.updataUser) {
					this.oldData[key]=this.updataUser[key]
				}
			},
			resetPasswordModal(data) { // 重置密码模态框
				this.modal3 = true;
				this.resetUser_id = data.id;
			},

			handleSubmit(name) { // 修改表格信息提交
				let vm =this
				vm.$refs[name].validate((valid) => { // 验证
					if(valid) {
						let params = vm.updataUser;
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
								vm.modal = false;
							} else {
								vm.$Message.error('修改失败!');
							}
						}).catch(function (error) {
							vm.$Message.error(error);
						})
						// userinfo_updateuser(params).then(res => {

						// })
					} else {
						// this.$Message.error('Fail!');
					}
				})
			},

			handleSubmit3() { // 重置密碼提交
				let vm =this
				let body={
					"id":vm.resetUser_id,
					"Password":"123456"
				}
				vm.$axios.put("/userManage/updataUserPassword", body).then(function (data) {
					let code = data.data.code
					if (code === "1") {
						vm.$Message.success('Success!');
						vm.modal3 = false;
					} else {
						vm.$Message.error('修改失败!');
					}
				}).catch(function (error) {
					vm.$Message.error(error);
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
				vm.$axios.delete("/userManage/deleteUser/"+index).then(function (data) {
					let code = data.data.code
					if(code === '0') {
						vm.$Message.error('用户删除失败，请稍后重试！');
					} else {
						vm.$Message.success('用户删除成功');
						vm.getdata()
					}
				}).catch(function (error) {
					vm.$Message.error(error);
				})
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
				vm.loading = true
				vm.$axios.get("/userManage/getAllUsers", {
					params:{
						ispage: true,
						pageNum: this.page,
						pageSize: this.pagesize
					}
				}).then(function (data) {
					let code = data.data.code
					if (code === 1) {
						vm.loading = false
						vm.data1 = data.data.result.list
						vm.pagetotal = data.data.result.total
					} else {
						vm.$Message.error('用户列表查询失败失败!');
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
					this.handleReset('updataUserForm');
					this.getdata();
			},
			modal2(val) {
				if(val === false) {
					this.handleReset('formValidate2');
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
