iimbpm-js-components [![Build Status](https://travis-ci.org/iimsoft/iimbpm-js-components.svg?branch=ag_dragdrop)](https://travis-ci.org/iimsoft/iimbpm-js-components)
====================

iimbpm angular components library.

## requirements


You need to have __nodejs__, __npm__ and __gulp__
This library also needs angular 1.4.5 to run properly.

 - [x] bo-sortable (bo-sortable sort-options="sortOptions" on-sort="onSort( options)")
 - [x] bo-storable (bo-storable="storageId" on-storage-loaded="loadContent()")
 - [x] bo-sorter (default id=key, or bo-sorter='key')
 - [x] selectAll (bo-selectable, bo-selectAll, bo-selector)
 - [x] bo-repeatable
 - [x] table-settings 
 - [x] drag and drop
 - [x] draggable-columns (need to add ng-sortable dependency to make it work as it is not imported by default)

## Available command

- ``$ npm start``: launch the developpement environnement with a local server+livreload. Also, unit tests ran in background
- ``$ npm run dist`` : create a dist folder with minified/concatenated files. Please not that this command is only available in the _release_ branch.
- ``$ npm test`` will run the unit test suite on PhantomJS
- ``$ npm run documentation`` will generate the a ngdoc documentation site inside a ``./docs/ directory``
 
## Todo

 - [ ] iimbpm.resizable (see http://bz.var.ru/comp/web/resizable.html )

## Publishing a new version

**The master branch do not contains any dist files.**

There is a dedicated branch which holds dist files to be distributed using [bower](http://bower.io). Once you're ready to ship a new version

0. If not already did, bump version number in both ``bower.json`` and ``package.json`` and commit changes.

1. Go to the ```release`` branch, marge master on it, and launch the dist build.
```console
$ git checkout release
$ git merge master
$ npm run dist
```

2. Commit the new dist files in ``release`` and tag the branch accordingly to your bower.json version number
```console
$ git commit -m"Release x.x.x"
$ git tag -a x.x.x
$ git push --follow-tags
```

3. Celebrate!

> The code coverage is build when you run a test, you can access to it by opening the `./coverage/Phantom*/index.html` in a browser.

## Documentation
To ease the documentation process
```console
$ npm run documentation
```
will run a local server (with livereload) and generate the docs sites each time you update the js files.

## Code coverage
The karma test suite provides code coverage through karma-istanbul. The generated coverage site is at the root of the project, in the ``/coverage/`` folder.
