import { Dimensions } from 'react-native';

export const API_BASE = 'http://10.51.2.187:3000';

export const ITEMS_PER_PAGE = 12;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;
