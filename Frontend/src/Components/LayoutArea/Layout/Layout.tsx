import { Header } from "../Header/Header";
import { Menu } from "../Menu/Menu";
import { Routing } from "../Routing/Routing";
import "./Layout.css";

export function Layout(): JSX.Element {
    return (
        <div className="Layout">
            <header>
                <Header />
            </header>

            <div>
                <Menu />
            </div>

            <div className="MainPage">
                <Routing />
            </div>

            <footer>
                This site is by OSB. 
            </footer>
        </div>
    );
}
