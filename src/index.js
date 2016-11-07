import angular from 'angular';

import {techsModule} from './app/techs/index';
import {focusFormModule} from './app/focus-form/focus-form.module'

import {main} from './app/main';
import {header} from './app/header';
import {title} from './app/title';
import {footer} from './app/footer';

import './index.scss';
console.log('Test Index');
angular
  .module('app', [techsModule, focusFormModule])
  .component('app', main)
  .component('fountainHeader', header)
  .component('fountainTitle', title)
  .component('fountainFooter', footer);
