import { GM } from "$";
import { FactionController } from "./modules/faction/FactionController.js";

globalThis.GM = GM;

if (location.pathname.startsWith("/factions.php")) {
    new FactionController().init();
}
