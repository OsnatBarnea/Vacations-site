import { Navigate, Route, Routes } from "react-router-dom";
import { DisplayVacations } from "../../VacationArea/DisplayVacations/DisplayVacations";
import { Home } from "../../PagesArea/Home/Home";
import { Page404 } from "../Page404/Page404";
import "./Routing.css";
import { AddANewVacation } from "../../VacationArea/AddANewVacation/AddANewVacation";
import { UpdateVacation } from "../../VacationArea/UpdateVacation/UpdateVacation";
import { Register } from "../../UserArea/Register/Register";
import { Login } from "../../UserArea/Login/Login";
import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/Store";
import { UserModel } from "../../../Models/UserModel";
import { VacationsReport } from "../../VacationArea/VacationsReport/VacationsReport";

export function Routing(): JSX.Element {
    const user = useSelector<AppState, UserModel>(state => state.user);

    return (
        <div className="Routing">
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />

                <Route path="/home" element={<Home />} />

                {/* only for login user the route is open */}
                <Route path="/vacations" element={user ? <DisplayVacations /> : <Navigate to="/login" />} />

                <Route path="/add-vacation" element={<AddANewVacation />} />

                <Route path="/update-vacation/:id" element={<UpdateVacation />} />

                <Route path="/register" element={<Register />} />

                <Route path="/login" element={<Login />} />

                <Route path="/report" element={<VacationsReport />}/>

                <Route path="*" element={<Page404 />} />
            </Routes>
        </div>
    );
}
