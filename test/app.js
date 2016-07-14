'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs');
var yaml = require('yamljs');

function assertFileEquals(fileUnderTest, testFile) {
	var file1content = fs.readFileSync( process.cwd() + '/' + fileUnderTest );
	var file2content = fs.readFileSync( __dirname + '/' + testFile );
	return assert.equal( file1content.toString(), file2content.toString() );
};

describe('generator-z2p:app', function () {
	var projectName = 'testProject'
	var namespaceName = 'testnamespace'
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({projectName, namespaceName})
      .toPromise();
  });

  it('creates files', function () {
    assert.file([
      'infra/testproject-dply.yml',
      'infra/testproject-svc.yml',
      'Dockerfile',
      'README.md',
      'LICENSE.md',
      'CONTRIBUTING.md'
    ]);
  });

	[
		{ dest: '.travis.yml', src: 'travis.yml'},
		{ dest: '.dockerignore', src: 'dockerignore'},
	].forEach(item => {
		it(`copies ${item.src} to project`, function(){
			assertFileEquals(item.dest, `../generators/app/templates/${item.src}`);
		})
	});

	[
		'package',
		'publish',
		'deploy-stage',
		'deploy-prod',
	].forEach(item => {
		it(`Makefile contains ${item}`, function(){
			assert.fileContent('Makefile', new RegExp(`(^|\n)${item}\:`))
		})
	})

	context(`using namespaceName ${namespaceName} from the prompt`, () => {
		it(`creates namespace yml`, () => {
			var namespace = yaml.load(`infra/${namespaceName}-ns.yml`)
			assert.equal(namespace.metadata.name, namespaceName)
		})

		context(`using projectName ${projectName} from the prompt`, () => {
			it(`creates deploy yml`, () => {
				var namespace = yaml.load(`infra/${projectName}-dply.yml`)
				assert.equal(namespace.metadata.namespace, namespaceName)
				assert.equal(namespace.metadata.app, projectName)
				assert.equal(namespace.spec.template.metadata.labels.app, projectName)
			})

			it(`creates service yml`, () => {
				var namespace = yaml.load(`infra/${projectName}-svc.yml`)
				assert.equal(namespace.metadata.namespace, namespaceName)
				assert.equal(namespace.metadata.app, projectName)
				assert.equal(namespace.spec.selector.app, projectName)
			})
		})
	})

});
