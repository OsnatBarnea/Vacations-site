import { NavLink} from "react-router-dom";
import "./Menu.css";
import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/Store";
import { UserModel } from "../../../Models/UserModel";
import { UserMenu } from "../UserMenu/UserMenu";

export function Menu(): JSX.Element {

    //render by redux the login/registration
    const user = useSelector<AppState, UserModel>(state => state.user);

    return (
        <div className="Menu">

            <NavLink to="/home">Home</NavLink>

            <UserMenu />

            {user && <NavLink to="/vacations">Vacations</NavLink>}

            {user?.role === "Admin" && <NavLink to="/add-vacation">Add a new vacation</NavLink>}

        </div>
    );
}
