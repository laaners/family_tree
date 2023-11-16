<template>
	<div class="canvas" style="position: relative; height: 100vh; width: 100vw">
		<div
			class="family-tree"
			:style="{
				left: mutableLeft + 'px',
				top: mutableTop + 'px',
			}"
			oncontextmenu="return false;"
			draggable="true"
			@dragstart.prevent="startDrag"
			@drag="dragging"
			@dragend="endDrag"
			@touchstart.prevent="startDrag"
			@touchmove.prevent="dragging"
			@touchend.prevent="endDrag"
		>
			<family-member
				v-for="member of familyMembers"
				:key="member.nameSurname"
				:src="member.src"
				:name-surname="member.nameSurname"
				:birth-year="member.birthYear"
				:children="member.children"
				:spouse="getSpouse(member)"
			/>
			<!--
		<div
			class="test"
			:style="{
				width: '100px',
				height: '100px',
				color: 'white !important',
				backgroundColor: 'black !important',
			}"
		>
			ds
		</div>
        --></div>
	</div>
</template>

<script>
import FamilyMember from "~/components/FamilyMember.vue"

export default {
	components: {
		// eslint-disable-next-line vue/no-unused-components
		FamilyMember,
	},
	props: {
		familyMembers: {
			type: Array,
			required: true,
		},
		left: { required: true, type: Number },
		top: { required: true, type: Number },
	},
	data() {
		return {
			mutableLeft: this.left,
			mutableTop: this.top,
			offsetX: 0,
			offsetY: 0,
			drag: false,
			emittingInterval: undefined,
			initialDistance: 0,
			currentDistance: 0,
			zoom: 1,
			scale: 1,
			pinchInProgress: false,
			pinchedTimes: 0,
		}
	},
	mounted() {
		/*
		document.addEventListener("mousedown", this.startDrag)
		document.addEventListener("mousemove", this.dragging)
		document.addEventListener("mouseup", this.endDrag)
		*/

		document
			.querySelector(".canvas")
			.addEventListener("mousedown", this.startDrag)
		document
			.querySelector(".canvas")
			.addEventListener("mousemove", this.dragging)
		document
			.querySelector(".canvas")
			.addEventListener("mouseup", this.endDrag)

		document
			.querySelector(".canvas")
			.addEventListener("touchstart", (e) => {
				e.preventDefault()
				this.startDrag(e)
			})
		document.querySelector(".canvas").addEventListener(
			"touchmove",
			(e) => {
				e.preventDefault()
				this.dragging(e)
			},
			{
				passive: false,
			}
		)
		document.querySelector(".canvas").addEventListener("touchend", (e) => {
			e.preventDefault()
			this.endDrag(e)
		})
	},
	methods: {
		getSpouse(member) {
			return member.spouse
		},
		startDrag(e) {
			// if pinch
			if (
				e.touches !== undefined &&
				e.touches.length === 2 &&
				!this.pinchInProgress
			) {
				this.pinchInProgress = true

				const touch1 = e.touches[0]
				const touch2 = e.touches[1]

				// Calculate the initial distance between the two touches
				this.initialDistance = Math.hypot(
					touch1.clientX - touch2.clientX,
					touch1.clientY - touch2.clientY
				)
				return
			}

			const zoom = this.zoom

			const clientX =
				e.clientX !== undefined ? e.clientX : e.touches[0].clientX
			const clientY =
				e.clientY !== undefined ? e.clientY : e.touches[0].clientY

			this.offsetX =
				this.offsetX === 0
					? clientX / zoom - this.left
					: clientX / zoom - this.mutableLeft
			this.offsetY =
				this.offsetY === 0
					? clientY / zoom - this.top
					: clientY / zoom - this.mutableTop
			this.drag = true
		},
		dragging(e) {
			if (
				e.touches !== undefined &&
				e.touches.length === 2 &&
				this.pinchInProgress
			) {
				const touch1 = e.touches[0]
				const touch2 = e.touches[1]

				// Calculate the current distance between the two touches
				this.currentDistance = Math.hypot(
					touch1.clientX - touch2.clientX,
					touch1.clientY - touch2.clientY
				)

				// Calculate the pinch scale factor
				const scale = this.currentDistance / this.initialDistance

				// Update the zoom level
				// currentZoom = this.zoom
				// currentZoom : 1 = newZoom : scale
				// 1 : this.zoom =
				// eslint-disable-next-line no-console
				this.zoom = scale
				this.$emit("update:zoom", this.zoom)
				return
			}

			const clientX =
				e.clientX !== undefined ? e.clientX : e.touches[0].clientX
			const clientY =
				e.clientY !== undefined ? e.clientY : e.touches[0].clientY

			if (!this.drag || clientX === 0 || clientY === 0) return
			const zoom = this.zoom
			this.mutableLeft = clientX / zoom - this.offsetX
			this.mutableTop = clientY / zoom - this.offsetY
		},
		endDrag(e) {
			if (this.pinchInProgress) {
				// Reset the initial and current distances
				this.initialDistance = 0
				this.currentDistance = 0
				this.pinchInProgress = false
				this.pinchedTimes += 1
			}

			this.drag = false
		},
	},
}
</script>

<style scoped>
.family-tree {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;

	position: absolute;
	cursor: move;
}
</style>
