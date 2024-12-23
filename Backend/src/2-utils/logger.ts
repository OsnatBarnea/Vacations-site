import fsPromises from "fs/promises";

class Logger {
//creating a text log-errors
    public async logError(err: any): Promise<void> {

        const now = new Date();
        
        let message = "";
        message += "Time: " + now.toLocaleString() + "\n";
        message += "Error: " + err.message + "\n";
        if(err.stack) message += "Stack: " + err.stack + "\n"; //get the error, sequence functions leading to it
        message += "\n-----------------------------------------------------\n\n";
        
        await fsPromises.appendFile("./errors.log", message);
    };
}
export const logger = new Logger();
