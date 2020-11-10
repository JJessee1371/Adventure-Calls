//Variable Definitions
const card1 = $('#card1');
const card2 = $('#card2');
const card3 = $('#card3');
const card4 = $('#card4');


//Page 1 JS 
//====================================

//Event listener for the searchbar
const searchBar = $('#search');
const formBtn = document.getElementById('btn1');
formBtn.addEventListener('click', (e) => {
    let stateCode = searchBar.value.toUpperCase();
    if(stateCode.length > 3 || stateCode.length < 2 || isNaN(stateCode) === false) {
        $('div.verify').text('Please enter a valid state code! e.g. NY, CA, FL').attr('class', 'error');
    } 
    else {
    getInfo(stateCode);
    $('div.verify').empty();
    };
});
    

//National Park Service Ajax call. Function is attached to searchbar event listener
function getInfo(stateCode) {
    let queryURLNPS = `https://developer.nps.gov/api/v1/parks?stateCode=${stateCode}&limit=5&api_key=CIOegTmdfiM4Yf3b17p4OpcSRxRf0G6lZ4pgTuOv`;
    $.ajax({
        url: queryURLNPS,
        method: 'GET'
    }).then(function(response1) {
        
        //cardID array references items in HTML to append cards to
        cardID = [card1, card2, card3, card4];
        //imageID array creates a unique ID for each image on the cards
        imageID = ['cardimg1', 'cardimg2', 'cardimg3', 'cardimg4'];
        //parkID gives each park name span a unique ID
        parkID = ['parkName1', 'parkName2', 'parkName3', 'parkName4'];
        //infoID gives each information section a unqiue ID
        infoID = ['info1', 'info2', 'info3', 'info4'];
        //fetchData attributes determines where info is pulled from the NPS API object
        fetchData = [response1.data[0], response1.data[1], response1.data[2], response1.data[3]];

        //Empty content so new items can be placed
        card1.empty().addClass('green darken-2').css('color', 'white');
        card2.empty().addClass('green darken-2').css('color', 'white');
        card3.empty().addClass('green darken-2').css('color', 'white');
        card4.empty().addClass('green darken-2').css('color', 'white');

        //Loop to dynamically generate multiple cards
        for (i = 0; i < cardID.length; i++) {
        //Appends to the div class=card Section 1
        let imgDiv = $('<div>').attr('class', 'card-image');
        let newImg = $('<img>').attr('id', imageID[i]).attr('src', fetchData[i].images[0].url).attr('alt', fetchData[i].images[0].altText);
        let newSpan = $('<span>').attr('id', parkID[i]).attr('class', 'card-title').text(fetchData[i].fullName);
        //Section 2
        let cardDiv = $('<div>').attr('class', 'card-content');
        let para = $('<p>').attr('id', infoID[i]).text(fetchData[i].description);
        //Section 3
        let actionDiv = $('<div>').attr('class', 'card-action');
        let infoBtn = $('<button>').attr('class', 'waves-effect waves-light btn teal darken-4 cardBtn').attr('data-parkCode', fetchData[i].parkCode).text('Get more info!');
        //Append contents to div for each section
        let section1 = imgDiv.append(newImg).append(newSpan);
        let section2 = cardDiv.append(para);
        let section3 = actionDiv.append(infoBtn);
        //Append sections to the cards in the HTML
        cardID[i].append(section1).append(section2).append(section3);
        };       
    });
};


// Air quality & Weather Information
$("button").on("click", function(event) {
    event.preventDefault();
    var APIkey = "8ee94bd2-5afc-4e57-825a-4e87cde01a7e";
    var city = $("#city").val();
    var state = $("#state").val();
    var queryURLAir = `https://api.airvisual.com/v2/city?city=${city}&state=${state}&country=USA&key=${APIkey}`;

    $.ajax({
        url: queryURLAir,
        method: 'GET'
    }).then(function(response3) {

        // Transferring content to HTML for current day air quality & weather information
        $(".city").text(response3.data.city );
        $(".date").text("Date:   " + response3.data.current.pollution.ts);
        $(".air-pollution").text("Air Quality Index (US EPA standard):   " + response3.data.current.pollution.aqius);
        $(".temp").text("Temperature (°C):   " + response3.data.current.weather.tp);
        $(".atm-pressure").text("Atmospheric Pressure (hPa):   " + response3.data.current.weather.pr);
        $(".humidity").text("Humidity (%):   " + response3.data.current.weather.hu);
        $(".wind").text("Wind Speed (m/s):   " + response3.data.current.weather.ws);
        $(".wind-direction").text("Wind Direction (as an angle of 360° (N=0, E=90, S=180, W=270):   " + response3.data.current.weather.wd);

    });
});


//Event listener for card buttons to generate further information
$('.card').on('click', ".cardBtn", function(event) {
    let parkCode = event.currentTarget.dataset.parkcode;
    localStorage.setItem('code', parkCode);
    window.location.href="act.html";
});


// Footer and leaving comments
let commentBox = document.getElementById('comments');
$('#buttonTwo').on("click",function(event){
    localStorage.setItem("comment box", commentBox.value);
});


//Transferring to new location
//Sidenav script
$(document).ready(function () {
$('.sidenav').sidenav();
});

//Carousel script
$(document).ready(function () {
$('.carousel').carousel();
});


//Page 2 JS 
//==================================================
//Pull parkCode from local storage to run moreInfo function
let parkCode = localStorage.getItem('code');

//Creates general info for the cards, full activity list, and entrance fees collection
let queryURLpark = `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&stateCode=&limit=5&sort=&api_key=CIOegTmdfiM4Yf3b17p4OpcSRxRf0G6lZ4pgTuOv`;
$.ajax({
    url: queryURLpark,
    method: 'GET'
}).then(function (response2) {

    // Transferring content to HTML for current day surise, sunset & day-length
    $(".weather-snippet").text(response2.data[0].weatherInfo);

    // Sunrise/Sunset Ajax call. Takes parameters from NPS API
    let lat = response2.data[0].latitude;
    let lng = response2.data[0].longitude;
    let date = moment().format('YYYY-MM-DD');
    let queryURLSunrise = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${date}`;
    $.ajax({
        url: queryURLSunrise,
        method: 'GET'
    }).then(function (response4) {

        // Transferring content to HTML for current day surise, sunset & day-length
        $(".sunrise").text("Sunrise:  " + response4.results.sunrise);
        $(".sunset").text("Sunset:  " + response4.results.sunset);
        $(".day-length").text("Day Length:  " + response4.results.day_length);
    });

    //Generate info for park contacts card
    $('#phone').text(`Phone: ${response2.data[0].contacts.phoneNumbers[0].phoneNumber} Ext. ${response2.data[0].contacts.phoneNumbers[0].extension}`);
    $('#email').text(`Email: ${response2.data[0].contacts.emailAddresses[0].emailAddress}`);
    $('#address1').text(
        `Mailing address: ${response2.data[0].addresses[0].line1}
        ${response2.data[0].addresses[0].city}
        ${response2.data[0].addresses[0].stateCode}`
    );
    $('#address2').text(
        `Physical address: ${response2.data[0].addresses[1].line1}
        ${response2.data[0].addresses[1].city}
        ${response2.data[0].addresses[1].stateCode}`
    );

    //Generate info for park general info card
    let advisory = $('<p>').text(response2.data[0].operatingHours[0].description);
    $('#advisory').append(advisory);
    $('#park-site').attr('href', response2.data[0].url);

    //Generate info for directions card
    $('#directions').text(response2.data[0].directionsInfo);
    $('#directionsurl').attr('href', response2.data[0].directionsUrl);

    //List all activities within the proper collection
    for (i = 0; i < response2.data[0].activities.length; i++) {
        let item = $('<li>').attr('class', 'collection-item').addClass('activity').text(response2.data[0].activities[i].name);
        $('#activity-header').append(item);
    };

    //List all entrance fees within the proper collection 
    for (i = 0; i < response2.data[0].entranceFees.length; i++) {
        let newItem = $('<li>').attr('class', 'collection-item').text('$' + response2.data[0].entranceFees[i].cost + ' ' + response2.data[0].entranceFees[i].description);
        $('#fees-header').append(newItem);
    };
});

//This ajax call will create activity suggestions for the user alongside the full activity list
let queryActive = `https://developer.nps.gov/api/v1/thingstodo?parkCode=${parkCode}&limit=3&api_key=CIOegTmdfiM4Yf3b17p4OpcSRxRf0G6lZ4pgTuOv`;
$.ajax({
    url: queryActive,
    method: 'GET'
}).then(function (response5) {

    let dataSelect = [response5.data[0], response5.data[1], response5.data[2]];
    for (i = 0; i < dataSelect.length; i++) {
        $('<h3>').text(dataSelect[i].title).css('text-decoration', 'underline').appendTo($('.recommended'));
        $('.recommended').append(dataSelect[i].shortDescription);
        $('<p>').text('Duration: ' + dataSelect[i].duration).appendTo($('.recommended'));
    };
});