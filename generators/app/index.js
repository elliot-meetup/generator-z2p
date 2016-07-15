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
    }, {
      type: 'input',
      name: 'stageCluster',
      message: 'What cluster will the project be staged in?',
      default: 'blt-stage'
    }, {
      type: 'input',
      name: 'stageZone',
      message: 'What namespace do you want it to run in?',
      default: 'asia-east1-c'
    }, {
      type: 'input',
      name: 'prodCluster',
      message: 'What cluster will the project be deployed in?',
      default: 'blt-prod'
    }, {
      type: 'input',
      name: 'prodZone',
      message: 'What namespace do you want it to run in?',
      default: 'us-east1-b'
    }];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
      this.props.imageName = `mup.cr/${props.namespaceName}/${props.projectName}`
    }.bind(this));
  },

  writing: function () {
    var destinations = [
      { src: 'travis.yml', dest: '.travis.yml'},
      { src: 'infra/ns.yml', dest: `infra/${this.props.namespaceName}-ns.yml`},
      { src: 'infra/dply.yml', dest: `infra/${this.props.projectName}-dply.yml`},
      { src: 'infra/svc.yml', dest: `infra/${this.props.projectName}-svc.yml`},
      'Makefile',
      'Dockerfile',
      { src: 'dockerignore', dest:'.dockerignore'},
      'README.md',
      'LICENSE.md',
      'CONTRIBUTING.md'];

    destinations.forEach(item => {
      if( typeof item === 'string'){
        this.fs.copyTpl(
          this.templatePath(item),
          this.destinationPath(item),
          this.props
        );
      } else {
        this.fs.copyTpl(
          this.templatePath(item.src),
          this.destinationPath(item.dest),
          this.props
        );
      }
    });
  },

  git: function () {
    this.composeWith('git-init', {
      options: { commit: 'Commit from z2p' }
    }, {
      local: require.resolve('generator-git-init')
    });
  },

  install: function () {
    // this.log('Horray your new project is created.');
  }
});
