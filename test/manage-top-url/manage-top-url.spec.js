(function () {

  'use strict';

  describe('manage top url service', function () {

    var manageTopUrl, mockedWindow;
    beforeEach(module('org.iimsoft.services.topurl'));

    beforeEach(function(){
      mockedWindow = {
        parent : {
          location:{
             hash: ''
          }
        },
        location: {
           hash: '#/home'
        }
      };

      module(function($provide) {
        $provide.value('$window', mockedWindow);
      });

      inject(function($injector) {
        manageTopUrl = $injector.get('manageTopUrl');
      });
    });

    describe('getSearch', function() {

      it('should return a string if undefined', function() {
        expect(typeof manageTopUrl.getSearch()).toBe('string');
      });

      it('should return the search value in top url', function() {
        mockedWindow.parent.location.search = 'tome=1&tape=3';
        mockedWindow.location.search = 'page_id=2';
        expect(manageTopUrl.getSearch()).toBe('tome=1&tape=3');
      });

    });

    describe('getUrlToTokenAndId function', function(){

      beforeEach(function () {
        spyOn(manageTopUrl, 'getCurrentProfile').and.returnValue('_pf=2');
        mockedWindow.parent.location.pathname = '/iimbpm/portal/homepage';
        mockedWindow.parent.location.search = '?tenant=1';
      });

      it('should change top location hash to case detail', function () {
        expect(manageTopUrl.getUrlToTokenAndId()).toBe('/iimbpm/portal/homepage?tenant=1#?id=&_p=&_pf=2');
      });

      it('should change top location hash to case detail', function () {
        var caseItemId = 123;
        expect(manageTopUrl.getUrlToTokenAndId(caseItemId, 'casedetails')).toEqual('/iimbpm/portal/homepage?tenant=1#?id=123&_p=casedetails&_pf=2');
        caseItemId = '4658';
        manageTopUrl.getUrlToTokenAndId(caseItemId, 'casedetails');
        expect(manageTopUrl.getUrlToTokenAndId(caseItemId, 'casedetails')).toEqual('/iimbpm/portal/homepage?tenant=1#?id=4658&_p=casedetails&_pf=2');
      });

    });



    describe('addOrReplaceParam function', function(){

      it('should handle border cases', function(){

        delete mockedWindow.parent.location.hash;
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.parent.location.hash).toBe('#_tab=archived');

        mockedWindow.parent.location.hash = '_p=cases&tenant=1&';
        manageTopUrl.addOrReplaceParam('_tab','');
        expect(mockedWindow.parent.location.hash).toBe('_p=cases&tenant=1&');

        mockedWindow.parent.location.hash = '_p=cases&tenant=1&cases_tab=pouet';
        manageTopUrl.addOrReplaceParam('_tab','');
        expect(mockedWindow.parent.location.hash).toBe('_p=cases&tenant=1&');

        mockedWindow.parent.location.hash = '_p=cases&tenant=1&';
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.parent.location.hash).toBe('_p=cases&tenant=1&cases_tab=archived');

        mockedWindow.parent.location.hash = '';
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.parent.location.hash).toBe('#_tab=archived');

        mockedWindow.self = mockedWindow.parent;
        mockedWindow.parent.location.hash = 'test';
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.parent.location.hash).toBe(mockedWindow.self.location.hash);
        expect(mockedWindow.parent.location.hash).toBe('test');

        delete mockedWindow.self;
        mockedWindow.parent.location.hash = '_p=page&page_tab=archived';
        manageTopUrl.addOrReplaceParam('_tab','');
        expect(mockedWindow.parent.location.hash).toBe('_p=page&');

        mockedWindow.parent.location.hash = '';
        manageTopUrl.addOrReplaceParam('_tab','');
        expect(mockedWindow.parent.location.hash).toBe('');
      });

      it('should set top location hash to archived tab', function () {

        mockedWindow.parent.location.hash = '_p=cases&tenant=1&';
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.parent.location.hash).toBe('_p=cases&tenant=1&cases_tab=archived');

        mockedWindow.parent.location.hash = '&tenant=1&_p=cases&';
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.parent.location.hash).toBe('&tenant=1&_p=cases&cases_tab=archived');

        mockedWindow.parent.location.hash = 'tenant=1';
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.parent.location.hash).toBe('tenant=1&_tab=archived');
      });

      it('should change top location hash to archived tab', function () {

        mockedWindow.parent.location.hash = '_p=cases&cases_tab=1&';
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.parent.location.hash).toBe('_p=cases&cases_tab=archived&');

        mockedWindow.parent.location.hash = '&_p=cases&cases_tab=1';
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.parent.location.hash).toBe('&_p=cases&cases_tab=archived');

        mockedWindow.parent.location.hash = 'cases_tab=1&_p=cases&';
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.parent.location.hash).toBe('cases_tab=archived&_p=cases&');

        mockedWindow.parent.location.hash = '&cases_tab=1&';
        manageTopUrl.addOrReplaceParam('_tab','archived');
        expect(mockedWindow.parent.location.hash).toBe('&cases_tab=1&_tab=archived');

      });

    });



    describe('retrieve current profile from top Url', function(){

      it('should not throw error when no top or hash empty', function(){
        expect(manageTopUrl.getCurrentProfile()).toBeUndefined();
        delete mockedWindow.parent;
        expect(manageTopUrl.getCurrentProfile()).toBeUndefined();
      });

      it('should find _pf=2 from top window', function(){

        mockedWindow.parent.location.hash = '?_p=ng-caselistingadmin&_pf=2';
        expect(manageTopUrl.getCurrentProfile()).toBe('_pf=2');

        mockedWindow.parent.location.hash = '?_pf=372&_p=ng-caselistingadmin';
        expect(manageTopUrl.getCurrentProfile()).toBe('_pf=372');

        mockedWindow.parent.location.hash = '?_p=ng-caselistingadmin&_pf=452&_pf=6';
        expect(manageTopUrl.getCurrentProfile()).toBe('_pf=452');

        mockedWindow.parent.location.hash = '_pf=122';
        expect(manageTopUrl.getCurrentProfile()).toBe('_pf=122');
      });

    });



    describe('getCurrentPageToken', function(){

      it('should find the page token from top window\'s hash', function(){

        mockedWindow.parent.location.hash = '?_p=ng-caselistingadmin&_pf=2';
        expect(manageTopUrl.getCurrentPageToken()).toBe('ng-caselistingadmin');

        mockedWindow.parent.location.hash = '?_pf=372&_p=caselistingadmin';
        expect(manageTopUrl.getCurrentPageToken()).toBe('caselistingadmin');

        mockedWindow.parent.location.hash = '?_p=ng-caselisting&_pf=452&_pf=6';
        expect(manageTopUrl.getCurrentPageToken()).toBe('ng-caselisting');

        mockedWindow.parent.location.hash = '_pf=122';
        expect(manageTopUrl.getCurrentPageToken()).toBe('');
      });

    });

    describe('goTo', function(){

      it('should throw an error if no destination argument is set', function() {
        expect(function() {
          manageTopUrl.goTo();
        }).toThrow(new TypeError('You must pass an Object as argument'));
      });

      it('should throw an error if no destination token is set', function() {
        expect(function() {
          manageTopUrl.goTo({});
        }).toThrow(new Error('You must set a token to define the destination page'));
      });

      it('should use destination as token if it is a string', function() {
        mockedWindow.parent.location.hash = '?_p=sdfsdf&_pf=2';
        manageTopUrl.goTo('caselistingadmin');
        expect(mockedWindow.parent.location.hash).toEqual('?_p=caselistingadmin&_pf=2');
      });

      it('should change top window\'s hash', function(){

        mockedWindow.parent.location.hash = '?_p=ng-caselistingadmin&_pf=2';
        manageTopUrl.goTo({'token' : 'caselistingadmin'});
        expect(mockedWindow.parent.location.hash).toBe('?_p=caselistingadmin&_pf=2&');

        mockedWindow.parent.location.hash = '?_pf=456';
        manageTopUrl.goTo({'token' : 'caselistingpm'});
        expect(mockedWindow.parent.location.hash).toBe('?_p=caselistingpm&_pf=456&');

        mockedWindow.parent.location.hash = '?_p=ng-caselistingadmin&_pf=2';
        manageTopUrl.goTo({'token' : 'caselistingadmin'});
        expect(mockedWindow.parent.location.hash).toBe('?_p=caselistingadmin&_pf=2&');

        mockedWindow.parent.location.hash = '?_p=ng-caselistingadmin&_pf=2';
        manageTopUrl.goTo({'token' : 'caselistingadmin', 'toto':undefined});
        expect(mockedWindow.parent.location.hash).toBe('?_p=caselistingadmin&_pf=2&');

        mockedWindow.parent.location.hash = '?_p=ng-caselistingadmin&_pf=2';
        manageTopUrl.goTo({'token' : 'caselistingadmin', '_toto': 'tata'});
        expect(mockedWindow.parent.location.hash).toBe('?_p=caselistingadmin&_pf=2&caselistingadmin_toto=tata&');
      });

      it('should not update the window.location if we are not inside an iframe', function() {

        mockedWindow.parent.location.hash = '?_p=ng-caselistingadmin&_pf=2';
        manageTopUrl.goTo({'token' : 'caselistingadmin', '_toto': 'tata'});
        expect(mockedWindow.parent.location.hash).toBe('?_p=caselistingadmin&_pf=2&caselistingadmin_toto=tata&');
        expect(mockedWindow.location.hash).toBe('#/home');

      });
      it('should change top window\'s hash without prepending token', function(){

        mockedWindow.parent.location.hash = '?_p=ng-caselistingadmin&_pf=2';
        manageTopUrl.goTo({'token' : 'caselistingadmin',prependToken : false});
        expect(mockedWindow.parent.location.hash).toBe('?_p=caselistingadmin&_pf=2&');

        mockedWindow.parent.location.hash = '?_pf=456';
        manageTopUrl.goTo({'token' : 'caselistingpm', prependToken : false});
        expect(mockedWindow.parent.location.hash).toBe('?_p=caselistingpm&_pf=456&');

        mockedWindow.parent.location.hash = '?_p=ng-caselistingadmin&_pf=2';
        manageTopUrl.goTo({'token' : 'caselistingadmin', prependToken : false});
        expect(mockedWindow.parent.location.hash).toBe('?_p=caselistingadmin&_pf=2&');

        mockedWindow.parent.location.hash = '?_p=ng-caselistingadmin&_pf=2';
        manageTopUrl.goTo({'token' : 'caselistingadmin', 'toto':undefined, prependToken : false});
        expect(mockedWindow.parent.location.hash).toBe('?_p=caselistingadmin&_pf=2&');

        mockedWindow.parent.location.hash = '?_p=ng-caselistingadmin&_pf=2';
        manageTopUrl.goTo({'token' : 'caselistingadmin', 'toto': 'tata', prependToken : false});
        expect(mockedWindow.parent.location.hash).toBe('?_p=caselistingadmin&_pf=2&toto=tata&');
        //
      });

    });


  });
})();
