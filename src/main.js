import { AttackController } from "./modules/attack/AttackController.js";
import { FactionController } from "./modules/faction/FactionController.js";
import { GM } from "$";

globalThis.GM = GM;

if (location.pathname.startsWith("/factions.php")) {
    new FactionController().init();
}

if (
    location.pathname === "/page.php" &&
    new URLSearchParams(location.search).get("sid") === "attack"
) {
    new AttackController().init();
}
