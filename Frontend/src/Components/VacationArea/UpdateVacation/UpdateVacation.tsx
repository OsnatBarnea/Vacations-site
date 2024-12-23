import { useNavigate, useParams } from "react-router-dom";
import "./UpdateVacation.css";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { notify } from "../../../Utils/Notify";
import { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { imageUtil } from "../../../Utils/ImageUtil";

export function UpdateVacation(): JSX.Element {
    const params = useParams();
    const id = +params.id;

    const { register, handleSubmit, setValue, watch } = useForm<VacationModel>();
    const [vacation, setVacation] = useState<VacationModel>();
    const navigate = useNavigate();

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    const startDate = watch("startDate");

    //get the day after the chosen start date
    function getNextDay(date: string): string {
        const chosenStartDate = new Date(startDate);
        chosenStartDate.setDate(chosenStartDate.getDate() + 1);
        return chosenStartDate.toISOString().split("T")[0];
    };

    useEffect(() => {
        vacationService.getOneVacation(id)
            .then(v => {
                setValue("destination", v.destination);
                setValue("description", v.description);
                // Format dates for `date` dd/mm/yyyy format
                const formattedStartDate = new Date(v.startDate).toISOString().split('T')[0];
                const formattedEndDate = new Date(v.endDate).toISOString().split('T')[0];
                setValue("startDate", formattedStartDate);
                setValue("endDate", formattedEndDate);
                setValue("price", v.price);
                setValue("imageUrl", v.imageUrl)

                setVacation(v);
            })
            .catch(err => notify.error(err));
    }, []);

    async function send(vacation: VacationModel) {
        try {
            // Trim text
            vacation.destination = vacation.destination?.trim();
            if (!vacation.destination || vacation.destination.length < 2) {
                notify.error("Destination must have at list 2 chars");
                return;
            }

            vacation.description = vacation.description?.trim();
            if (!vacation.description || vacation.description.length < 1) {
                notify.error("Description must have at list 2 chars");
                return;
            }
            //extract the image
            vacation.image = (vacation.image as unknown as FileList)[0];
            if (vacation.image && !imageUtil.imageFileType(vacation.image?.name)) {
                notify.error("Illegal image type");
                return;
            };

            vacation.id = id;
            await vacationService.updateVacation(vacation);
            notify.success("The vacation has been updated");

            navigate("/vacations");
        }
        catch (err: any) {
            notify.error(err);
        }
    };

    async function backToVacation() {
        navigate("/vacations");
    };

    return (
        <div className="EditVacation">

            <form onSubmit={handleSubmit(send)}>
                <label>Destination</label>
                <input type="text" {...register("destination")} required
                    pattern="^(?![\s]+$)[A-Za-zÀ-ÿ\s\-',^*!]+$" minLength={2} maxLength={100}
                    title="Destination starts with a letter and can include letters, spaces, and symbols like -\'^*!" />
                <br /> <br />

                <label>Description</label>
                <textarea {...register("description")} required rows={15} cols={55} minLength={2} maxLength={2000}
                    title="Describe the vacation" />
                <br /> <br />

                <label>Beginning date</label>
                <input type="date" {...register("startDate")} required />
                <br /><br />

                <label>Ending date</label>
                <input type="date" {...register("endDate")} min={startDate ? getNextDay(startDate) : today} 
                title="The end date must be after the start date"/>
                <br /><br />

                <label>Price ($)</label>
                <input type="number" {...register("price")} required min="0" max="10000" step="0.01" />
                <br /><br />

                <label>Image</label>
                <div className={`vacation-image ${vacation?.imageUrl ? "" : "no-image"}`}>
                    {/* If imageUrl exists, display it as a background image */}
                    {vacation?.imageUrl && <img className="vacationImage" src={vacation.imageUrl} alt="Vacation preview" />}
                    <input type="file" accept="image/*" {...register("image")} />
                </div>
                <br /><br />

                <button type="submit">update the vacation</button>
                <span>  </span>
                <button className="cancelButton" type="button" onClick={backToVacation}>cancel</button>
            </form>
            
        </div>
    );
}
