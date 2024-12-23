import { useForm } from "react-hook-form";
import "./Login.css";
import { CredentialsModel } from "../../../Models/CredentialsModel";
import { useNavigate } from "react-router-dom";
import { userService } from "../../../Services/UserService";
import { notify } from "../../../Utils/Notify";

export function Login(): JSX.Element {

    const { register, handleSubmit, formState: { errors } } = useForm<CredentialsModel>();
    const navigate = useNavigate();

    async function send(credentials: CredentialsModel) {
        try {
            await userService.login(credentials);
            notify.success("welcome back!");
            navigate("/vacations");
        }
        catch (err: any) { notify.error(err) }
    };

    // Function to handle form errors - triggering the messages
    function onError() {
        if (errors.email?.message) {
            notify.error(errors.email.message); // for email
        }
    };

    return (
        <div className="Login">
            <form onSubmit={handleSubmit(send, onError)}>

                <label>Email</label>
                <input type="email" {...register("email", {
                    required: "Email is required",
                    pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email address"
                    }
                })}
                    title="Enter a valid email address" />
                <br />

                <label>Password</label>
                <input type="password" {...register("password")} required minLength={4} maxLength={8}
                    title="Password must be 4-8 characters long." />
                <br />

                <button className="loginButton">Login</button>
            </form>
        </div>
    );
}
