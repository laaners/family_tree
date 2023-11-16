<template>
	<transition name="fade">
		<div v-if="$store.state.modalVisible" class="modal flex-col">
			<button
				class="modal-close"
				aria-label="close-modal"
				@click="closeModal"
			>
				<x-icon />
			</button>
			<h1 style="font-size: 4.5vh; font-weight: bolder">
				{{ $store.state.modalNameSurname }}
			</h1>
			<div v-if="loading" class="loader"></div>
			<div v-if="!loading" class="modal-view">
				<img
					ref="avatar"
					:src="fmData.src.avatar1 + '&' + new Date().getTime()"
					alt=""
					style="height: 300px"
				/>
				<label for="fileInput">
					<img src="/family_tree/camera.png" class="camera-icon" />
				</label>
				<input
					id="fileInput"
					ref="fileInput"
					type="file"
					accept="image/*"
					@change="handleImageChange"
				/>
			</div>
		</div>
	</transition>
</template>

<script>
import { mapMutations } from "vuex"
import XIcon from "./icons/XIcon.vue"
export default {
	components: { XIcon },
	data: () => ({
		loading: false,
		fmData: {},
		uploadedImage: null,
	}),
	watch: {
		async "$store.state.modalNameSurname"(newV, oldV) {
			if (this.$store.state.modalVisible && newV.length > 0) {
				this.loading = true
				const fmData = await this.$axios.$get(
					`${this.$store.state.serverUrl}/family_member/${this.$store.state.modalNameSurname}`
				)
				this.fmData = fmData
				this.loading = false
			}
		},
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
				formData.append(
					"nameSurname",
					this.$store.state.modalNameSurname
				)

				this.loading = true

				await this.$axios.$post(
					`${this.$store.state.serverUrl}/upload_image`,
					formData
				)

				const fmData = await this.$axios.$get(
					`${this.$store.state.serverUrl}/family_member/${this.$store.state.modalNameSurname}`
				)
				this.fmData = fmData
				this.loading = false
				setTimeout(() => {
					this.$refs.avatar.src =
						fmData.src.avatar1 + "&" + new Date().getTime()
				}, 500)
			}
		},
		...mapMutations(["changeModalVisible", "changeModalNameSurname"]),
		closeModal() {
			this.changeModalVisible(false)
			this.changeModalNameSurname("")
		},
	},
}
</script>

<style>
/* Add your modal styles here */

.modal {
	background: var(--color-light);
	color: var(--color-dark);
	height: 70%;
	width: 70%;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	position: fixed;
	overflow: auto;
	z-index: 9998;
	border-radius: var(--border-radius);
	padding: var(--space-2);
}

.modal-view {
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
}

.modal-close {
	position: absolute;
	right: 5px;
	top: 5px;
	z-index: 9999;

	margin: 0;
	padding: 0;

	background: none;
	border: none;
	cursor: pointer;
	color: var(--color-dark);
	opacity: 0.7;
	font-size: 2em;
}

.modal-close p {
	margin: 0;
}

.modal-close:hover {
	opacity: 1;
}

.modal-view div {
	margin: 1vmin;
}

.camera-icon {
	margin: var(--space-0);
	width: 45px;
	height: 45px;
	cursor: pointer;

	padding: 2px;
	border-radius: 10%;
	/*
	background-color: var(--color-neutral);
	 */
	object-fit: contain;
}
</style>
