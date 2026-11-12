let gameDropdown = document.getElementById("game");
let teamDropdown = document.getElementById("team");

function addTeamOption(name, id) {
    let option = document.createElement("option");
    option.value = id;
    option.textContent = name;

    teamDropdown.appendChild(option);
}

function updateTeamDropdown() {
    teamDropdown.options.length = 1; // Delete every option except placeholder

    if (gameDropdown.value === "") {
        teamDropdown.disabled = true;
        return;
    }
    
    teamDropdown.disabled = false;
    const teamData = gameDropdown.selectedOptions[0].dataset;

    addTeamOption(teamData.awayName, teamData.awayId);
    addTeamOption(teamData.homeName, teamData.homeId);
}

gameDropdown.addEventListener("change", updateTeamDropdown);

updateTeamDropdown();
