<template>
    <img class="img-responsive" :src="snippet.source_1x" :srcset="srcset"
        :alt="snippet.description" />
</template>

<script>
export default {
    props: ["snippet"],
    computed: {
        srcset() {
            return ["1x", "2x", "4x"]
                .filter((key) => this.snippet[`source_${key}`])
                .map((key) => `${this.snippet["source_" + key]} ${key}`)
                .join(",");
        }
    }
}
</script>
