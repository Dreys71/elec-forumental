<template>
    <div>
        <md-card v-for="subcategory in content.subcategories" :key="subcategory.id">
            <md-card-media>
                <img :src="subcategory.background" alt="People">
            </md-card-media>

            <md-card-header>
                <div class="md-title">{{ subcategory.title }}</div>
                <div class="md-subhead">
                    {{ subcategory.threads.length }} thread(s)
                </div>
            </md-card-header>

            <md-card-expand>
                <md-card-actions md-alignment="space-between">
                    <div>
                        <md-button :to="'/forum/' + forum_key + '/' + category + '/' + subcategory.id">Aller</md-button>
                    </div>

                    <md-card-expand-trigger>
                        <md-button>Info</md-button>
                    </md-card-expand-trigger>
                </md-card-actions>

                <md-card-expand-content>
                    <md-card-content>
                         {{ subcategory.description }}
                    </md-card-content>
                </md-card-expand-content>
            </md-card-expand>
        </md-card>
    </div>
</template>

<script>
    export default {
        name: "subcategories",
        data: () => ({
            forum_key: null,
            category: null,
            content: null
        }),
        created() {
            this.category = this.$route.params.cat;
            this.forum_key = this.$route.params.key;
        },
        mounted() {
            console.log("Mounted")
            this.category = this.$route.params.cat;
            this.forum_key = this.$route.params.key;

            let forumKey = this.$store.state.myForums.findIndex(x => x.identificator == this.forum_key);
            console.log(forumKey)
            if(forumKey !== -1){
                let cat = this.$store.state.myForums[forumKey].categories.findIndex(x => x.id = this.category);
                if(cat !== -1){
                    this.content = this.$store.state.myForums[forumKey].categories[cat]
                }
            }
        }
    }
</script>

<style scoped>
    .card-expansion {
        height: 480px;
    }

    .md-card {
        width: 320px;
        margin: 4px;
        display: inline-block;
        vertical-align: top;
    }
</style>