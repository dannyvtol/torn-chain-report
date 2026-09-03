import { FactionController } from "./modules/faction/FactionController.js";
import { GM } from "$";

globalThis.GM = GM;

if (location.pathname.startsWith("/factions.php")) {
    new FactionController().init();
}
