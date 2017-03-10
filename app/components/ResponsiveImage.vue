<template>
    <img class="img-responsive" :src="src" :srcset="srcset" :alt="alt" />
</template>

<script>
const isString = (x) => typeof x === "string";

export default {
    props: ["snippet"],
    computed: {
        srcset() {
            if(isString(this.snippet) || !this.snippet.srcset) {
                return "";
            }
            return Object.keys(this.snippet.srcset).map((key) => {
                return `${key} ${this.snippet.srcset[key]}`;
            }).join(",");
        },
        src() {
            if(isString(this.snippet)) {
                return this.snippet;
            }
            return this.snippet.src;
        },
        alt() {
            if(isString(this.snippet) || !this.snippet.alt) {
                return "";
            }
            return this.snippet.alt;
        }
    }
}
</script>
