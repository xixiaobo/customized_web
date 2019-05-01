<template>
	<!-- 账户管理 -->
	<!-- ctgcdn CTGCDN321 -->
	<div>
		<Card dis-hover style="margin-top: 15px;">
			<Row>
				<Table border :columns="columns1" :data="data1" :loading="loading">
				</Table>
				<Page style="margin-top: 10px;float: right;" :total="pagetotal" :page-size="pagesize" @on-change="changepage" @on-page-size-change="changepagesize" show-elevator show-total show-sizer/>
			</Row>
		</Card>
	</div>
</template>

<script>
	export default {
		name: 'workorder',
		data() {
			return {
				loading: false,
				pagetotal: 0,
				page: 0,
				pagesize: 10,
				columns1: [
					{
						title: '任务id',
						key: 'taskid',
						render: (h, params) => {
							return h('div', [
									h('a',{
										on: {
											click: () => {
												this.$router.push({
													path: '/taskDetails/'+params.row.taskid
												})
											},
										}
									},params.row.taskid)
							]);
						}
					},
					{
						title: '状态',
						key: 'status',
						render: (h, params) => {
							let name=''
							if(params.row.status==='0'){
								name="待确认"
							}else if(params.row.status==='1'){
								name="确认"
							}else if(params.row.status==='-2'){
								name="拒绝"
							}else if(params.row.status==='-2'){
								name="失效"
							}
							return h('Tag',name)
						}
					},
					{
						title: '申请时间',
						key: 'createtime'
					},
					{
						title: '结束时间',
						key: 'overtime'
					},
					{
						title: '操作',
						key: 'action',
						// width: 150,
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('Button', {
									props: {
										type: 'primary',
										size: 'small',
										icon: 'md-clipboard',
									},
									style: {
										marginRight: '5px'
									},
									on:{
										click: () => {
											this.$router.push({
												path: '/taskDetails/'+params.row.taskid
											})
										},
									}
								}),
								h('Tooltip', {
									props: {
										content: '取消订单',
										placement: 'top'
									},
									style: {
										display:(params.row.status==='0')?"inline-block":"none",
									},
								}, [
									h('Poptip', {
										props: {
											confirm: true,
											title: '确定要取消吗！',
											type: 'primary',
											transfer: true
										},
										on: {
											'on-ok': () => {
												this.realdelete(params.row.id)
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
									},
									style: {
										display:(params.row.status!=='0')?"inline-block":"none",
									},
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
			}
		},
		methods: {
			realdelete(id) {
				let vm =this;
				vm.$axios.delete("/OrderManage/realdeleteOrder/"+id).then(function (data) {
					let code = data.data.code;
					if(code === '0') {
						vm.$Message.error('订单取消失败，请稍后重试！');
					} else {
						vm.$Message.success('订单取消成功');
						vm.getdata();
					}
				}).catch(function (error) {
					vm.$Message.error(error);
				})
			},
			delete(id) { // 删除
				let vm =this;
				vm.$axios.delete("/OrderManage/deleteOrder/"+id).then(function (data) {
					let code = data.data.code;
					if(code === '0') {
						vm.$Message.error('订单删除失败，请稍后重试！');
					} else {
						vm.$Message.success('订单删除成功');
						vm.getdata()
					}
				}).catch(function (error) {
					vm.$Message.error(error);
				})
			},
			changepage(page) {
				this.page = page;
				this.getdata();
			},
			changepagesize(pagesize) {
				this.pagesize = pagesize;
				this.getdata();
			},
			getdata() {
				let vm=this;
				let body={};
				if(vm.$store.state.user.role!=='admin'){
					body["orderuserid"]=vm.$store.state.user.id;
				}
				body["isdelete"]=0;
				vm.loading = true;
				let url="/OrderManage/getAllOrder?ispage=true&pageNum="+vm.page+"&pageSize="+vm.pagesize;
				vm.$axios.post(url, body).then(function (data) {
					let code = data.data.code;
					if (code === 1) {
						vm.loading = false;
						vm.data1 = data.data.result.list;
						vm.pagetotal = data.data.result.total;
					} else {
						vm.$Message.error('订单列表查询失败失败!');
						vm.$Message.error(data.data.message);
					}
				}).catch(function (error) {
					vm.$Message.error(error);
				})
			},
		},
		created() {
			this.getdata();
		},
	}
</script>

<style lang="less">
	.cropper-example {
		height: 400px;
	}
</style>
