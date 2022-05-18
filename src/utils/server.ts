import express from "express"
import { deserializedUser } from "../middleware/deserializedUser"
import routes from "../routes"


function createServer() {
	const app = express()

	app.use(deserializedUser)
	app.use(express.json())
	routes(app)
	return app
}

export default createServer