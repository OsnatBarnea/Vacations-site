import { OkPacketParams } from "mysql2";
import { UserModel } from "../3-models/user-model";
import { dal } from "../2-utils/dal";
import { cyber } from "../2-utils/cyber";
import { CredentialsModel } from "../3-models/credentials-model";
import { UnauthorizedError } from "../3-models/error-models";

class UserService {

    public async register(user: UserModel): Promise<string> {
        //validate registration
        user.validateRegister();

        //default role
        user.role = "User";

        //run-over password add to it hash and salt
        user.password = cyber.hash(user.password); 

        const sql = "insert into users values(default, ?, ?, ?, ?, ?)";
        const values = [user.firstName, user.lastName, user.email, user.password, user.role];

        const successParams: OkPacketParams = await dal.execute(sql, values);
        user.id = successParams.insertId;

        const token = cyber.getNewToken(user); // Generate token
        return token;
    }

    public async login(credentials: CredentialsModel): Promise<string> {
        //validation
        credentials.validateLogin();

        credentials.password = cyber.hash(credentials.password);

        const sql = "select * from users where email = ? and password = ?";
        const values = [credentials.email, credentials.password];

        const userInArray = await dal.execute(sql, values);
        const user = userInArray[0];

        if (!user) throw new UnauthorizedError("Incorrect email or password.");

        const token = cyber.getNewToken(user); // Generate token
        return token;
    }

    //Fetch from db email array (to check for duplicates when a new user registers)
    public async getEmails(): Promise<string[]> {
        const sql = `select email from users`;

        const emails = await dal.execute(sql);
        return emails;
    };
}
export const userService = new UserService();

