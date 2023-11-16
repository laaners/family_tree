<template>
	<div class="flex-col index">
		<div :style="{ transform: 'scale(' + zoom + ')' }">
			<family-tree
				class="family-tree"
				:family-members="familyData"
				:left="nodePosition.left"
				:top="nodePosition.top"
				:node-position.sync="nodePosition"
				:zoom.sync="zoom"
			/>
		</div>
		<fixed-bar class="fixed-bar" :zoom.sync="zoom" />
		<family-member-modal ref="modal" />
	</div>
</template>

<script>
export default {
	name: "IndexPage",
	// eslint-disable-next-line require-await
	async asyncData({ $axios }) {
		let allMembers = [
			{
				nameSurname: "胡体旁",
				birthYear: "1950",
				spouse: "罗花味",
				children: ["John", "Jane"],
				src: {
					avatar1:
						"https://storage.googleapis.com/family-tree-518ab.appspot.com/avatars/%E8%83%A1%E4%BD%93%E6%97%81.png?GoogleAccessId=firebase-adminsdk-5s7od%40family-tree-518ab.iam.gserviceaccount.com&Expires=7989663600&Signature=VTmEMZ0Jf3mC2Z5TOSmzqpXc%2F805pAMpFUgwH%2BM%2BKKbuPnYAQx%2FRg0kI2S%2BrDSTSIe39uZJk1YUB5dk5DJT%2B1%2FDoJhoePUWZfxfa0RNM%2BU3d3tJL4Tl1PWj380Qa2tiHtTg3bc%2FfcaTK7kRROKnrR%2Bl9VTIGYw%2FgehsnlHN1fS2sDKGXxbpcT2LykH%2BNUq1qnmDswbqcNgtyvghTTXRtJyhgsct4bQV4FNRRu7gfzdOgnM3b4n0ow5h0isE9sLJR%2FkqtEXcLKd1kwZp7Nn9X%2Ffmp5iOO5Vg9mPfCVPMvuuaeuVg%2BVkbWyLpe8fv6%2FMoWgOj4iGWCDXl7VIAoLfKpcQ%3D%3D",
				},
			},
			{
				nameSurname: "罗花味",
				birthYear: "1952",
				spouse: "胡体旁",
				children: ["John", "Jane"],
				src: {
					avatar1:
						"https://storage.googleapis.com/family-tree-518ab.appspot.com/avatars/%E8%83%A1%E4%BD%93%E6%97%81.png?GoogleAccessId=firebase-adminsdk-5s7od%40family-tree-518ab.iam.gserviceaccount.com&Expires=7989663600&Signature=VTmEMZ0Jf3mC2Z5TOSmzqpXc%2F805pAMpFUgwH%2BM%2BKKbuPnYAQx%2FRg0kI2S%2BrDSTSIe39uZJk1YUB5dk5DJT%2B1%2FDoJhoePUWZfxfa0RNM%2BU3d3tJL4Tl1PWj380Qa2tiHtTg3bc%2FfcaTK7kRROKnrR%2Bl9VTIGYw%2FgehsnlHN1fS2sDKGXxbpcT2LykH%2BNUq1qnmDswbqcNgtyvghTTXRtJyhgsct4bQV4FNRRu7gfzdOgnM3b4n0ow5h0isE9sLJR%2FkqtEXcLKd1kwZp7Nn9X%2Ffmp5iOO5Vg9mPfCVPMvuuaeuVg%2BVkbWyLpe8fv6%2FMoWgOj4iGWCDXl7VIAoLfKpcQ%3D%3D",
				},
			},
			{
				nameSurname: "John",
				birthYear: "1975",
				spouse: "Alice",
				children: ["Grandchild1 Grandchild", "Grandchild2"],
				src: {
					avatar1:
						"https://storage.googleapis.com/family-tree-518ab.appspot.com/avatars/%E8%83%A1%E4%BD%93%E6%97%81.png?GoogleAccessId=firebase-adminsdk-5s7od%40family-tree-518ab.iam.gserviceaccount.com&Expires=7989663600&Signature=VTmEMZ0Jf3mC2Z5TOSmzqpXc%2F805pAMpFUgwH%2BM%2BKKbuPnYAQx%2FRg0kI2S%2BrDSTSIe39uZJk1YUB5dk5DJT%2B1%2FDoJhoePUWZfxfa0RNM%2BU3d3tJL4Tl1PWj380Qa2tiHtTg3bc%2FfcaTK7kRROKnrR%2Bl9VTIGYw%2FgehsnlHN1fS2sDKGXxbpcT2LykH%2BNUq1qnmDswbqcNgtyvghTTXRtJyhgsct4bQV4FNRRu7gfzdOgnM3b4n0ow5h0isE9sLJR%2FkqtEXcLKd1kwZp7Nn9X%2Ffmp5iOO5Vg9mPfCVPMvuuaeuVg%2BVkbWyLpe8fv6%2FMoWgOj4iGWCDXl7VIAoLfKpcQ%3D%3D",
				},
			},
			{
				nameSurname: "Alice",
				birthYear: "1980",
				spouse: "John",
				children: ["Grandchild1 Grandchild", "Grandchild2"],
				src: {
					avatar1:
						"https://storage.googleapis.com/family-tree-518ab.appspot.com/avatars/%E8%83%A1%E4%BD%93%E6%97%81.png?GoogleAccessId=firebase-adminsdk-5s7od%40family-tree-518ab.iam.gserviceaccount.com&Expires=7989663600&Signature=VTmEMZ0Jf3mC2Z5TOSmzqpXc%2F805pAMpFUgwH%2BM%2BKKbuPnYAQx%2FRg0kI2S%2BrDSTSIe39uZJk1YUB5dk5DJT%2B1%2FDoJhoePUWZfxfa0RNM%2BU3d3tJL4Tl1PWj380Qa2tiHtTg3bc%2FfcaTK7kRROKnrR%2Bl9VTIGYw%2FgehsnlHN1fS2sDKGXxbpcT2LykH%2BNUq1qnmDswbqcNgtyvghTTXRtJyhgsct4bQV4FNRRu7gfzdOgnM3b4n0ow5h0isE9sLJR%2FkqtEXcLKd1kwZp7Nn9X%2Ffmp5iOO5Vg9mPfCVPMvuuaeuVg%2BVkbWyLpe8fv6%2FMoWgOj4iGWCDXl7VIAoLfKpcQ%3D%3D",
				},
			},
			{
				nameSurname: "Jane",
				birthYear: "1980",
				spouse: "Bob",
				children: ["Grandchild3"],
				src: {
					avatar1:
						"https://storage.googleapis.com/family-tree-518ab.appspot.com/avatars/%E8%83%A1%E4%BD%93%E6%97%81.png?GoogleAccessId=firebase-adminsdk-5s7od%40family-tree-518ab.iam.gserviceaccount.com&Expires=7989663600&Signature=VTmEMZ0Jf3mC2Z5TOSmzqpXc%2F805pAMpFUgwH%2BM%2BKKbuPnYAQx%2FRg0kI2S%2BrDSTSIe39uZJk1YUB5dk5DJT%2B1%2FDoJhoePUWZfxfa0RNM%2BU3d3tJL4Tl1PWj380Qa2tiHtTg3bc%2FfcaTK7kRROKnrR%2Bl9VTIGYw%2FgehsnlHN1fS2sDKGXxbpcT2LykH%2BNUq1qnmDswbqcNgtyvghTTXRtJyhgsct4bQV4FNRRu7gfzdOgnM3b4n0ow5h0isE9sLJR%2FkqtEXcLKd1kwZp7Nn9X%2Ffmp5iOO5Vg9mPfCVPMvuuaeuVg%2BVkbWyLpe8fv6%2FMoWgOj4iGWCDXl7VIAoLfKpcQ%3D%3D",
				},
			},
			{
				nameSurname: "Bob",
				birthYear: "1985",
				spouse: "Jane",
				children: ["Grandchild3"],
				src: {
					avatar1:
						"https://storage.googleapis.com/family-tree-518ab.appspot.com/avatars/%E8%83%A1%E4%BD%93%E6%97%81.png?GoogleAccessId=firebase-adminsdk-5s7od%40family-tree-518ab.iam.gserviceaccount.com&Expires=7989663600&Signature=VTmEMZ0Jf3mC2Z5TOSmzqpXc%2F805pAMpFUgwH%2BM%2BKKbuPnYAQx%2FRg0kI2S%2BrDSTSIe39uZJk1YUB5dk5DJT%2B1%2FDoJhoePUWZfxfa0RNM%2BU3d3tJL4Tl1PWj380Qa2tiHtTg3bc%2FfcaTK7kRROKnrR%2Bl9VTIGYw%2FgehsnlHN1fS2sDKGXxbpcT2LykH%2BNUq1qnmDswbqcNgtyvghTTXRtJyhgsct4bQV4FNRRu7gfzdOgnM3b4n0ow5h0isE9sLJR%2FkqtEXcLKd1kwZp7Nn9X%2Ffmp5iOO5Vg9mPfCVPMvuuaeuVg%2BVkbWyLpe8fv6%2FMoWgOj4iGWCDXl7VIAoLfKpcQ%3D%3D",
				},
			},
			{
				nameSurname: "Grandchild1 Grandchild",
				birthYear: "2000",
				children: [],
				src: {
					avatar1:
						"https://storage.googleapis.com/family-tree-518ab.appspot.com/avatars/%E8%83%A1%E4%BD%93%E6%97%81.png?GoogleAccessId=firebase-adminsdk-5s7od%40family-tree-518ab.iam.gserviceaccount.com&Expires=7989663600&Signature=VTmEMZ0Jf3mC2Z5TOSmzqpXc%2F805pAMpFUgwH%2BM%2BKKbuPnYAQx%2FRg0kI2S%2BrDSTSIe39uZJk1YUB5dk5DJT%2B1%2FDoJhoePUWZfxfa0RNM%2BU3d3tJL4Tl1PWj380Qa2tiHtTg3bc%2FfcaTK7kRROKnrR%2Bl9VTIGYw%2FgehsnlHN1fS2sDKGXxbpcT2LykH%2BNUq1qnmDswbqcNgtyvghTTXRtJyhgsct4bQV4FNRRu7gfzdOgnM3b4n0ow5h0isE9sLJR%2FkqtEXcLKd1kwZp7Nn9X%2Ffmp5iOO5Vg9mPfCVPMvuuaeuVg%2BVkbWyLpe8fv6%2FMoWgOj4iGWCDXl7VIAoLfKpcQ%3D%3D",
				},
			},
			{
				nameSurname: "Grandchild2",
				birthYear: "2005",
				children: [],
				src: {
					avatar1:
						"https://storage.googleapis.com/family-tree-518ab.appspot.com/avatars/%E8%83%A1%E4%BD%93%E6%97%81.png?GoogleAccessId=firebase-adminsdk-5s7od%40family-tree-518ab.iam.gserviceaccount.com&Expires=7989663600&Signature=VTmEMZ0Jf3mC2Z5TOSmzqpXc%2F805pAMpFUgwH%2BM%2BKKbuPnYAQx%2FRg0kI2S%2BrDSTSIe39uZJk1YUB5dk5DJT%2B1%2FDoJhoePUWZfxfa0RNM%2BU3d3tJL4Tl1PWj380Qa2tiHtTg3bc%2FfcaTK7kRROKnrR%2Bl9VTIGYw%2FgehsnlHN1fS2sDKGXxbpcT2LykH%2BNUq1qnmDswbqcNgtyvghTTXRtJyhgsct4bQV4FNRRu7gfzdOgnM3b4n0ow5h0isE9sLJR%2FkqtEXcLKd1kwZp7Nn9X%2Ffmp5iOO5Vg9mPfCVPMvuuaeuVg%2BVkbWyLpe8fv6%2FMoWgOj4iGWCDXl7VIAoLfKpcQ%3D%3D",
				},
			},
			{
				nameSurname: "Grandchild3",
				birthYear: "2010",
				children: [],
				src: {
					avatar1:
						"https://storage.googleapis.com/family-tree-518ab.appspot.com/avatars/%E8%83%A1%E4%BD%93%E6%97%81.png?GoogleAccessId=firebase-adminsdk-5s7od%40family-tree-518ab.iam.gserviceaccount.com&Expires=7989663600&Signature=VTmEMZ0Jf3mC2Z5TOSmzqpXc%2F805pAMpFUgwH%2BM%2BKKbuPnYAQx%2FRg0kI2S%2BrDSTSIe39uZJk1YUB5dk5DJT%2B1%2FDoJhoePUWZfxfa0RNM%2BU3d3tJL4Tl1PWj380Qa2tiHtTg3bc%2FfcaTK7kRROKnrR%2Bl9VTIGYw%2FgehsnlHN1fS2sDKGXxbpcT2LykH%2BNUq1qnmDswbqcNgtyvghTTXRtJyhgsct4bQV4FNRRu7gfzdOgnM3b4n0ow5h0isE9sLJR%2FkqtEXcLKd1kwZp7Nn9X%2Ffmp5iOO5Vg9mPfCVPMvuuaeuVg%2BVkbWyLpe8fv6%2FMoWgOj4iGWCDXl7VIAoLfKpcQ%3D%3D",
				},
			},
		]

		allMembers = await $axios.$get(
			`https://family-tree-vercel.vercel.app/all_family_members`
		)

		function hashGroupBy(obj, key) {
			const ris = {}
			if (obj[0][key] === undefined) return ris
			obj.forEach((elem) => {
				const risElem = ris[elem[key]]
				if (risElem === undefined) {
					const toPush = [elem]
					ris[elem[key]] = toPush
				} else risElem.push(elem)
			})
			return ris
		}

		const hashAllMembers = hashGroupBy(allMembers, "nameSurname")
		const startMember = hashAllMembers["胡体旁"][0]

		function addChildren(fm) {
			if (fm.spouse !== undefined && fm.spouse.length > 0) {
				fm.spouse = hashAllMembers[fm.spouse][0]
			} else {
				fm.spouse = undefined
			}

			if (fm.children.length === 0) return
			const childrenIds = [...fm.children]
			fm.children = []
			for (const childId of childrenIds) {
				const child = hashAllMembers[childId][0]
				fm.children.push(child)
				addChildren(child)
			}
		}

		addChildren(startMember)

		return {
			// Collection: familyMembers
			familyData: [startMember],
		}
	},
	data: () => ({
		nodePosition: {
			left: 0,
			top: 0,
		},
		zoom: 1,
		visible: false,
	}),
	watch: {
		zoom(newV, oldV) {
			this.$el.querySelector(".family-tree").__vue__.zoom = newV
			this.$el.querySelector(".fixed-bar").__vue__.zoom = newV
		},
	},
	beforeMount() {
		this.nodePosition.top = this.$store.state.startingTop
		this.nodePosition.left = this.$store.state.startingLeft
	},
	mounted() {
		// eslint-disable-next-line no-console
		console.log(this.familyData)

		this.connectFm(this.familyData[0])
	},
	methods: {
		fmPosition(nameSurname) {
			return document.body
				.querySelector(`#${nameSurname.replaceAll(" ", "")}`)
				.getBoundingClientRect()
		},
		connectFm(fm) {
			if (fm.spouse !== undefined) this.connectWithSpouse(fm)
			if (fm.children.length > 0 && fm.spouse !== undefined) {
				this.connectWithChildren(fm)
				for (let i = 0; i < fm.children.length; i++) {
					const child = fm.children[i]
					this.connectFm(child)

					// if last child, horizontal connect first and last
					if (i === fm.children.length - 1) {
						const fmRect = this.fmPosition(fm.nameSurname)
						const firstRect = this.fmPosition(
							fm.children[0].nameSurname
						)
						const lastRect = this.fmPosition(
							fm.children[fm.children.length - 1].nameSurname
						)

						// horizontal
						const x1 = firstRect.left + firstRect.width / 2
						const x2 = lastRect.right - lastRect.width / 2
						const y1 = fmRect.bottom + 25
						const y2 = y1
						this.drawLine(x1, y1, x2, y2)
					}
				}
			}
		},
		connectWithSpouse(fm) {
			const fmRect = this.fmPosition(fm.nameSurname)
			const spouseRect = this.fmPosition(fm.spouse.nameSurname)

			let x1, x2, y1, y2

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
		},
		connectWithChildren(fm) {
			const pARect = this.fmPosition(fm.nameSurname)
			// const pBRect = this.fmPosition(fm.spouse.nameSurname)

			let x1, x2, y1, y2
			for (const child of fm.children) {
				const fmRect = this.fmPosition(child.nameSurname)

				// vertical
				x1 = fmRect.left + fmRect.width / 2
				x2 = x1
				y1 = pARect.bottom + 25
				y2 = fmRect.top
				this.drawLine(x1, y1, x2, y2)

				/*
				// horizontal
				x1 = fmRect.left + fmRect.width / 2
				x2 = pARect.right + (pBRect.left - pARect.right) / 2
				y1 = pARect.bottom + 25
				y2 = y1
				this.drawLine(x1, y1, x2, y2)
				*/
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
	},
}
</script>

<style scoped></style>
