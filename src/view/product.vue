<template>
    <div>dsd: {{a}}</div>
</template>

<script>
    export default {
        name: "product",
        data(){
            return{
                a:"1"
            }
        },
        methods:{
            init(){
                if(this.$route.params.a === null||this.$route.params.a === 'null'){
                    this.$router.go(-1)
                }
                this.a=this.$route.params.a

            }
        },
        watch:{
            "$route":{
                handler(){
                    this.init()
                }
            }
        },
        created() {
            this.init()
        }
    }
</script>

<style scoped>

</style>