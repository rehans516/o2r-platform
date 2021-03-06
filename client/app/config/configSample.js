// credits to Jurgen Van de Moere, 2016. http://www.jvandemo.com/how-to-configure-your-angularjs-application-using-environment-variables/
(function(){
    window.__env = window.__env || {};
    window.__env.server = /*String containing server address */;
    window.__env.api = /*String containing base api*/;
    window.__env.sizeRestriction = /*integer*/;
    window.__env.disableTracking = /*true/false, default is false*/;
    window.__env.enableDebug = /*true/false, default is false*/;
    window.__env.piwik = /*String containing piwik server adress*/;
})();