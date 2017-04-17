
 function htmlDecode(value) {
     return $("<textarea/>").html(value).text();
 }

 function htmlEncode(value) {
     return $('<textarea/>').text(value).html();
 }
 tracks = [{
     "track": 1,
     "name": "Psychedelic Goa Trance",
     "file": "goa"
 }, {
     "track": 2,
     "name": "Psychedelic Talks",
     "file": "talk"
 }, {
     "track": 3,
     "name": "Meditation Radio",
     "file": "meditation"
 }, {
     "track": 4,
     "name": "Deep Trance Radio",
     "file": "deep-trance"
 }, {
     "track": 5,
     "name": "TheStonedApes.com Talk Radio",
     "file": "thestonedapes"
 }, {
     "track": 6,
     "name": "MarijuanaDaily.NET Talk Radio",
     "file": "marijuanadaily"
 }
 ]
 $(document).ready(function() {

     var b = document.documentElement;
     b.setAttribute('data-useragent', navigator.userAgent);
     b.setAttribute('data-platform', navigator.platform);



     var supportsAudio = !!document.createElement('audio').canPlayType;
     if (supportsAudio) {
         var index = 0,
         playing = false,
         mediaPath = 'http://thestonedapes.com:8000/',
         extension = 'mp3',

         buildPlaylist = $.each(tracks, function(key, value) {
             var trackNumber = value.track,
             trackName = value.name,
             trackFile = value.file;
             if (trackNumber.toString().length === 1) {
                 trackNumber = '0' + trackNumber;
             } else {
                 trackNumber = '' + trackNumber;
             }
             $('#plList').append('<li class="shadow"><div class="plItem"><h5 class="plName">' + trackName + '</h5><div class="plTitle plTitle-' + trackFile + '">' + trackName + '</div></div></li>');
         }),
         trackCount = tracks.length,
         npAction = $('#npAction'),
                   npTitle = $('#npTitle'),
                   audio = $('#audio1').bind('play', function () {
                       playing = true;
                       updateNpAction();
                   }).bind('pause', function () {
                       playing = false;
                       npAction.text('Paused...');
                   }).bind('ended', function () {
                       npAction.text('Paused...');
                       if ((index + 1) < trackCount) {
                           index++;
                           loadTrack(index);
                           audio.play();
                       } else {
                           audio.pause();
                           index = 0;
                           loadTrack(index);
                       }
                   }).get(0),
                   btnPrev = $('#btnPrev').click(function () {
                       if ((index - 1) > -1) {
                           index--;
                           loadTrack(index);
                           if (playing) {
                               audio.play();
                           }
                       } else {
                           audio.pause();
                           index = 0;
                           loadTrack(index);
                       }
                   }),
                   btnNext = $('#btnNext').click(function () {
                       if ((index + 1) < trackCount) {
                           index++;
                           loadTrack(index);
                           if (playing) {
                               audio.play();
                           }
                       } else {
                           audio.pause();
                           index = 0;
                           loadTrack(index);
                       }
                   }),
                   li = $('#plList li').click(function () {
                       var id = parseInt($(this).index());
                       if (id !== index) {
                           playTrack(id);
                           updateNpAction();
                       }
                   }),
                   loadTrack = function (id) {
                       $('.plSel').removeClass('plSel');
                       $('#plList li:eq(' + id + ')').addClass('plSel');
                       npTitle.text(tracks[id].name);
                       index = id;
                       audio.src = mediaPath + tracks[id].file + extension;
                   },
                   playTrack = function (id) {
                       loadTrack(id);
                       audio.play();
                   };
                   extension = audio.canPlayType('audio/mpeg') ? '.mp3' : audio.canPlayType('audio/ogg') ? '.ogg' : '';
                   loadTrack(index);
     }


     // update radio titles
     var fetchStreamInfo = function() {
         $.getJSON("http://thestonedapes.com:8000/status-json.xsl", function(data) {
             data.icestats.source.forEach(function(currentSource) {
                 tracks.forEach(function(track) {
                     if (currentSource.title && currentSource.listenurl &&   currentSource.listenurl.includes(track.file+".mp3")) {
                         $('.plTitle-'+track.file).text(htmlDecode(currentSource.title.replace(/_/g, '')));
                     }
                 });

                 cleanTitles(".plTitle");
             });

             updateStreamInfo();
             updateNpAction();

         });
     }

     // fetch stream info on site load
     fetchStreamInfo();

     // after initial site load, only fetch every 5 seconds
     var updateStreamInfo = function() {
         window.setTimeout(fetchStreamInfo, 5000);
     };

     updateStreamInfo();

 });

 function cleanTitles(titleClass){
     $(titleClass).each(function(){
         var arr = $(this).text().split(' ');
         var result = "";
         for (var x=0; x<arr.length; x++)
             result+=arr[x].substring(0,1).toUpperCase()+arr[x].substring(1)+' ';
         $(this).text(result.substring(0, result.length-1));
     });
 }

 function updateNpAction(){
     var title = $('.plSel .plTitle').text();
     $('#npAction').text(title);
 }

 var myAudio = document.getElementById('audio1');

 function hideVisuals(){
     $('.psy *').css('animation-play-state', 'paused').fadeOut(2500);
     $('.radioplayer').css('animation-play-state', 'paused');
 }
 function showVisuals(){
     $('.psy').fadeIn(2500);
     $('.radioplayer').css('animation-play-state', 'running');
     $('.psy *').css('animation-play-state', 'running');
 }


 ["playing", "play"].forEach(function(event){
     myAudio.addEventListener(event, showVisuals, true);
 });

 ["pause", "suspend", "error"].forEach(function(event){
     myAudio.addEventListener(event, hideVisuals, true);
 });

