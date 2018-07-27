/// <reference path="discover/discover.module.ts"/>

namespace Online {

  const module = angular
    .module('hawtio-online', ['hawtio-about'])
    .config(addRoutes)
    .run(addOnlineTab)
    .run(addLogoutToUserDropdown)
    .run(addProductInfo);

  function addRoutes($routeProvider: angular.route.IRouteProvider) {
    'ngInject';

    $routeProvider
      .when('/online', { redirectTo: '/online/discover' })
      .when('/online/discover', { templateUrl: 'src/discover/discover.html' });
  }

  function addOnlineTab(mainNavService: Nav.MainNavService): void {
    'ngInject';

    mainNavService.addItem({
      title: 'Online',
      href: '/online/discover',
      isValid: () => true,
    });
  }

  function addLogoutToUserDropdown(
    HawtioExtension: Core.HawtioExtension,
    $compile: ng.ICompileService,
    userDetails: Core.AuthService): void {
    'ngInject';

    HawtioExtension.add('hawtio-logout', ($scope) => {
      $scope.userDetails = userDetails;
      const template = '<a href="" ng-click="userDetails.logout()">Logout ({{userDetails.username}})</a>';
      return $compile(template)($scope);
    });
  }

  function addProductInfo(aboutService: About.AboutService) {
    'ngInject';
    aboutService.addProductInfo('Hawtio Online', 'PACKAGE_VERSION_PLACEHOLDER');
  }

  hawtioPluginLoader.addModule(module.name);

  hawtioPluginLoader.registerPreBootstrapTask({
    name: 'HawtioTabTitle',
    depends: 'ConfigLoader',
    task: (next) => {
      document.title = _.get(window, 'hawtconfig.branding.appName', 'Hawtio Console');
      next();
    }
  });

  export const log = Logger.get(module.name);
}
