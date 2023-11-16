export default {
	methods: {
		groupBy(obj, key, listName) {
			const ris = []
			if (obj[0][key] === undefined) return ris
			obj.forEach((elem) => {
				const risElem = ris.find((_) => _[key] === elem[key])
				if (risElem === undefined) {
					const toPush = {}
					toPush[key] = elem[key]
					toPush[listName] = [elem]
					ris.push(toPush)
				} else risElem[listName].push(elem)
			})
			return ris
		},
		hashGroupBy(obj, key) {
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
		},
		download(filename, text) {
			const element = document.createElement("a")
			element.setAttribute(
				"href",
				"data:text/plain;charset=utf-8," + encodeURIComponent(text)
			)
			element.setAttribute("download", filename)

			element.style.display = "none"
			document.body.appendChild(element)

			element.click()

			document.body.removeChild(element)
		},
		async getAllCards() {
			/*
			const [seg1, seg2, seg3, seg4, seg5, seg6, seg7, seg8] =
				await Promise.all([
					this.$axios.$get("api/allcards?n=0"),
					this.$axios.$get("api/allcards?n=1"),
					this.$axios.$get("api/allcards?n=2"),
					this.$axios.$get("api/allcards?n=3"),
					this.$axios.$get("api/allcards?n=4"),
					this.$axios.$get("api/allcards?n=5"),
					this.$axios.$get("api/allcards?n=6"),
					this.$axios.$get("api/allcards?n=7"),
				])
			const allcards = [
				...new Set([
					...seg1,
					...seg2,
					...seg3,
					...seg4,
					...seg5,
					...seg6,
					...seg7,
					...seg8,
				]),
			]
			return allcards
			*/
			const { data } = await this.$axios.$get(
				"https://db.ygoprodeck.com/api/v7/cardinfo.php"
			)
			// data.find((_) => _.id === 1011091).id = 72309040
			// data.find((_) => _.id === 10034401).id = 84544192
			// data.find((_) => _.id === 10028504).id = 62219643
			return data
		},
		async getAllCardsLocal() {
			const [seg1, seg2, seg3, seg4, seg5, seg6, seg7, seg8] =
				await Promise.all([
					this.$axios.$get("api/allcards?n=0"),
					this.$axios.$get("api/allcards?n=1"),
					this.$axios.$get("api/allcards?n=2"),
					this.$axios.$get("api/allcards?n=3"),
					this.$axios.$get("api/allcards?n=4"),
					this.$axios.$get("api/allcards?n=5"),
					this.$axios.$get("api/allcards?n=6"),
					this.$axios.$get("api/allcards?n=7"),
				])
			const allcards = [
				...new Set([
					...seg1,
					...seg2,
					...seg3,
					...seg4,
					...seg5,
					...seg6,
					...seg7,
					...seg8,
				]),
			]
			return allcards
		},
	},
}
