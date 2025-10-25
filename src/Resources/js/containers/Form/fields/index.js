// @flow
import {fieldRegistry} from 'sulu-admin-bundle/containers';
import NumberWithDefault from './NumberWithDefault';
import ColorSelect from './ColorSelect';
import SliderRange from './SliderRange';

fieldRegistry.add('number_with_default', NumberWithDefault);
fieldRegistry.add('color_select', ColorSelect);
fieldRegistry.add('slider_range', SliderRange);
