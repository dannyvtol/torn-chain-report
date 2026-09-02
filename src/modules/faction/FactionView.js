export class FactionView {
    /**
     * Injects a Torn-styled API-key panel immediately after mountEl.
     * @param {Element} mountEl
     */
    render(mountEl) {
        const panel = document.createElement("div");
        panel.className = "profile-wrapper medals-wrapper m-top10";

        panel.innerHTML = `
            <div class="menu-header">Chain Report</div>
            <div class="profile-container">
                <div class="profile-container-description">
                    <span>Torn API-key</span>
                    <input type="password" />
                    <button>Save</button>
                </div>
            </div>
        `;

        mountEl.insertAdjacentElement("afterend", panel);
    }
}
