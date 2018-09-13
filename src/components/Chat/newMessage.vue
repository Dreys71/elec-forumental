<template>
        <div class="divider dividerRed">
            <div></div>
            <span>Nouveaux messages</span>
            <div></div>
        </div>
</template>

<script>
    export default {
        name: "new-message"
    }
</script>

<style scoped>
    .divider.dividerRed {
        z-index: 1;
        text-transform: uppercase;
        min-height: 30px;
    }
    .divider {
        -ms-flex-align: center;
        -webkit-box-align: center;
        align-items: center;
        cursor: default;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        height: 0;
        margin-left: 20px;
        margin-right: 6px;
        position: relative;
        z-index: 0;
    }
    .divider:before {
        content: "";
        height: 1px;
        position: absolute;
        width: 100%;
        z-index: 0;
    }
    .divider.dividerRed>div {
        background: #f04747;
        opacity: .4;
    }
    .divider>div {
        content: "";
        flex: 1;
        height: 1px;
        position: relative;
        z-index: 1;
    }
    .divider>span {
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        line-height: 19px;
        padding: 0 10px;
        position: relative;
        z-index: 2;
    }
    .divider.dividerRed>span {
        color: rgba(240,71,71,.8);
    }
</style>