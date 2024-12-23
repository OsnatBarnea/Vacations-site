import { jwtDecode } from "jwt-decode"
import { UserModel } from "../Models/UserModel"
import { userActions } from "../Redux/userSlice";
import { store } from "../Redux/Store";
import { appConfig } from "../Utils/AppConfig";
import axios from "axios";
import { CredentialsModel } from "../Models/CredentialsModel";

class UserService {

    //extract the token from the jwt
    private initUser(token: string): void {
        const container = jwtDecode<{ user: UserModel }>(token);
        const dbUser = container.user;

        const action = userActions.initUser(dbUser);
        store.dispatch(action);
    };

    //get token from storage for extraction
    public constructor() {
        const token = localStorage.getItem("token");
        if (!token) return;
        this.initUser(token);
    };

    public async register(user: UserModel): Promise<void> {

        const response = await axios.post<string>(appConfig.registerUrl, user);
        const token = response.data;
        //for extracting the password
        this.initUser(token);
        //save
        localStorage.setItem("token", token);
    };

    public async login(credentials: CredentialsModel): Promise<void> {
        const response = await axios.post<string>(appConfig.loginUrl, credentials);
        const token = response.data;

        this.initUser(token);

        localStorage.setItem("token", token);
    };

    //delete info when logout
    public logout() {
        const action = userActions.logoutUser();
        store.dispatch(action);

        localStorage.removeItem("token");
    };

    public async getEmails(): Promise<EmailEntry[]> {
        // Get email from db
        const response = await axios.get<EmailEntry[]>(appConfig.emailsUrl);
        const emails = response.data;
        return emails;
    };
}

interface EmailEntry {
    email: string;
};

export const userService = new UserService();
