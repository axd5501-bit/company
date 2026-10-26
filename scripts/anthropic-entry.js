// 브라우저용 Anthropic SDK 번들 진입점 (npm run build:vendor → app/vendor/anthropic-sdk.js)
import Anthropic from '@anthropic-ai/sdk';

window.Anthropic = Anthropic;
