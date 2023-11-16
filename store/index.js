// store/index.js
export const state = () => ({
	modalVisible: false,
	modalNameSurname: "",
	startingTop: 0,
	startingLeft: 0,
	serverUrl: "https://family-tree-vercel.vercel.app",
})

export const mutations = {
	changeModalVisible(state, newV) {
		state.modalVisible = newV
	},
	changeModalNameSurname(state, newV) {
		state.modalNameSurname = newV
	},
}
