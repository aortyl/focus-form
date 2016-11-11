import angular from 'angular';

import {techsModule} from './app/techs/index';

import {main} from './app/main';
import {header} from './app/header';
import {title} from './app/title';
import {footer} from './app/footer';

import {focusForm, focusFormSection} from './app/focus-form.directive';

import './index.scss';
import './app/focus-form.directive.scss';

angular
  .module('app', [techsModule])
  .component('app', main)
  .component('fountainHeader', header)
  .component('fountainTitle', title)
  .component('fountainFooter', footer)
    .directive('focusForm', focusForm)
    .directive('focusFormSection', focusFormSection);
