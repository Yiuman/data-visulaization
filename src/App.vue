<template>
    <div id="app">
        <router-view class="router"></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app',
    }
</script>

<style>
    body {
        margin: 0;
    }

    html, body, #app, .router {
        height: 100%;
    }
</style>
