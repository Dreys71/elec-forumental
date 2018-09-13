<template>
    <div id="profil">
        <!-- SHARDS -->
        <md-card>
            <md-card-header>
                <md-card-header-text>
                    <div class="md-title">Vos shards</div>
                    <div class="md-subhead">{{this.$store.state.user.shards}}</div>
                </md-card-header-text>

                <md-card-media>
                    <img class="shardsimg" src="static/img/shard.png" alt="Logo shard | Money | forumental.io">
                </md-card-media>
            </md-card-header>

            <md-card-actions>
                <md-button>En savoir plus</md-button>
                <md-button>Acheter</md-button>
            </md-card-actions>
        </md-card>
        <!-- XP -->
        <md-card>
            <md-card-header>
                <div class="md-title">Votre expérience forumental</div>
            </md-card-header>

            <md-card-content>
                <div class="md-title">Niveau {{ this.$store.state.user.lvl }}</div>
                <div class="md-subhead">Niveau complété à {{ this.$store.state.user.lvl_percent }}%</div>
            </md-card-content>

            <md-card-actions>
                <md-button>En savoir plus</md-button>
            </md-card-actions>
        </md-card>
        <!-- IMAGE -->
        <md-card>
            <md-card-media>
                <md-ripple>
                    <img :src="this.$store.state.user.image" alt="Mon image de profil">
                </md-ripple>
            </md-card-media>

            <md-card-actions>
                <md-button class="md-icon-button" @click="update_my_pp = true" title="Modifier mon image de profil">
                    <md-icon>edit</md-icon>
                </md-button>
            </md-card-actions>
        </md-card>





        <md-dialog :md-active.sync="update_my_pp">
            <md-dialog-title>Modifier me photo de profil</md-dialog-title>

            <upload-image></upload-image>

            <md-dialog-actions>
                <md-button class="md-primary" @click="update_my_pp = false">Fermer</md-button>
            </md-dialog-actions>
        </md-dialog>

    </div>
</template>

<script>
    import UploadImage from "./Use/UploadImage.vue"
    export default {
        name: "profil",
        components: {
            UploadImage
        },
        data: () => ({
           update_my_pp: false
        })
    }
</script>

<style scoped>
    .md-card {
        width: 320px;
        margin: 4px;
        display: inline-block;
        vertical-align: top;
    }
    #profil img.shardsimg {
        height: 100%;
        width: auto;
    }
</style>