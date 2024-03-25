document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");

    document.getElementById("nw").addEventListener("change", map_async);
    document.getElementById("nh").addEventListener("change", map_async);
    document.getElementById("generate").addEventListener("click", generate_map_code);

	// Pencil Selection --> need more pencils like brush
    document.querySelectorAll('.pencil').forEach(function(pencil) {
		pencil.addEventListener('click', function(event) {
			document.getElementById('select-value').value = this.id;
			document.querySelectorAll('.pencil').forEach(function(p) {
				p.classList.remove('active-pencil');
				p.parentElement.classList.remove('active-pencil');
			});
			this.classList.add('active-pencil');
		});
	});


	// Zoom Slider --> need to be improved, a bit laggy
	let zoomTimeout;
	document.getElementById('zoom-slider').addEventListener('input', function() {
		clearTimeout(zoomTimeout);
		zoomTimeout = setTimeout(() => {
			gameContainer.style.transform = 'scale(' + this.value + ')';
		}, 100);
	});

    let mapWidth = get_map_width();
    let mapHeight = get_map_height();
	let numberMap = generateNumberMap(mapWidth, mapHeight);

	// generate a 2D Array with default values
	function generateNumberMap(width, height) {
		const numberMap = [];
		for (let i = 0; i < height; i++) {
			const row = [];
			for (let j = 0; j < width; j++) {
				row.push(0); // Default Value
			}
			numberMap.push(row);
		}
		return numberMap;
	}

	// clear all visual cells from the game container
	function clearCells() {
		const cells = document.querySelectorAll(".cell");
		cells.forEach(cell => {
			cell.parentNode.removeChild(cell);
		});
	}
    
    function get_map_width() {
        const nwidth = document.getElementById("nw").value;
        return nwidth;
    }

    function get_map_height() {
       const nheight = document.getElementById("nh").value;
       return nheight;
    }

	// called when the width or height of the map is changed
    function map_async() {
		clearCells();
        mapHeight = get_map_height();
        mapWidth = get_map_width();
		numberMap = generateNumberMap(mapWidth, mapHeight);
        renderGame();
    }

	// output for the usear
    function generate_map_code() {
        let output_custom_map = "";
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                output_custom_map += numberMap[y][x];
            }
            output_custom_map += '\n';
        }

        let output_area = document.getElementById("output");
        output_area.textContent = output_custom_map;
    }

	// click event for the cells
    window.divClicked = function(y, x) {
        const selectElement = document.getElementById("select-value");
        let selectedOption = selectElement.value;
        console.log(`Div an Position (${y}, ${x})`);
        if (selectedOption === "pencil-player") {
            numberMap[y][x] = 'P';
            renderGame();
        } else if (selectedOption === "pencil-floor") {
            numberMap[y][x] = 0;
            renderGame();
        } else if (selectedOption === "pencil-wall") {
            numberMap[y][x] = 1;
            renderGame();
        } else if (selectedOption === "pencil-collectible") {
            numberMap[y][x] = 'C';
            renderGame();
        } else if (selectedOption === "pencil-goal") {
            numberMap[y][x] = 'E';
            renderGame();
		} else if (selectedOption === "pencil-enemy" && document.getElementById("enemy-ident").value !== "" && document.getElementById("enemy-ident").value !== "6" ) {
			numberMap[y][x] = document.getElementById("enemy-ident").value;
			renderGame();
        } else if (selectedOption === "pencil-delete") {
            numberMap[y][x] = 6;
            renderGame();
        }
        //renderGame(); perfomance besser wenn es bei jedem if steht
        
    }

    function renderGame() {

		// setting grid template columns and rows
		gameContainer.style.gridTemplateColumns = `repeat(${mapWidth}, 50px)`;
		gameContainer.style.gridTemplateRows = `repeat(${mapHeight}, 50px)`;

        gameContainer.innerHTML = "";
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                const cell = document.createElement("div");
				const enemy_ident = document.getElementById("enemy-ident").value;
                cell.classList.add("cell");
                cell.innerHTML = `
                    <div style="width:100%; height:100%;" onclick="divClicked(${y}, ${x})"></div>
            `;
                if (numberMap[y][x] === 1) {
                    cell.style.backgroundImage = "url('img/wall.png')"; 
                } else if (numberMap[y][x] === 'P') {
                    cell.classList.add("player");
                } else if (numberMap[y][x] === 0) {
                    cell.style.backgroundImage = "url('img/floor.png')"; 
                } else if (numberMap[y][x] === 'C') {
                    cell.classList.add("coin");
                } else if (numberMap[y][x] === 'E') {
                    cell.classList.add("goal");
				} else if (numberMap[y][x] === enemy_ident && document.getElementById("enemy-ident").value !== "" && document.getElementById("enemy-ident").value !== "6") {
					cell.classList.add("enemy");
                } else if (numberMap[y][x] === 6) {
                    cell.style.backgroundColor = "white";
                }

                gameContainer.appendChild(cell);
            }
        }
    }

    renderGame();
});