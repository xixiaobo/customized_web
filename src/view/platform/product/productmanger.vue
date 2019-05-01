<template>
	<!-- 账户管理 -->
	<!-- ctgcdn CTGCDN321 -->
	<div>
		<Row :gutter="15">
			<Col span="3" style="float: right;">
				<Button @click="toAddProduct" icon="md-add" type="primary" style="width: 100%;">增加产品</Button>
			</Col>
		</Row>
		<Card dis-hover style="margin-top: 15px;">
			<Row>
				<Table border :columns="columns1" :data="data1" :loading="loading">
				</Table>
				<Page style="margin-top: 10px;float: right;" :total="pagetotal" :page-size="pagesize" @on-change="changepage" @on-page-size-change="changepagesize" show-elevator show-total show-sizer/>
			</Row>
		</Card>
		<Modal v-model="modal" title="账户修改" width="750px">
			<Form ref="updataProductForm" :model="updataproduct" :rules="ruleUpadtaProduct" :label-width="90" style="width: 400px;">
				<FormItem label="产品名称" prop="productname">
					<i-input v-model="updataproduct.productname" placeholder="Enter your productname"></i-input>
				</FormItem>
				<FormItem label="分类" prop="classid">
					<Select v-model="updataproduct.classid" placeholder="Select your role">
						<Option v-for="item in classfiyGroup" :value="item.id" :key="item.id">{{ item.classname }}</Option>
					</Select>
				</FormItem>
				<FormItem label="产品简介">
					<Input type="textarea" v-model="updataproduct.productabstract"  placeholder="Enter your productabstract">
					</Input>
				</FormItem>
				<FormItem label="产品封面图片" >
					<div class="demo-upload-list" v-if="isdefaultImage">
						<template>
							<img :src="updataproduct.defaultImage">
							<div class="demo-upload-list-cover">
								<Icon type="ios-eye-outline" @click.native="handleView(updataproduct.defaultImage)"></Icon>
								<Icon type="ios-trash-outline" @click.native="defaultImageRemove"></Icon>
							</div>
						</template>
					</div>
					<div v-if="isdefaultImage === false">
						<Upload
								ref="defaultImageUpload"
								:show-upload-list="false"
								:format="['jpg','jpeg','png']"
								:max-size="2048"
								:before-upload="defaultImageAdd"
								multiple
								type="drag"
								action=""
								style="display: inline-block;width:58px;">
							<div style="width: 58px;height:58px;line-height: 58px;">
								<Icon type="ios-camera" size="20"></Icon>
							</div>
						</Upload>
					</div>
				</FormItem>
				<FormItem label="产品详情" >
				</FormItem>
				<div class="edit_container" style="margin-left: 10px;width: 700px;height: 270px;margin-bottom: 20px">
					<quill-editor
							v-model="updataproduct.content"
							ref="myQuillEditor"
							:options="editorOption" style="height: 200px;">
					</quill-editor>
				</div>
			</Form>
			<div slot="footer">
				<Button @click="handleReturn" style="margin-left: 8px">返回</Button>
				<Button type="primary" @click="handleSubmit('updataProductForm')">修改</Button>
			</div>
		</Modal>
		<Modal v-model="modal3" title="修改图片" width="500px">
			<div>
				<div class="demo-upload-list" v-for="(item,index)  in imagesList" :key="index">
					<template>
						<img :src="item.imagebase64">
						<div class="demo-upload-list-cover">
							<Icon type="ios-eye-outline" @click.native="handleView(item.imagebase64)"></Icon>
							<Icon type="ios-trash-outline" @click.native="handleRemove(index,item)"></Icon>
						</div>
					</template>
				</div>
				<Upload
						ref="imagesupload"
						:show-upload-list="false"
						:format="['jpg','jpeg','png']"
						:max-size="2048"
						:before-upload="imagesListAdd"
						multiple
						type="drag"
						action=""
						style="display: inline-block;width:58px;">
					<div style="width: 58px;height:58px;line-height: 58px;">
						<Icon type="ios-camera" size="20"></Icon>
					</div>
				</Upload>
			</div>
			<div slot="footer">
				<Button @click="handleReturn" style="margin-left: 8px">返回</Button>
				<Button type="primary" @click="handleSubmit3">修改</Button>
			</div>
		</Modal>
		<Modal title="展示图片" v-model="visible">
			<img :src="imgName" v-if="visible" style="width: 100%">
		</Modal>
	</div>
</template>

<script>
	export default {
		name: 'productmanger',
		data() {
			return {
				updataimages_productId: '', //  修改图片时時
				loading: false,
				classfiyGroup: [],
				pagetotal: 0,
				page: 0,
				pagesize: 10,
				modal: false, // 修改模态框
				modal3: false, // 重置密码模态框
				updataproduct: {
					'classid': 0,
					'productabstract':'',
					'content': '',
					'defaultImage': '',
					'productname': '',
					'userid': '',
				},
				oldData:{},
				ruleUpadtaProduct: {
					productname: [{
						required: true,
						message: '产品名称不能为空',
						trigger: 'blur'
					}],
					classid: [{
						required: true,
						message: '分类不能为空',
						type: 'number',
						trigger: 'change'
					}],
				},
				columns1: [
					{
						title: '产品名',
						key: 'productname',
						render: (h, params) => {
							return h('div', [
									h('a',{
										on: {
											click: () => {
												this.$router.push({
													path: '/productDetails/'+params.row.id
												})
											},
										}
									},params.row.productname)
							]);
						}
					},
					{
						title: '所属分类',
						key: 'classname'
					},
					{
						title: '所属用户',
						key: 'username'
					},
					{
						title: '产品描述',
						key: 'productabstract'
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
										content: '修改产品图片',
										placement: 'top'
									},
								}, [h('Button', {
									props: {
										type: 'primary',
										size: 'small',
										icon: 'md-eye',
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.changimagesModal(params.row, params.index)
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
												console.info(params.row.id)
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
				imagesList: [],
				deleteimagesid:[],
				addimages:[],
				isdefaultImage:false,
				imgName: '',
				visible: false,
				editorOption: {},
			}
		},
		methods: {
			toAddProduct() {
				this.$router.push({
					name: 'addproduct'
				})
			},
			openModal(data) {
				this.modal = true;
				this.updataproduct = data
				this.getClassfiy()
				if(this.updataproduct.defaultImage!==null&& this.updataproduct.defaultImage!==''&& this.updataproduct.defaultImage!=='null'){
					this.isdefaultImage=true
				}
				for(let key in this.updataproduct) {
					this.oldData[key]=this.updataproduct[key]
				}
			},
			changimagesModal(data) {
				let vm = this
				vm.modal3 = true;
				vm.updataimages_productId = data.id;
				let body={
					"productid": vm.updataimages_productId
				}
				vm.$axios.post("/ImageManage/getAllImage", body).then(function (data) {
					let code = data.data.code
					if (code === 1) {
						vm.imagesList=data.data.result
					} else {
						vm.$Message.error('产品图片获取失败!');
					}
				}).catch(function (error) {
					vm.$Message.error(error);
				})
			},
			handleSubmit(name) { // 修改表格信息提交
				let vm =this
				vm.$refs[name].validate((valid) => { // 验证
					if(valid) {
						let params = vm.updataproduct;
						let oldparams = vm.oldData;
						let newparams = {};
						for(let key in params) {
							if (params[key] !== oldparams[key]){
								newparams[key]=params[key]
							}
						}
						newparams.id=params.id
						vm.$axios.put("/productManage/updaProduct", newparams).then(function (data) {
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
			handleSubmit3() {
				let vm =this
				let body={
					"productid":vm.updataimages_productId,
					"deleteImagesId":vm.deleteimagesid,
					"addImages":vm.addimages
				}
				vm.$axios.put("/ImageManage/updataImagesByProductid", body).then(function (data) {
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
				this.modal3 = false;
			},
			delete(index) { // 删除
				let vm =this
				let body=[
						index
				]
				console.info(body)
				vm.$axios.delete("/productManage/deleteProduct", {data: body}).then(function (data) {
					let code = data.data.code
					if(code === '0') {
						vm.$Message.error('产品删除失败，请稍后重试！');
					} else {
						vm.$Message.success('产品删除成功');
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
				let body={}
				if(vm.$store.state.user.role!=='admin'){
					body["userid"]=vm.$store.state.user.id
				}
				vm.loading = true
				let url="/productManage/getmeroProduct?ispage=true&pageNum="+vm.page+"&pageSize="+vm.pagesize
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
			handleView (name) {
				this.imgName = name;
				this.visible = true;
			},
			defaultImageRemove(){
				this.updataproduct.defaultImage=''
				this.isdefaultImage=false
			},
			defaultImageAdd(file){
				if (file.type!=="image/png"&&file.type!=="image/jpeg"&&file.type!=="image/jpg") {
					this.$Notice.warning({
						title: '这个文件的类型有误',
						desc: '文件：' + file.name + ' 经检测类似不是jpg or png.'
					});
					return false
				}
				const check = this.imagesList.length < 1;
				if (!check) {
					this.$Notice.warning({
						title: '最多只能上传1张图片.'
					});
					return false
				}
				let reader = new FileReader();
				let imgFile
				// let that = this
				reader.readAsDataURL(file)
				reader.onload = e => {
					imgFile = e.target.result;
					this.updataproduct.defaultImage=imgFile
					this.isdefaultImage=true
				}
				return false
			},
			handleRemove (index,data) {
				this.imagesList.splice(index,1);
				if(data.isnew){
					for (let i=0;i<this.addimages.length;i++){
						if(data===this.addimages[i]){
							this.addimages.splice(i,1);
							break;
						}
					}
				}else {
					this.deleteimagesid.push(data.id)
				}
			},
			imagesListAdd (file) {
				if (file.type!=="image/png"&&file.type!=="image/jpeg"&&file.type!=="image/jpg") {
					this.$Notice.warning({
						title: '这个文件的类型有误',
						desc: '文件：' + file.name + ' 经检测类似不是jpg or png.'
					});
					return false
				}
				const check = this.imagesList.length < 5;
				if (!check) {
					this.$Notice.warning({
						title: '最多只能上传5张图片.'
					});
					return false
				}
				let reader = new FileReader();
				let imgFile
				// let that = this
				reader.readAsDataURL(file)
				reader.onload = e => {
					imgFile = e.target.result;
					let data={
						'imagebase64': imgFile,
						'isnew': true
					}
					this.imagesList.push(data)
					this.addimages.push(imgFile)
				}
				return false
			},

		},
		created() {
			this.getdata();
		},
		watch: {
			modal(val) {
				if(val === false)
					this.$refs['updataProductForm'].resetFields();
					this.getdata();
			},
			modal3(val) {
				if(val === false)
					this.addimages=[]
					this.imagesList=[]
					this.deleteimagesid=[]
			},
		}
	}
</script>

<style lang="less">
	.cropper-example {
		height: 400px;
	}
</style>
