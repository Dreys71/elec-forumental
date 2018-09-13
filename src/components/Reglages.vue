<template>
    <div style="padding: 5px">
        <div class="md-layout md-gutter full-control">
            <div class="md-layout-item">
                <md-list>
                    <md-subheader>Notifications</md-subheader>

                    <md-list-item>
                        <md-checkbox v-model="config.notification.friend" value="preview"/>
                        <span class="md-list-item-text">Connexion d'un amis</span>
                    </md-list-item>

                    <md-list-item>
                        <md-checkbox v-model="config.notification.friendPM" value="sound"/>
                        <span class="md-list-item-text">Message privé</span>
                    </md-list-item>

                    <md-list-item>
                        <md-checkbox v-model="config.notification.newThread" value="vibrate"/>
                        <span class="md-list-item-text">Nouveau thread</span>
                    </md-list-item>

                    <md-list-item>
                        <md-checkbox v-model="config.notification.mention" value="light"/>
                        <span class="md-list-item-text">Mention</span>
                    </md-list-item>
                </md-list>
            </div>


            <div class="md-layout-item">
                <md-field>
                    <label for="theme">Theme</label>
                    <md-select v-model="theme" name="theme" id="theme">
                        <md-option value="default">Classique</md-option>
                        <md-option value="light">Allégé</md-option>
                        <md-option value="night">Nuit</md-option>
                        <md-option value="alexis">Alexis</md-option>
                        <md-option value="raph">Raph</md-option>
                    </md-select>
                </md-field>
            </div>

        </div>
        
    </div>

</template>

<script>
    export default {
        name: "reglages",
        data() {
            return {
                theme: this.$store.state.theme,
                config: this.$store.state.config
            }
        },
        watch: {
            theme:function (data,oldData) {
                this.$store.commit('changeTheme',data);
                console.log(this.$material);
                this.$material.theming.theme = data;

            }
        }
    }
</script>

<style scoped lang="scss">
    .full-control > .md-list {
        max-width: 100%;
        height: 400px;
        display: inline-block;
        overflow: auto;
        border: 1px solid rgba(#000, .12);
        vertical-align: top;
    }
</style>