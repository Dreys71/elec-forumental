<template>
    <div>
        <file-upload :url='url' :thumb-url='thumbUrl' :headers="headers" @error="uploadError" @change="onFileChange"></file-upload>

        <md-snackbar md-position="center" :md-duration="duration" :md-active.sync="showSnackbar" md-persistent>
            <span>{{rep}}</span>
        </md-snackbar>
    </div>

</template>

<script>
    export default {
        data () {
            return {
                url: 'http://localhost:8000/api/user/image/change',
                headers: {'Authorization': this.$store.state.user.api_token},
                showSnackbar: false,
                image: '',
                position: 'center',
                duration: 4000,
                isInfinity: false,
                rep:''
            }
        },
        methods: {
            thumbUrl (file) {
                return file.myThumbUrlProperty
            },
            onFileChange (file) {
                // Handle files like:
                this.rep = file.message
                this.showSnackbar = true
                this.$store.commit("change_my_image", file.myThumbUrlProperty)
                this.$socket.emit('update my profile picture', {
                    id: this.$store.state.user.id,
                    image: file.myThumbUrlProperty
                });
            },
            uploadError (error) {
                this.rep = error.message
                this.showSnackbar = true
            }
        }
    }
</script>