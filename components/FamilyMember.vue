<template>
	<div class="flex-col family-member">
		<div class="flex-row" style="align-items: flex-start">
			<div
				:id="nameSurname.replaceAll(' ', '')"
				:ref="nameSurname.replaceAll(' ', '')"
				class="flex-col member-card"
			>
				<img
					src="/family_tree/edit.png"
					class="edit-icon"
					@click="openModal(nameSurname)"
					@touchstart="openModal(nameSurname)"
				/>
				<img
					ref="avatar"
					class="avatar"
					loading="lazy"
					:src="src.avatar1 + '&' + new Date().getTime()"
					:alt="nameSurname"
				/>
				<p class="name-surname">{{ nameSurname }}</p>
				<!--
				<p class="birth-year">{{ birthYear }}</p>
				-->
			</div>
			<div
				v-if="spouse !== undefined && spouse.nameSurname.length > 0"
				:id="spouse.nameSurname.replaceAll(' ', '')"
				:ref="spouse.nameSurname.replaceAll(' ', '')"
				class="flex-col member-card"
			>
				<img
					src="/family_tree/edit.png"
					class="edit-icon"
					@click="openModal(spouse.nameSurname)"
					@touchstart="openModal(spouse.nameSurname)"
				/>
				<img
					class="avatar"
					loading="lazy"
					:src="spouse.src.avatar1 + '&' + new Date().getTime()"
					:alt="spouse.nameSurname"
				/>
				<p class="name-surname">{{ spouse.nameSurname }}</p>
				<!--
				<p class="birth-year">{{ spouse.birthYear }}</p>
				-->
			</div>
		</div>
		<div
			v-if="children !== undefined && children.length > 0"
			class="flex-row"
		>
			<family-member
				v-for="member of children"
				:key="member.nameSurname"
				:src="member.src"
				:name-surname="member.nameSurname"
				:birth-year="member.birthYear"
				:children="member.children"
				:spouse="member.spouse"
				:parent-a="nameSurname"
				:parent-b="spouse.nameSurname"
			/>
		</div>
	</div>
</template>

<script>
import { mapMutations } from "vuex"
export default {
	name: "FamilyMember",
	props: {
		src: {
			type: Object,
			required: true,
		},
		nameSurname: {
			type: String,
			required: true,
		},
		children: { type: Array, required: true },
		// eslint-disable-next-line vue/require-default-prop
		birthYear: {
			type: String,
			required: false,
		},
		// eslint-disable-next-line vue/require-default-prop
		spouse: {
			type: Object,
			required: false,
		},
		// eslint-disable-next-line vue/require-default-prop
		parentA: {
			type: String,
			required: false,
		},
		// eslint-disable-next-line vue/require-default-prop
		parentB: {
			type: String,
			required: false,
		},
	},
	watch: {
		async "$store.state.modalNameSurname"(newV, oldV) {
			if (!this.$store.state.modalVisible && oldV === this.nameSurname) {
				const fmData = await this.$axios.$get(
					`${this.$store.state.serverUrl}/family_member/${this.nameSurname}`
				)
				this.fmData = fmData
				setTimeout(() => {
					this.$refs.avatar.src =
						fmData.src.avatar1 + "&" + new Date().getTime()
				}, 500)
			}
		},
	},
	mounted() {
		const fm = this.$refs[this.nameSurname.replaceAll(" ", "")]
		const fmRect = fm.getBoundingClientRect()

		let x1, x2, y1, y2

		return

		// eslint-disable-next-line no-unreachable
		if (this.spouse && this.spouse.nameSurname.length > 0) {
			const spouse =
				this.$refs[this.spouse.nameSurname.replaceAll(" ", "")]
			const spouseRect = spouse.getBoundingClientRect()

			// horizontal
			x1 = fmRect.left + fmRect.width / 2
			x2 = spouseRect.left + spouseRect.width / 2
			y1 = fmRect.top + fmRect.height / 2
			y2 = spouseRect.top + spouseRect.height / 2
			this.drawLine(x1, y1, x2, y2)

			// vertical
			x1 = fmRect.right + (spouseRect.left - fmRect.right) / 2
			x2 = x1
			y1 = fmRect.top + fmRect.height / 2
			y2 = fmRect.bottom + 25
			this.drawLine(x1, y1, x2, y2)

			// heart
			this.drawHeart(fmRect.right, y1)
		}
		if (this.parentA !== undefined && this.parentB !== undefined) {
			const pARect = document.body
				.querySelector(`#${this.parentA.replaceAll(" ", "")}`)
				.getBoundingClientRect()
			const pBRect = document.body
				.querySelector(`#${this.parentB.replaceAll(" ", "")}`)
				.getBoundingClientRect()

			// vertical
			x1 = fmRect.left + fmRect.width / 2
			x2 = x1
			y1 = pARect.bottom + 25
			y2 = fmRect.top
			this.drawLine(x1, y1, x2, y2)

			// horizontal if
			x1 = fmRect.left + fmRect.width / 2
			x2 = pARect.right + (pBRect.left - pARect.right) / 2
			y1 = pARect.bottom + 25
			y2 = y1
			this.drawLine(x1, y1, x2, y2)
		}
	},
	methods: {
		async handleImageChange(event) {
			const file = event.target.files[0]
			// Check if a file was selected
			if (file) {
				// Perform additional checks if needed (e.g., file type)
				this.uploadedImage = file

				const formData = new FormData()
				formData.append(
					"image",
					this.uploadedImage,
					this.uploadedImage.name
				)
				formData.append("nameSurname", this.nameSurname)

				// eslint-disable-next-line no-console
				console.log(this.uploadedImage)
				// eslint-disable-next-line no-console
				console.log(this.nameSurname)
				await this.$axios.$post(
					`${this.$store.state.serverUrl}/upload_image`,
					formData
				)
			}
		},
		drawLine(x1, y1, x2, y2) {
			const svgNS = "http://www.w3.org/2000/svg"
			const line = document.createElementNS(svgNS, "line")

			line.setAttribute("x1", x1 - this.$store.state.startingLeft)
			line.setAttribute("y1", y1 - this.$store.state.startingTop)
			line.setAttribute("x2", x2 - this.$store.state.startingLeft)
			line.setAttribute("y2", y2 - this.$store.state.startingTop)
			line.setAttribute("stroke", "black")
			line.setAttribute("stroke-width", "1")
			line.setAttribute("stroke-alignment", "inner")

			document.body.querySelector(".lines").appendChild(line)
		},
		drawHeart(_x, _y) {
			const svgNS = "http://www.w3.org/2000/svg"
			const path = document.createElementNS(svgNS, "path")

			// eslint-disable-next-line no-unused-vars
			const x = _x - this.$store.state.startingLeft
			// eslint-disable-next-line no-unused-vars
			const y = _y - this.$store.state.startingTop - 25 * 0.7

			const heartPath = `M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z
			`

			path.setAttribute("d", heartPath)
			path.setAttribute("fill", "red")
			path.setAttribute("transform", `translate(${x},${y}) scale(0.7)`)

			document.body.querySelector(".lines").appendChild(path)
		},
		...mapMutations(["changeModalVisible", "changeModalNameSurname"]),
		openModal(nameSurname) {
			this.changeModalVisible(true)
			this.changeModalNameSurname(nameSurname)
		},
	},
}
</script>

<style>
.family-member {
	/*
	border-radius: var(--border-radius);
	background-color: var(--color-darker);
	opacity: 0.9;
	*/
	position: relative;
}

.member-card {
	/*
	border: 2px solid black;
	*/
	position: relative;
	box-shadow: 0 0 3px #ff0000;
	width: 110px;
	height: 170px; /* 200 with birth year */
	background-color: var(--color-light);
	border-radius: var(--border-radius);
	margin-bottom: 50px;
	margin-left: 20px;
	margin-right: 20px;

	justify-content: flex-start;
}

.avatar {
	height: 100px;
	max-width: 100px;
	/*
	width: 100px;
	*/
	object-fit: cover;
	border: 2px solid transparent;
	border-radius: var(--border-radius);
	margin: var(--space-0);
	/*
	background-color: red;
	*/
}

.edit-icon {
	width: 15px;
	height: 15px;
	position: absolute;
	top: 95px;
	right: 15px;
	cursor: pointer;

	padding: 2px;
	border-radius: 10%;
	background-color: var(--color-neutral);
	object-fit: contain;
}

.name-surname,
.birth-year {
	color: var(--color-dark);
	margin: 0;
	text-align: center;
}

.name-surname {
	font-weight: bold;
	font-size: 1.5em;
}
</style>
