<template>
    <div id="app">
        <DragBoard></DragBoard>
    </div>
</template>

<script>
    import DragBoard from './components/DragBoard.vue'

    export default {
        name: 'app',
        components: {
            DragBoard
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
        height: 100%;
    }
</style>
