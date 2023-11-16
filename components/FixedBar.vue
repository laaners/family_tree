<template>
	<header class="fixed-bar">
		<input
			v-model="sliderZoom"
			type="range"
			min="10"
			max="500"
			class="slider"
		/>
	</header>
</template>

<script>
export default {
	data() {
		return {
			zoom: 1,
			sliderZoom: 100,
		}
	},
	watch: {
		sliderZoom(newV, oldV) {
			this.zoom = this.sliderZoom / 100
			this.$emit("update:zoom", this.sliderZoom / 100)
		},
	},
	methods: {
		increaseZoom() {
			this.zoom *= 1.1
			this.$emit("update:zoom", this.zoom)

			this.holdInterval = setInterval(() => {
				this.zoom *= 1.1
				this.$emit("update:zoom", this.zoom)
			}, 100)
		},
		decreaseZoom() {
			this.zoom *= 0.9
			this.$emit("update:zoom", this.zoom)

			this.holdInterval = setInterval(() => {
				this.zoom *= 0.9
				this.$emit("update:zoom", this.zoom)
			}, 100)
		},
		endTouch() {
			clearInterval(this.holdInterval)
		},
	},
}
</script>

<style scoped>
.fixed-bar {
	color: lightgreen;

	position: fixed; /*STICK TO A POSITION BASED ON ENTIRE HTML, STAY SAME WHEN SCROLL*/

	bottom: 40px;

	width: 100%;
	height: var(--header-padding);
	z-index: 1000;

	display: flex;
	justify-content: flex-start;
}

.slider {
	margin: 20px;

	width: 100%;
	height: 10px;
	border-radius: 5px;
	background: var(--color-light);
	outline: none;
	opacity: 0.7;
	-webkit-transition: 0.2s;
	transition: opacity 0.2s;
}

.slider::-webkit-slider-thumb {
	appearance: none;
	width: 50px; /* Adjusted width for the slider thumb */
	height: 50px; /* Adjusted height for the slider thumb */
	background: var(--color-dark);
	border-radius: 50%;
}

.slider:hover {
	opacity: 1;
}
</style>
