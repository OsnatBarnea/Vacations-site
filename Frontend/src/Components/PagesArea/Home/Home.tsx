import "./Home.css";
import backgroundImage from "../../../Assets/Images/homeImage.png"; 

export function Home(): JSX.Element {

    return (
        <div className="Home">

            <p>Welcome to OSB vacation site. Please login/register to see the vacations.</p>
           
            <img src={backgroundImage}/>
        </div>
    );
}
