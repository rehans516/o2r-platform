/**
 * Directive for displaying Code and Data
 * Expects one parameter: o2rInspectData of type object
 * Parameter is expected to have three attributes: code(array), data(array), publication(object)
 * Where code has following structure:
 * [{type: 'foo', path: 'bar', name: 'foobar'}, ...]
 * 
 * Where data has following structure:
 * ['path/to/first/file', 'path/to/second/file', ...]
 * 
 * Where publication contains the whole metadata object
 * 
 * Example: 
 * <o2r-inspect o2r-inspect-code="{{ {code: [], data: [], publication: {}} }}"></o2r-inspect>
 */


(function(){
    'use strict';

    angular
        .module('starter.o2rInspect')
        .directive('o2rInspect', o2rInspect);
    
    o2rInspect.$inject = ['$log', 'publications', 'icons'];
    function o2rInspect($log, publications, icons){
        return {
            restrict: 'E',
            templateUrl: 'app/o2rInspect/o2rInspect.template.html',
            scope: {
                o2rInspectData: '@o2rInspectData'
            },
            link: link
        };

        function link(scope, iElement, attrs){
            scope.$watch('o2rInspectData', function(newVal, oldVal){
                var inspect = angular.fromJson(newVal);
                if(!inspect.hasOwnProperty('code')) throw 'o2rInspectData.code undefined';
                if(!inspect.hasOwnProperty('data')) throw 'o2rInspectData.data undefined';
                if(!inspect.hasOwnProperty('publication')) throw 'o2rInspectData.publication undefined';

                scope.icons = icons;
                scope.datasets = prepareDatasets(inspect.data);
                scope.selectedData = scope.datasets[0];

                scope.code = prepareCode(inspect.code);
                scope.selectedCode = scope.code[0];

                scope.openMenu = openMenu;

                scope.selectData = selectData;
                scope.selectCode = selectCode;

                ///////////

                /**
                 * 
                 * @param {Array} dsets , array containing all input files
                 */
                //TODO
                //Replace /api/v1/compendium/ with env variable so it will still work on all api versions
                function prepareDatasets(dsets){
                    var regex = '/tmp/o2r/compendium/' + inspect.publication.id;
                    var results = [];
                    for(var i in dsets){
                        results.push(publications.getContentById(inspect.publication, dsets[i].replace(regex, '/api/v1/compendium/' + inspect.publication.id + '/data')));
                    }
                    return results;
                }

                //TODO
                // Rewrite code so that it handles all path possibilities right
                // Replace /api/v1/compendium/ with env variable so it will still work on all api versions
                function prepareCode(code){
                    var regex = inspect.publication.id;
                    var results = [];
                    for(var i in code){
                        code[i].path = code[i].path.replace(regex, '/api/v1/compendium/' + inspect.publication.id + '/data');
                        results.push(code[i]);
                    }
                    return results;
                }

                function openMenu($mdMenu, ev){
                    $mdMenu.open(ev);
                }

                function selectData(item){
                    $log.debug('selected %o', item);
                    scope.selectedData = item;
                }

                function selectCode(item){
                    $log.debug('selected %o', item);
                    scope.selectedCode = item;
                }
            }, true);

        }
    }
})();