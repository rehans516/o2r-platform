(function() {
    'use strict';

    angular
        .module('starter.o2rHttp')
        .factory('httpRequests', httpRequests);

    httpRequests.$inject = ['$http', '$stateParams','$log', 'env', '$window', '$q', 'ngProgressFactory', '$location'];

    function httpRequests($http, $stateParams,$log, env, $window, $q, ngProgressFactory, $location) {
        var service = {
            listCompendia: listCompendia,
            singleCompendium: singleCompendium,
            listRelatedJobs: listRelatedJobs,
            newJob: newJob,
            listJobs: listJobs,
            listSingleJob: listSingleJob,
            getLoggedUser: getLoggedUser,
            searchComp: searchComp,
            toZenodo: toZenodo,
            getShipment: getShipment,
            getStatus: getStatus,
            publishERC: publishERC,
            updateMetadata: updateMetadata,
            uploadViaSciebo: uploadViaSciebo,
            getLicenses: getLicenses,
            spatialsearch: spatialsearch
            //temporalsearch: temporalsearch

        };

        return service;

        ////////////////

        /*
         * @Desc httpRequest for retrieving a list of compendia
         * @Param query, object with attributes author, start and limit to define queries
         */

        function listCompendia(query) {
            var _url = env.api + '/compendium';
            var param = '?';

            if (query) {
                if (angular.isDefined(query.limit)) {
                    _url += param + 'limit=' + query.limit;
                    param = '&';
                }
                if (angular.isDefined(query.start)) {
                    _url += param + 'start=' + query.start;
                    param = '&';
                }
                if (angular.isDefined(query.author)) {
                    _url += param + 'user=' + query.author;
                    param = '&';
                }
            }
            return $http.get(_url);
        }

        /*
         * @Desc httpRequest for retrieving a single compendium
         * @Param id, id of requested compendium
         */
        function singleCompendium(id) {
            var _url = env.api + '/compendium/' + id;
            return $http.get(_url);
        }

        /*
         * @Desc httpRequest for retrieving a list of related jobs of a single compendium
         * @Param id, id of compendium
         */
        function listRelatedJobs(id) {
            var _url = env.api + '/compendium/' + id + '/jobs';
            return $http.get(_url);
        }

        /*
         * @Desc httpRequest for executing a new job
         * @Param body, object with attribute compendium_id, steps, inputs
         *              attribute compendium_id is required
         */
        function newJob(body) {
            var _url = env.api + '/job';
            return $http.post(_url, body);
        }
        /*
         * @Desc httpRequest for executing spatial search
         */

        function spatialsearch(coordinates_selected,from,to,x) {
            var coords = coordinates_selected.geometry.coordinates;
            console.log('c', JSON.stringify(coordinates_selected.geometry.coordinates));
            console.log(from);
            console.log(to);
            console.log(x);

            var _url = 'http://localhost:9201/_search?';

            var b = {
                "query": {
                    "bool": {
                        "must": [{
                                "range": {
                                    "metadata.o2r.temporal.begin": {
                                        "from": from
                                    }
                                }
                            },
                            {
                                "range": {
                                    "metadata.o2r.temporal.end": {
                                        "to": to
                                    }
                                }
                            },
                            {
                                "bool": {
                                    "must": {
                                        "match_all": {}
                                    },
                                    "filter": {
                                        "geo_shape": {
                                            "metadata.o2r.spatial.geometry": {
                                                "shape": {
                                                    "type": "polygon",
                                                    "coordinates": coords


                                                },
                                                "relation": "within"
                                            }
                                        }
                                    }
                                }
                            },
                            {
    "match" : { "metadata.o2r.title" :$stateParams.q }
  }
                        ]
                    }
                }
            };

            console.log(b, 'http sending request');
            return $http.post(_url, b);


        }
        /*
         * @Desc httpRequest for executing temporal search
         */

        /*function temporalsearch(lower, upper) {
            var _url = 'http://localhost:9201/_search?';

            var b = {
                "query": {
                    "bool": {
                        "must": [{
                                "range": {
                                    "metadata.o2r.temporal.begin": {
                                        "from": lower
                                    }
                                }
                            },
                            {
                                "range": {
                                    "metadata.o2r.temporal.end": {
                                        "to": upper
                                    }
                                }
                            },
                            {
                                "bool": {
                                    "must": {
                                        "match_all": {}
                                    },
                                    "filter": {
                                        "geo_shape": {
                                            "metadata.o2r.spatial.geometry": {
                                                "shape": {
                                                    "type": "polygon",
                                                    "coordinates": coords


                                                },
                                                "relation": "within"
                                            }
                                        }
                                    }
                                }
                            },
                            {
    "match" : { "metadata.o2r.title" : "geosciences" }
  }
                        ]
                    }
                }
            };

            console.log(b, 'http sending request');
            return $http.post(_url, b);


        }
        /*
         * @Desc httpRequest for retrieving a list of jobs
         * @Param query, object with attributes compendium_id, start, limit, status
         */
        function listJobs(query) {
            var _url = env.api + '/job';
            var param = '?';
            if (query) {
                if (angular.isDefined(query.compendium_id)) {
                    _url += param + 'compendium_id=' + query.compendium_id;
                    param = '&';
                }
                if (angular.isDefined(query.limit)) {
                    _url += param + 'limit=' + query.limit;
                    param = '&';
                }
                if (angular.isDefined(query.start)) {
                    _url += param + 'start=' + query.start;
                    param = '&';
                }
                if (angular.isDefined(query.status)) {
                    _url += param + 'status=' + query.status;
                    param = '&';
                }
            }
            $log.debug('calling listJobs with %s', _url);
            return $http.get(_url);
        }

        /*
         * @Desc httpRequest for retrieving a single job
         * @Param id, id of job
         */
        function listSingleJob(id) {
            var _url = env.api + '/job/' + id;
            return $http.get(_url);
        }

        /*
         * @Desc httpRequest for retrieving information of the logged in user
         */
        function getLoggedUser() {
            var _url = env.api + '/auth/whoami';
            return $http.get(_url);
        }

        /**
         * @Desc calling the elasticsearch api-endpoint for retrieving search results
         * @Param query, String containing search term
         */
        function searchComp(query, startIndex) {
            var _url = env.api + '/search?size=100&from=' + startIndex + '&q=';
            if (query) _url += query;
            return $http.get(_url);
        }

        function uploadViaSciebo(url, path) {
            var _url = 'http://localhost/api/v1/compendium/';
            return $http.post(_url, {
                content_type: "compendium_v1",
                share_url: url,
                path: "/" + path
            });
        }

        function toZenodo(compendiumID) {
            var _url = env.api + '/shipment';
            return $http.post(_url, "compendium_id=" + compendiumID + "&recipient=" + "zenodo")
        }

        function getShipment(compendiumID) {
            var _url = env.api + '/shipment?compendium_id=' + compendiumID;
            return $http.get(_url);
        }

        function getStatus(shipmentID) {
            var _url = env.api + '/shipment/' + shipmentID + '/status';
            return $http.get(_url);
        }

        function publishERC(shipmentID) {
            var _url = env.api + '/shipment/' + shipmentID + '/publishment';
            return $http.put(_url, {});
        }

        function updateMetadata(id, data) {
            var _url = env.api + '/compendium/' + id + '/metadata';
            var body = {
                o2r: data
            };
            return $http.put(_url, body);
        }

        function getLicenses() {
            return $http.get("http://licenses.opendefinition.org/licenses/groups/all.json");
        }
    };
})();
