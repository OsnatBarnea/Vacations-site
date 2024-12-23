import express, { Express, Request, } from "express";
import { appConfig } from "./2-utils/app-config";
import { loggerMiddleware } from "./6-middleware/logger-middleware";
import { securityMiddleware } from "./6-middleware/security-middleware";
import { errorMiddleware } from "./6-middleware/error-middleware";
import { userController } from "./5-controllers/user-controller";
import fileUpload from "express-fileupload";
import { fileSaver } from "uploaded-file-saver";
import path from "path";
import cors from "cors";
import { vacationController } from "./5-controllers/vacation-controller";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { likeController } from "./5-controllers/like-controller";

class App {

    public server: Express;

    public start(): void {
        this.server = express();

        // Prevent DoS attack (but no limit on images upload) 
        this.server.use(rateLimit({
            windowMs: 5000, limit: 20, skip: (request: Request) =>
                request.originalUrl.startsWith("/api/vacations/images/")
        }));

        // Prevent problematic response headers (from the server) 
        this.server.use(helmet({ crossOriginResourcePolicy: false }));

        this.server.use(cors({ origin: "http://localhost:3000" })); // Enabling CORS only for a single frontend address.

        this.server.use(express.json()); //express - request.body

        this.server.use(fileUpload()); //express - file.body (for the images)
        // Connect file saver:
        const absolutePath = path.join(__dirname, "1-assets", "images");
        fileSaver.config(absolutePath);

        // Register custom middleware:
        this.server.use(loggerMiddleware.consoleLogRequest);
        this.server.use(securityMiddleware.preventXssAttack);

        // Connect controllers to the server:
        this.server.use("/api", userController.router, vacationController.router, likeController.router);


        // Register route not found middleware: 
        this.server.use("*", errorMiddleware.routeNotFound);

        // Register catch-all middleware: 
        this.server.use(errorMiddleware.catchAll);

        // Run server: 
        this.server.listen(appConfig.port, () => console.log("Listening on http://localhost:" + appConfig.port));
    }

}
//exporting for tests
export const app = new App();
app.start();
