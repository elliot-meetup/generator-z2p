'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs');

function assertFileEquals(fileUnderTest, testFile) {
	var file1content = fs.readFileSync( process.cwd() + '/' + fileUnderTest );
	var file2content = fs.readFileSync( __dirname + '/' + testFile );
	return assert.equal( file1content.toString(), file2content.toString() );
};

describe('generator-z2p:app', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({projectName: 'testproject', namespaceName: 'testnamespace'})
      .toPromise();
  });

  it('creates files', function () {
    assert.file([
      'infra/testnamespace-ns.yaml',
      'infra/testproject-dply.yaml',
      'infra/testproject-svc.yaml',
      'Makefile',
      'Dockerfile',
      'README.md',
      'LICENSE.md',
      'CONTRIBUTING.md'
    ]);
  });

	[
		{ dest: '.travis.yml', src: 'travis.yml'},
		{ dest: '.dockerignore', src: 'dockerignore'}
	].forEach(item => {
		it(`copies ${item.src} to project`, function(){
			assertFileEquals(item.dest, `../generators/app/templates/${item.src}`);
		})
	})
});
