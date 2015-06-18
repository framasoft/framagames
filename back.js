// Lien retour Framagames
document.addEventListener('DOMContentLoaded', function() {
    var framagames = document.createElement('a');
        framagames.style = "position: absolute;z-index:100;background:#fff;top:0px;left:0px;padding:5px 10px;border-radius:0 0 5px 0;font-family: DejaVu Sans !important;color: #333;font-size:14px;text-decoration:none;font-weight:normal;";
        framagames.href="/";
        framagames.target="_top";
        framagames.id="framagames"
    document.getElementsByTagName('body')[0].appendChild(framagames);
    document.getElementsByTagName('body')[0].style.paddingTop = "25px";
    document.getElementById("framagames").innerHTML = '&larr; Retour sur <b><span style="color:#6A5687">Frama</span><span style="color: #8E9C48;">games</span></b>';
});

// Script Piwik
var _paq = _paq || [];

_paq.push([function() {
    var self = this;
    function getOriginalVisitorCookieTimeout() {
        var now = new Date(),
        nowTs = Math.round(now.getTime() / 1000),
        visitorInfo = self.getVisitorInfo();
        var createTs = parseInt(visitorInfo[2]);
        var cookieTimeout = 33696000; // 13 mois en secondes
        var originalTimeout = createTs + cookieTimeout - nowTs;
        return originalTimeout;
    }
    this.setVisitorCookieTimeout( getOriginalVisitorCookieTimeout() );
}]);

_paq.push(["trackPageView"]);
_paq.push(["enableLinkTracking"]);

(function() {
  var u="https://stats.framasoft.org/";
  _paq.push(["setTrackerUrl", u+"piwik.php"]);
  _paq.push(["setSiteId", 28]);
  var d=document, g=d.createElement("script"), s=d.getElementsByTagName("script")[0]; g.type="text/javascript";
  g.defer=true; g.async=true; g.src=u+"piwik.js"; s.parentNode.insertBefore(g,s);
})();
