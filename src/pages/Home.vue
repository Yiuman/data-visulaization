<template>
    <div class="home">
        <DragBoard></DragBoard>
    </div>

</template>

<script>
    import DragBoard from '../components/DragBoard'

    export default {
        name: "Home",
        components: {
            DragBoard
        }
    }
</script>

<style scoped>
    .home {
        height: 100%;
    }
</style>