import angular from 'angular';

import {main} from './app/main';
import {header} from './app/header';
import {title} from './app/title';
import {footer} from './app/footer';

import {focusForm, focusFormSection} from './app/focus-form.directive';

import './index.scss';
import './app/focus-form.directive.scss';

angular
  .module('app', [])
  .component('app', main)
  .component('demoHeader', header)
  .component('demoTitle', title)
  .component('demoFooter', footer)
    .directive('focusForm', focusForm)
    .directive('focusFormSection', focusFormSection);
