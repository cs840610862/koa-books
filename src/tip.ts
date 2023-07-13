import { ElMessage, ElMessageBox } from "element-plus"

export class tip {
	static i(text: string, title?: string) {
		ElMessage({ message: text, type: "info", })
	}

	static e(text: string, title?: string) {
		ElMessage({ message: text, type: "error"})
	}

	static s(text: string) {
		ElMessage({ message: text, type: "success", duration: 1 * 1000 })
	}

	static async ask(text: string): Promise<"ok" | "cancel"> {

		return new Promise((resolve, reject) => {
			ElMessageBox.confirm(text).then(() => {
				resolve("ok")
			}).catch(() => {
				resolve("cancel")
			})
		})
	}
}