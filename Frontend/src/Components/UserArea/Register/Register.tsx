import "./Register.css";
import { useForm } from "react-hook-form";
import { UserModel } from "../../../Models/UserModel";
import { useNavigate } from "react-router-dom";
import { userService } from "../../../Services/UserService";
import { notify } from "../../../Utils/Notify";

export function Register(): JSX.Element {

    const { register, handleSubmit, formState: { errors } } = useForm<UserModel>();
    const navigate = useNavigate();

    // Function to handle form submission
    async function send(user: UserModel) {
        try {
        // Check if the current user email is taken
        const dbEmails = await userService.getEmails();
        const checkDuplicate = dbEmails.find(e => e.email.toLowerCase() === user.email.toLowerCase());
        
        if (checkDuplicate) {
            notify.error("Email is already taken. Choose a different email address");
            return;
        }

            // Trim name
            user.firstName = user.firstName?.trim();
            user.lastName = user.lastName?.trim();

            await userService.register(user);
            notify.success("Welcome " + user.firstName);
            navigate("/home");
        }
        catch (err: any) {
            notify.error(err);
        }
    };

    // Function to handle form errors - triggering the messages
    function onError() {
        if (errors.lastName?.message) {
            notify.error(errors.lastName.message); // for lastName
        }
        if (errors.firstName?.message) {
            notify.error(errors.firstName.message); // for firstName
        }
        if (errors.email?.message) {
            notify.error(errors.email.message); // for email
        }
    };

    return (
        <div className="Register">
            <form onSubmit={handleSubmit(send, onError)}>
                <label>First name</label>
                <input
                    type="text"
                    {...register("firstName", {
                        required: "First Name is required",
                        minLength: { value: 2, message: "Minimum 2 characters" },
                        maxLength: { value: 100, message: "Maximum 100 characters" },
                        pattern: {
                            value: /^(?![\s]+$)[A-Za-z]+(?:[-' ][A-Za-z]+)?$/,
                            message: "The first name contain letters, with optional hyphens, commas or apostrophes."
                        },
                    })} />
                <br />

                <label>Last name</label>
                <input
                    type="text"
                    {...register("lastName", {
                        required: "Last Name is required",
                        minLength: { value: 2, message: "Minimum 2 characters" },
                        maxLength: { value: 100, message: "Maximum 100 characters" },
                        pattern: {
                            value: /^(?![\s]+$)[A-Za-z]+(?:[-' ][A-Za-z]+)?$/,
                            message: "The last name contain letters, with optional hyphens, commas or apostrophes."
                        }
                    })}
                />
                <br />

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

                <button type="submit">Register</button>
            </form>
        </div>
    );
}
