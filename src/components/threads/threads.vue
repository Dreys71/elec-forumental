<template>
    <div>
        <h1>THREADS LIST</h1>
    </div>
</template>

<script>
    export default {
        name: "threads",
        data: () => ({
           forum_key: null,
            category: null,
           subcategory: null,
           threads: []
        }),
        created() {
            this.category = this.$route.params.cat;
            this.subcategory = this.$route.params.subcat;
            this.forum_key = this.$route.params.key;
        },
        mounted() {
            this.category = this.$route.params.cat;
            this.subcategory = this.$route.params.subcat;
            this.forum_key = this.$route.params.key;

            let forumKey = this.$store.state.myForums.findIndex(x => x.forum_key == this.forum_key);
            if(forumKey !== -1){
                this.threads = this.$store.state.myForums[this.forum_key];
            }
        }
    }
</script>

<style scoped>

</style>