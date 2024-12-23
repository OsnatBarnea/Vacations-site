import "./Page404.css";
import pageNotFound from "../../../Assets/Images/notFoundImg.png";


export function Page404(): JSX.Element {

    return (
        <div className="Page404">

            <h3>The page you are looking for doesn't exist.</h3>

            <img className="pageNotFoundImg" src={pageNotFound} />
        </div>
    );
}
