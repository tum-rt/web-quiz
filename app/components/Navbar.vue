<template>
    <div class="nav">
        <slot></slot>
    </div>
</template>

<script>
export default {}
</script>

<style>
@media screen and (min-width: 500px) {
    .nav {
        width: 50rem;
    }
}

@media screen and (max-width: 499px) {
    .nav {
        left: 1rem;
        right: 1rem;
    }
}

.nav {
    position: fixed;
    z-index: 1000;
    top: 0;
    background-color: white;
    border-bottom: 1px solid black;
    margin: 0;
}
</style>
