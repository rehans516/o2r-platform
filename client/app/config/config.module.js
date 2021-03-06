(function(){
    'use strict';

    /* eslint-disable angular/window-service */
    window.__env = window.__env || {};

    var env = {
        server : window.__env.server || 'http://localhost',
        c_api: window.__env.api || '/api/v1',
        sizeRestriction: window.__env.sizeRestriction || 10000000,
        disableTracking: window.__env.disableTracking || false,
        enableDebug: window.__env.enableDebug || false,
        version: window.__env.version || 'deployment'
    };
    env.api = env.server + env.c_api;

    /* eslint-enable angular/window-service */

    angular
        .module('conf', [])
        .constant('env', env);

})();