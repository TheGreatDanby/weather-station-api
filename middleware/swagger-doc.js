import { Router } from "express"
import swaggerUi from "swagger-ui-express"

import swaggerDocument from "../docs/swagger-output.json" assert { type: "json"}

const docsRouter = Router()

var options = {
    swaggerOptions: {
        docExpansion: "none",
        operationsSorter: "method"
    }
}

docsRouter.use("/docs", swaggerUi.serve)
docsRouter.get("/docs", swaggerUi.setup(swaggerDocument, options))

export default docsRouter