import angular from 'angular';

import {focusForm} from './focus-form.directive';
import {focusFormSection} from './focus-form.directive';

import './focus-form.directive.scss';

export const focusFormModule = 'focusForm';
console.log('test');
angular
    .module(focusFormModule, [])
    .directive(focusForm)
    .directive(focusFormSection);