var is_playing = false; var is_muted = false; var rvol;
var radio = new Audio();
//var radio = document.getElementById('radio');


function addClass(objeto, css) {
    document.getElementById(objeto).classList.add(css);
}

function removeClass(objeto, css) {
    document.getElementById(objeto).classList.remove(css);
}

function getLocation(href) {
    var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
        href: href,
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4],
        pathname: match[5],
        search: match[6],
        hash: match[7]
    };
}




function durationFormat(msecs) {
    var secs = msecs / 1000;
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    var obj = {
        "h": intToString(hours),
        "m": intToString(minutes),
        "s": intToString(seconds)
    };

    return obj;
}

function intToString(time) {
    return (parseInt(time) < 10 ? ("0" + time) : time);
}

function share() {
    var x = document.getElementsByClassName("overlay")[0];
    x.style.display = "block";
}

function share_close() {
    var x = document.getElementsByClassName("overlay")[0];
    x.style.display = "none";
}

/*
function ServerStatus(){

            var urlObject = getLocation(radio.src);
            var server=urlObject.hostname;
            var puerto=urlObject.port;

            $.ajax('https://netyco.com/radio-x-internet/rds.php?server='+server+'&puerto='+puerto)
                .done(data => console.log(data))
                .fail((xhr, status) => console.log('error:', status));
            return true;
}
*/


function ServerStatus() {

    var urlObject = getLocation(radio.src);
    var server = urlObject.hostname;
    var puerto = urlObject.port;

    document.getElementsByClassName("time")[0].innerHTML = "Cargando...";
    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", 'https://netyco.com/radio-x-internet/rds.php?server=' + server + '&puerto=' + puerto, true);
    xhReq.withCredentials = true;
    xhReq.send(null);
    xhReq.onload = function () {

        if (xhReq.responseText == "Connection refused") {
            alert("La radio esta apagada en este momento. Contacta al administrador");
            return false;
        } else {

            if (xhReq.status == 200) {
                var estado = JSON.parse(xhReq.responseText);

                if (estado.server == "error") {
                    alert(estado.server);
                    return false;
                } else {
                    return true;
                }
            }

        }
    };

}


function Radio_play() {

    if (!is_playing) {
        is_playing = true;
        radio.play();
        console.log("Reproducir");

        removeClass('play', 'mostrar');
        addClass('play', 'ocultar');

        removeClass('stop', 'ocultar');
        addClass('stop', 'mostrar');
    } else {
        Radio_stop();
    }
}

function Radio_stop() {

    radio.pause();
    radio.currentTime = 0;

    is_playing = false;

    removeClass('play', 'ocultar');
    addClass('play', 'mostrar');

    removeClass('stop', 'mostrar');
    addClass('stop', 'ocultar');
    document.getElementsByClassName("time")[0].innerHTML = "Detenido.";

}

function Radio_volumen() {
    is_muted = false;
    var value = document.getElementById("volumenbar").value;
    radio.volume = value / 100;
    radio.muted = false;
}

function Radio_mute() {

    if (is_muted) {
        is_muted = false;
        document.getElementById("volumenbar").value = rvol;
        radio.muted = false;
    } else {
        is_muted = true;
        rvol = document.getElementById("volumenbar").value;
        document.getElementById("volumenbar").value = 0;
        radio.muted = true;
    }
}

function updateRDS(server, puerto) {
    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", 'https://netyco.com/radio-x-internet/rds.php?server=' + server + '&puerto=' + puerto, true);
    xhReq.send(null);
    xhReq.onload = function () {
        if (xhReq.status === 200) {
            var cancion = JSON.parse(xhReq.responseText);
            document.getElementsByClassName("cancion")[0].innerHTML = cancion.nombre;
            console.log(cancion.nombre);
        }
    };
}

var Netyco = function () { }


Netyco.scripts = function (p) {


    var streamURL = p.streamURL;
    var autoplay = p.autoplay;
    var volume = p.volume;
    var title = p.title;
    var web = p.web;
    var afiliado = p.afiliado;

    var urlObject = getLocation(streamURL);
    var server = urlObject.hostname;
    var puerto = urlObject.port;


    radio.id = 'Netyco-streaming-Radio';
    radio.src = p.streamURL;
    radio.autoplay = autoplay;
    radio.controls = 'controls';

    radio.onplay = function () { autoInicio() };
    radio.ontimeupdate = function () { reproduciendo() };

    function autoInicio() {
        is_playing = true;
        removeClass('play', 'mostrar');
        addClass('play', 'ocultar');
        removeClass('stop', 'ocultar');
        addClass('stop', 'mostrar');
    }

    function reproduciendo() {
        time = radio.currentTime * 1000;
        pos = durationFormat(time);
        document.getElementsByClassName("time")[0].innerHTML = "En linea";
        if (pos.s == "01") {
            updateRDS(server, puerto);
        }
    }




}// end Netyco.scripts

Netyco.css = function (p) {


    var playerpath = "https://cdn.netyco.com/radio-x-internet/v2/";
    //var playerpath="http://localhost/player/v2/";
    var rdspath = "https://netyco.com/radio-x-internet/";

    var style = p.style;
    var bgcolor = p.bgcolor;
    var position = p.position;
    var bgimg = p.bgimg;
    var txtTituloColor = p.txtTituloColor;
    var txtStatusColor = p.txtStatusColor;
    var txtColor = p.txtColor;

    //opcionales
    var playerBorder = p.playerBorder;
    var playerBorderColor = p.playerBorderColor;
    var playerBorderStyle = p.playerBorderStyle;

    if (!bgimg) { bgimg = ""; }
    if (!playerBorder) { playerBorder = 1; }
    if (!playerBorderColor) { playerBorderColor = '#000000'; }
    if (!playerBorderStyle) { playerBorderStyle = 'Solid'; }

    var html = '<link href="' + playerpath + "/" + style + '.css" rel="stylesheet" type="text/css" />';

    html += '<style>';
    html += '#NetycoPlayer{color:' + txtColor + ';background-color:' + bgcolor + ';background-image:url(' + bgimg + ');background-position:' + position + '; border-width:' + playerBorder + 'px; border-style:' + playerBorderStyle + '; border-color:' + playerBorderColor + ';}';
    html += '#NetycoPlayer a{color:' + txtColor + ';text-decoration:none}';
    html += '#NetycoPlayer .time{color:' + txtStatusColor + ';}';
    html += '#NetycoPlayer .titulo{color:' + txtTituloColor + '}';
    html += '#NetycoPlayer #btnShare a{color:#000000}';
    html += '';
    html += '';
    html += '</style>';


    return html;
}//end Netyco.css

Netyco.player = function (p) {

    var title = p.title;
    var afiliado = p.afiliado;
    var btnLineaColor = p.btnLineaColor;
    var btnFondoColor = p.btnFondoColor;
    var streamURL = p.streamURL;
    var volume = p.volume;
    var android = p.android;

    if (!p.volume) {
        volume = 50;
    }
    var html = "";
    html += "<div id=\"NetycoPlayer\"><div class=\"controles\">";
    html += "";
    html += "<svg onclick=\"javascript:Radio_play();\" style=\"cursor: hand;\" height=\"150\" width=\"150\" viewBox=\"0 0 100 100\" class=\"buttons\">";
    html += "<circle class=\"size\" cx=\"50\" cy=\"50\" r=\"25\" stroke=\"" + btnLineaColor + "\" stroke-width=\"5\" fill=\"" + btnFondoColor + "\" \/>";
    html += "<polygon id=\"play\" class=\"mostrar size\" points=\"45 40, 45 60, 60 50\" stroke=\"" + btnLineaColor + "\" stroke-width=\"3\" fill=\"" + btnLineaColor + "\"\/>";
    html += "<rect id=\"stop\" class=\"ocultar size\" x=\"40\" y=\"40\" width=\"20\" height=\"20\" stroke=\"" + btnLineaColor + "\" stroke-width=\"3\" fill=\"" + btnLineaColor + "\"\/>";
    html += "<\/a>";
    html += "<\/svg>";
    html += "    	         ";
    html += "";
    html += "";
    html += "";
    html += "    <div class=\"titulo\">" + title + "<\/div>";
    html += "    <div class=\"deco1\"><\/div>";
    html += "<marquee behavior=\"scroll\" class=\"cancion\" scrollamount=\"2\" direction=\"left\" width=\"350\"><\/marquee>";
    html += "    	";
    html += "        <div id=\"btnShare\"  class=\"compartir\"><a href=\"javascript:share();\">Compartir</a><\/div>";
    html += "        ";
    html += "        <div class=\"time\">Apagado<\/div>";
    html += "        ";
    html += "  ";
    html += "        ";
    html += "        <div class=\"volume\">";
    html += "                <a href=\"javascript:Radio_mute();\"class=\"buttons-mute\"><span class=\"ico-nute\"><img src=\"https:\/\/cdn.netyco.com\/radio-x-internet\/v2\/img\/speaker-bn.png\" width=\"15\" height=\"15\" \/><\/span><\/a>";
    html += "                <input onchange=\"javascript:Radio_volumen();\" id=\"volumenbar\" type=\"range\" name=\"points\" min=\"0\" max=\"100\" value=" + volume + ">";
    html += "    	<\/div>";
    html += "    ";
    //	html += '    <div class="brand">Crea tu radio con <a target="_blank" href="http://www.netyco.com/?aff='+afiliado+'">Netyco</a></div>';

    html += "    <\/div>";
    html += "<\/div>";
    // html +='<div id="brand"><hr size="1" /><a href="https://www.netyco.com/">Crea tu radio con Netyco Streaming</a></div>';

    html += "";
    html += "";
    html += "<br>";

    if (!!android) {
        html += "<a href=" + android + "><img width=\"100px\" src=\"https:\/\/cdn.netyco.com\/radio-x-internet\/v2\/img\/\/android.png\" alt=\"Disponible en Android\" \/></a>";
    }

    return html;
}//End Netyco.player

Netyco.social = function (p) {

    var nombre = p.title;
    var web = p.web;
    var path = p.path;
    var sharer = "http://www.netyco.com/radio-x-internet/v2/sharer.php?url=" + path + "&title=" + p.title


    var html = "";

    html += "<div id=\"SharePlayer\" class=\"overlay\" style=\"display: none;\">";
    html += "	<div class=\"modal\">";
    html += "    <center>";
    html += "    <h1>Comparti esta radio con tus amigos<\/h1>";
    html += "    <div id=\"share-buttons\">";


    html += "    <!-- Buffer -->";
    html += '<a class="js-social-share" href="https://bufferapp.com/add?url=' + sharer + '&amp;text=Escucha nuestra radio por Internet" target="_blank">';
    html += "        <img src=\"https:\/\/cdn.netyco.com\/radio-x-internet\/v2\/img\/social\/buffer.png\" alt=\"Buffer\" \/>";
    html += "    <\/a>";
    html += "    ";


    html += "<!-- Digg -->";
    html += '<a class="js-social-share" href=\"//www.digg.com/submit?url=' + sharer + '" target="_blank">';
    html += "<img src=\"https:\/\/cdn.netyco.com\/radio-x-internet\/v2\/img\/social\/diggit.png\" alt=\"Digg\" \/>";
    html += "<\/a>";


    html += "    <!-- Facebook -->";
    html += '<a class="js-social-share" href="http://www.facebook.com/sharer.php?u=' + sharer + '" target="_blank">';
    html += " <img src=\"https:\/\/cdn.netyco.com\/radio-x-internet\/v2\/img\/social\/facebook.png\" alt=\"Facebook\" \/>";
    html += "    <\/a>";


    html += "    <!-- Google+ -->";
    html += '<a class="js-social-share" href="https://plus.google.com/share?url=' + sharer + '" target="_blank">';
    html += "        <img src=\"https:\/\/cdn.netyco.com\/radio-x-internet\/v2\/img\/social\/google.png\" alt=\"Google\" \/>";
    html += "    <\/a>";


    html += "<!-- LinkedIn -->";
    html += '<a class="js-social-share" href="//www.linkedin.com/shareArticle?mini=true&amp;url=' + sharer + '" target="_blank">';
    html += "        <img src=\"https:\/\/cdn.netyco.com\/radio-x-internet\/v2\/img\/social\/linkedin.png\" alt=\"LinkedIn\" \/>";
    html += "    <\/a>";


    html += "    <!-- Pinterest -->";
    html += "    <a class=\"js-social-share\" href=\"#\">";
    html += "        <img src=\"https:\/\/cdn.netyco.com\/radio-x-internet\/v2\/img\/social\/pinterest.png\" alt=\"Pinterest\" \/>";
    html += "    <\/a>";

    html += "    <!-- Print -->";
    html += "    <a href=\"javascript:;\" onclick=\"window.print()\">";
    html += "        <img src=\"https:\/\/cdn.netyco.com\/radio-x-internet\/v2\/img\/social\/print.png\" alt=\"Print\" \/>";
    html += "    <\/a>";


    html += "    <!-- Reddit -->";
    html += '<a class="js-social-share" href="//reddit.com/submit?url=' + sharer + '&amp;title=Escucha nuestra radio por interent\" target="_blank">';
    html += "        <img src=\"https:\/\/cdn.netyco.com\/radio-x-internet\/v2\/img\/social\/reddit.png\" alt=\"Reddit\" \/>";
    html += "    <\/a>";

    html += "<!-- StumbleUpon-->";
    html += '<a class="js-social-share" href="//www.stumbleupon.com/submit?url=' + sharer + '&amp;title=Escucha nuestra radio por internet" target="_blank">';
    html += "        <img src=\"https:\/\/cdn.netyco.com\/radio-x-internet\/v2\/img\/social\/stumbleupon.png\" alt=\"StumbleUpon\" \/>";
    html += "    <\/a>";


    html += "    <!-- Tumblr-->";
    html += '<a class="js-social-share" href="//www.tumblr.com/share/link?url=' + sharer + '&amp;title=Escucha nuestra radio por internet" target="_blank">';
    html += "        <img src=\"https:\/\/cdn.netyco.com\/radio-x-internet\/v2\/img\/social\/tumblr.png\" alt=\"Tumblr\" \/>";
    html += "    <\/a>";

    html += "    <!-- Twitter -->";
    html += '<a class="js-social-share" href="https://twitter.com/share?url=' + sharer + '&amp;text=Escucha nustra radio por internet&amp;hashtags=RadioOnline,EnVivo" target=\"_blank\">';
    html += "        <img src=\"https:\/\/cdn.netyco.com\/radio-x-internet\/v2\/img\/social\/twitter.png\" alt=\"Twitter\" \/>";
    html += "    <\/a>";


    html += "    <!-- VK -->";
    html += '<a class="js-social-share" href="http://vkontakte.ru/share.php?url=' + sharer + '" target="_blank">';
    html += "<img src=\"https:\/\/cdn.netyco.com\/radio-x-internet\/v2\/img\/social\/vk.png\" alt=\"VK\" \/>";
    html += "<\/a>";


    html += "    <!-- Yummly -->";
    html += '<a class="js-social-shar\" href=\"//www.yummly.com/urb/verify?url=' + sharer + '&amp;title=Escucha nuestra radio por internet" target="_blank">';
    html += "        <img src=\"https:\/\/cdn.netyco.com\/radio-x-internet\/v2\/img\/social\/yummly.png\" alt=\"Yummly\" \/>";
    html += "    <\/a>";
    html += "";
    html += "<\/div>";
    html += "<br><a id=\"cancel\" href=\"javascript:share_close();\">Cancelar<\/a>";
    html += "<center>";
    html += "<\/div>";
    html += "<\/div>";
    html += "<\/div>";
    return html;
}//End Netyco.social


Netyco.insert = function (p) {
    var html = "";
    Netyco.scripts(p);
    html += Netyco.css(p);
    html += Netyco.player(p);
    html += Netyco.social(p);

    document.getElementById('radioload').setAttribute('align', 'center');
    document.getElementById("radioload").innerHTML = html;

}