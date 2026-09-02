import { FactionController } from "./modules/faction/FactionController.js";

if (location.pathname.startsWith("/factions.php")) {
    new FactionController().init();
}
