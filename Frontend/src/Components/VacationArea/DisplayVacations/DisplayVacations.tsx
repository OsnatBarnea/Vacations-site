import "./DisplayVacations.css";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { notify } from "../../../Utils/Notify";
import { useNavigate } from "react-router-dom";
import { LikeModel } from "../../../Models/LikeModel";
import { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import likeMarked from "../../../Assets/Images/like_icon.png";
import likeNotMarked from "../../../Assets/Images/noLike_icon.png";
import { likeService } from "../../../Services/LikeService";
import { AppState } from "../../../Redux/Store";
import { useSelector } from "react-redux";
import { UserModel } from "../../../Models/UserModel";

export function DisplayVacations(): JSX.Element {

    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [textToSearch, setTextToSearch] = useState<string>("");
    const [currentView, setCurrentView] = useState<string>("AllVacations"); //check current view
    const navigate = useNavigate();

    //get from redux the user and likes info
    const user = useSelector<AppState, UserModel>(state => state.user);
    const likes = useSelector<AppState, LikeModel[]>(state => state.like);

    useEffect(() => {
        vacationService.getAllVacations()
            .then(vacations => setVacations(vacations))
            .catch(err => notify.error(err));

        likeService.getAllLikes()
            .catch(err => notify.error(err));
    }, []);

    //number of cards per page
    const [currentPage, setCurrentPage] = useState<number>(1);
    const vacationsPerPage = 9;

    // Calculate the current vacations to display
    const indexOfLastVacation = currentPage * vacationsPerPage;
    const indexOfFirstVacation = indexOfLastVacation - vacationsPerPage;
    const currentVacations = vacations.slice(indexOfFirstVacation, indexOfLastVacation);

    // Calculate total pages
    const totalPages = Math.ceil(vacations.length / vacationsPerPage);

    // Change page
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    async function updateLike(vacationId: number) {
        try {
            const likeToAdd = { userId: user.id, vacationId: vacationId };

            // check if the vacation was liked before by the user
            const checkForLike = await likeService.getOneLike(likeToAdd.userId, likeToAdd.vacationId);

            //check which of all vacations the user liked and get their id
            const userLikesView = await vacationService.getVacationsWithUserLikes(user.id);
            const vacationIdOfUserLikes = userLikesView.map(v => v.id);

            //Remove or add the liked/unlike vacation from view - update the likes count
            setVacations(vacations => {
                const updatedVacations = vacations.map(v =>
                    v.id === vacationId ? { ...v, likesCount: checkForLike ? v.likesCount - 1 : v.likesCount + 1 } : v);

                // filter un-liked vacations when in "Liked Vacations" view is on
                if (currentView === "LikedVacations" && checkForLike && vacationIdOfUserLikes.includes(vacationId)) {
                    return updatedVacations.filter(v => v.id !== vacationId);
                }

                return updatedVacations;
            });

            //change in backend
            if (!checkForLike) {
                // add like to db
                await likeService.addLike(likeToAdd.userId, likeToAdd.vacationId);
            }
            else {
                await likeService.deleteLike(likeToAdd.userId, likeToAdd.vacationId);
            }

        } catch (err: any) {
            notify.error(err);
        }
    };

    async function search(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const vacations = await vacationService.getVacationsBySearch(textToSearch);

            if (vacations.length === 0) {
                notify.error("No vacations by this name");
                setVacations([]);
            }
            setVacations(vacations);
        }
        catch (err: any) {
            notify.error(err);
        }
        setTextToSearch("");
    };

    async function resetVacations() {
        try {
            //clean input box
            setTextToSearch("");

            //Get all the vacation after filters
            const allVacations = await vacationService.getAllVacations();
            setVacations(allVacations);
            // Update view
            setCurrentView("AllVacations");
            return allVacations;
        }
        catch (err: any) {
            notify.error(err);
            return [];
        }
    };

    async function getLikedVacations() {
        try {
            const vacations = await vacationService.getLikedVacations(user.id);

            if (vacations.length === 0) {
                notify.error("no vacations are marked as liked");
                setVacations([]);
            }
            setVacations(vacations);
            setCurrentView("LikedVacations");
        }
        catch (err: any) {
            notify.error(err);
        }
    };

    async function upcomingVacations() {
        try {
            //clear former filters
           const vacations = await resetVacations();

            //Get today's date in YYYY-MM-DD format
            const today = new Date().toISOString().split("T")[0];

            //get only the future vacations
            const upcomingVacations = vacations.filter(v => new Date(v.startDate).toISOString().split("T")[0] > today);

            if (upcomingVacations.length === 0) {
                notify.error("no vacations in the future");
                setVacations([]);
            }
            setVacations(upcomingVacations);
        }
        catch (err: any) {
            notify.error(err);
        }
    };

    async function activeVacations() {
        try {
            //clear former filters
            const vacations = await resetVacations();

            // Get today's date in YYYY-MM-DD format
            const today = new Date().toISOString().split("T")[0];

            //get only the future vacations
            const activeVacations = vacations.filter(v => 
                (new Date(v.startDate).toISOString().split("T")[0] < today && 
                new Date(v.endDate).toISOString().split("T")[0] > today));

            if (activeVacations.length === 0) {
                notify.error("no vacations active now");
                setVacations([]);
            }
            setVacations(activeVacations);
        }
        catch (err: any) {
            notify.error(err);
        }
    };

    async function updateVacation(id: number) {
        navigate("/update-vacation/" + id);
    };

    async function deleteVacation(id: number) {
        try {
            const sure = window.confirm("Are you sure you want to delete the vacation?");
            if (!sure) return;

            await vacationService.deleteVacation(id);
            notify.success("The vacation has been deleted");
            setVacations(vacations.filter(v => v.id !== id));
            return vacations;
        }
        catch (err: any) {
            notify.error(err);
        }
    };

    async function getReport() {
        navigate("/report/");
    };

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="DisplayVacations">
            <form onSubmit={search}>
                <label>Search for a destination:</label>
                <input type="search" value={textToSearch} onChange={(event: ChangeEvent<HTMLInputElement>) => 
                setTextToSearch(event.target.value)} />

                <button type="submit">Search</button>

                <button className="clearButton" type="button" onClick={resetVacations}>Clear Search</button>
            </form>

            {user.role === "User" && (
                <button type="button" onClick={getLikedVacations}>My favorites</button>
            )}

            <span>    </span>

            {user.role === "User" && (
                <button type="button" onClick={upcomingVacations}>Upcoming vacations</button>
            )}

            <span>    </span>

            {user.role === "User" && (
                <button type="button" onClick={activeVacations}>Active vacations</button>
            )}

            <span>    </span>

            {user.role === "Admin" && (
                <button className="reportButton" type="button" onClick={getReport}>Get report</button>
            )}

            <br /><br />

            <div className="List">
                {currentVacations?.length > 0 ? (
                    <ul>
                        {currentVacations.map(v => (
                            <li key={v.id}>
                                {user.role === "User" && (
                                    <span className="likeSpan" onClick={() => updateLike(v.id)}>
                                        <img src={likes.some(like => like.userId === user.id && like.vacationId === v.id) ?
                                            likeMarked : likeNotMarked} alt="Like mark" />
                                        {v.likesCount}
                                    </span>
                                )}

                                <span className="imageSpan">
                                    <img src={v.imageUrl} alt="image destination" />
                                </span>

                                <span className="datesSpan">
                                    {formatDate(v.startDate)} - {formatDate(v.endDate)}
                                </span>

                                <span className="destinationSpan">{v.destination}</span>

                                <span className="descriptionSpan">{v.description}</span>

                                <span className="priceSpan">{v.price}$</span>

                                {user.role === "Admin" && (
                                    <span>
                                        <button className="editButton" onClick={() => updateVacation(v.id)}>Edit</button>
                                        <button className="deleteButton" onClick={() => deleteVacation(v.id)}>Delete</button>
                                    </span>
                                )}
                                
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No vacations found.</p>
                )}
            </div>

            {/* Pagination Controls */}
            <div className="Pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`PageButton ${currentPage === index + 1 ? "active" : ""}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}


