import { useForm } from "react-hook-form";
import "./AddANewVacation.css";
import { notify } from "../../../Utils/Notify";
import { useNavigate } from "react-router-dom";
import { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { imageUtil } from "../../../Utils/ImageUtil";

export function AddANewVacation(): JSX.Element {
    const { register, handleSubmit, watch } = useForm<VacationModel>();
    const navigate = useNavigate();

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    //monitor the value startDate (in a form) in real-time
    const startDate = watch("startDate");

    //get the day after the chosen start date
    function getNextDay(date: string): string {
        const chosenStartDate = new Date(startDate);
        chosenStartDate.setDate(chosenStartDate.getDate() + 1);
        return chosenStartDate.toISOString().split("T")[0];
    };

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
            }

            await vacationService.addVacation(vacation);
            notify.success("The vacation has been added");
            navigate("/vacations");
        }
        catch (err: any) {
            notify.error(err)
        }
    };

    async function backToVacation() {
        navigate("/vacations");
    };

    return (
        <div className="New">
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
                <input type="date" {...register("startDate")} required min={today}
                    title="The beginning date can not be before today" />
                <br /><br />

                <label>Ending date</label>
                <input type="date" {...register("endDate")} required min={startDate ? getNextDay(startDate) : today}
                    title="The ending date of the vacation cannot be before the beginning" />
                <br /><br />

                <label>Price ($)</label>
                <input type="number" {...register("price")} required min="0" max="10000" step="0.01" />
                <br /><br />

                <label>Image</label>
                <input type="file" accept="image/*" {...register("image")} required />
                <br /><br />

                <button type="submit">add vacation</button>
                <span>  </span>
                <button className="cancelButton" type="button" onClick={backToVacation}>cancel</button>

            </form>

        </div>
    );
}
