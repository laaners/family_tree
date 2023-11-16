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
			<svg ref="lines" class="lines"></svg>
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

.lines {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%; /* Set the width of the SVG container */
	height: 100%; /* Set the height of the SVG container */
}
</style>
