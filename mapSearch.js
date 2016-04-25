var mymap;
var locations = {}
var search = ''

$(document).ready(function(){
    startMap();
    $('#searchBtn').click(searchLocations);
});

function startMap(){
    mymap = L.map('map').setView([40.45, -3.69], 11);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);
}

function searchLocations() {
    $('#results ol').empty();
    locations = {};
    search = $('#addr').val();
    $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + search, function (data) {
        data.forEach(function(location){
            $('#results ol').append("<li id=" + location.osm_id + ">" +
                                        location.display_name + "</li>");
            locations[location.osm_id] = location;
        });
        $('#results ol').append('<p id="close">Close</p>');
        $('#results ol li').click(showInMap);
        $('#close').click(removeResults);
    });
}

function removeResults(){
    $('#results ol').empty();
    locations = {};
    search = '';
}

function showInMap(e) {
    var location = locations[e.target.id];

    // If I set first panto and then setzoom, it doesn't work
    if (location.type == 'city'){
        mymap.setZoom(12);
    } else if (location.type == 'administrative') {
        mymap.setZoom(10);
    } else {
        mymap.setZoom(14);
    }
    mymap.panTo({lat: location.lat, lon: location.lon});
    getPhotos()
}

function getPhotos() {
    var url = 'http://api.flickr.com/services/feeds/photos_public.gne?tags=' + search + '&tagmode=any&format=json&jsoncallback=?'
    $.getJSON(url, function(data){
        var imgs = '';
        data.items.forEach(function(item){
            imgs += '<img src="' + item.media.m + '" alt="' + item.title + '" /> '
        });
        $('#photos').empty();
        $('#photos').append(imgs);
    });
}
