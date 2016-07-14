'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    // this.log('Let\'s start with some questions.');

    var prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'What is the name of your project?',
      default: this.appname
    }, {
      type: 'input',
      name: 'namespaceName',
      message: 'What namespace do you want it to run in?',
      default: 'mynamespace'
    }];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    var destinations = [
      { src: 'travis.yml', dest: '.travis.yml'},
      `infra/${this.props.namespaceName}-ns.yaml`,
      `infra/${this.props.projectName}-dply.yaml`,
      `infra/${this.props.projectName}-svc.yaml`,
      'Makefile',
      'Dockerfile',
      { src: 'dockerignore', dest:'.dockerignore'},
      'README.md',
      'LICENSE.md',
      'CONTRIBUTING.md'];

    destinations.forEach(item => {
      if( typeof item === 'string'){
        this.fs.copy(
          this.templatePath('example-ns.yaml'),
          this.destinationPath(item)
        );
      } else {
        this.fs.copy(
          this.templatePath(item.src),
          this.destinationPath(item.dest)
        );
      }
    });
  },

  install: function () {
    // this.log('Horray your new project is created.');
  }
});
