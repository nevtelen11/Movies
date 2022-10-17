// const teszt = {
//     A: { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "" },
//     B: { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "" },
//     C: { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "" },
//     999: { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "" },
//     E: { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "" },
//     F: { 1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "", 8: "" },
// }

// const teszt = new Map();
// teszt.set('A', 12345678);
// teszt.set('B', 12345678);
// teszt.set('C', 12345678);

// const dsor = new Map();
// dsor.set(1, "");
// dsor.set(2, "");
// dsor.set(3, "F");
// dsor.set(4, "F");
// dsor.set(5, "");
// dsor.set(6, "");
// dsor.set(7, "");
// dsor.set(8, "");

// teszt.set('D', dsor);
// teszt.set('E', 12345678);
// teszt.set('F', 12345678);

// console.log(teszt.get("D").get(4));

//console.log(teszt);

let movies = {};
let selectedId = 0;
let selectedSeats = [];

fetch("https://kodbazis.hu/api/movies")
    .then((res) => res.ok ? res.json() : [])
    .then((res) => {
        res.forEach(element => {
            key = element.id;
            movies[key] = element;
        });
        selectedId = res[0].id;
        console.log(selectedId, movies);

        render();        
    });

function render() {
    let movieSelectHTML = `
    <form id="select-movie-form" class="movie-form">
    <label class="w-100">
      Válassz filmet!
      <select name="selectedMovie">`;
    for (const movie of Object.values(movies)) {
        movieSelectHTML += `<option value="${movie.id}" ${movie.id == selectedId ? "selected" :""}>${movie.name} (${movie.price} Ft)</option>`
    }  
    movieSelectHTML += `</select>
      </label>
    </form>
    `;
    document.querySelector('.app-container').innerHTML = movieSelectHTML;

    
    const numberOfRows = movies[selectedId].numberOfRows;
    const numberOfSeats = movies[selectedId].numberOfSeats;
    const seatMap = generateSeats(numberOfRows, numberOfSeats);       
    for (const bookedSeat of movies[selectedId].bookedSeats) {
        seatMap.get(bookedSeat.row).set(bookedSeat.number, "Foglalt");
    }

    let rowsHTML = "";
    let firstRow = "<div class='row-symbol'></div>";
    seatMap.get("A").forEach((seat, seatKey) => {
        firstRow += `<div class="column-number">${seatKey}</div>`;        
    });
    rowsHTML += `<div class="seat-row">${firstRow}</div>`;

    seatMap.forEach((rowValue, rowKey) => {
        let singleRowHTML = "";
        rowValue.forEach((seatValue, seatKey) => {
            singleRowHTML += `
            <div 
                class="seat ${seatValue === "Foglalt" ? "occupied" : ""}" 
                data-row="${rowKey}" 
                data-seat="${seatKey}"
                ></div>
            `;            
        });  
        rowsHTML += `
        <div class="seat-row">
            <span class="row-symbol me-2">${rowKey}</span>
            ${singleRowHTML}
        </div>
        `;   
    });
    document.querySelector('.app-container').innerHTML += rowsHTML;
    
    document.querySelector('select[name="selectedMovie"]').onchange = function(event){ 
        selectedId = event.target.value;
        render();        
    };

    document.querySelectorAll('.seat').forEach( seat => {
        seat.onclick = function (event) { 
            //console.log(event.target.dataset.row, event.target.dataset.seat);
            selectedSeats.push({row: event.target.dataset.row, number: event.target.dataset.seat});
            event.target.classList.add('selected');
            console.log(selectedSeats);
        };
    });
}

function generateSeats(numberOfRows, numberOfSeatsPerRow){
    let rowSymbols = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase();
    console.log(rowSymbols);
    let ret = new Map();
    for (let i = 0; i < numberOfRows; i++) {
        ret.set(rowSymbols[i], new Map());  
        for (let j = 1; j < numberOfSeatsPerRow + 1; j++) {
            ret.get(rowSymbols[i]).set(j);
            
        }      
    }
    return ret;
}
