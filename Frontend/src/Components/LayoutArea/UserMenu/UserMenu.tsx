import { useSelector } from "react-redux";
import "./UserMenu.css";
import { AppState } from "../../../Redux/Store";
import { UserModel } from "../../../Models/UserModel";
import { NavLink } from "react-router-dom";
import { userService } from "../../../Services/UserService";
import { notify } from "../../../Utils/Notify";

export function UserMenu(): JSX.Element {
    //render from global state (redux)
    const user = useSelector<AppState, UserModel>(state => state.user);

    function logout() {
        userService.logout();
        notify.success(`Goodbye ${user.firstName}, Hope to see you soon`);
    };

    return (
        <div className="UserMenu">
        {user === null ? (
            <div>
                <span>Hello guest  </span>
                <NavLink to="/login">Login</NavLink>
                <span>  |  </span>
                <NavLink to="/register">Register</NavLink>
            </div>
        ) : (
            <div>
                <span>Hello {user.firstName} {user.lastName}  </span>
                <NavLink to="/home" onClick={logout}>Logout</NavLink>
            </div>
        )}
    </div>
    );
}
