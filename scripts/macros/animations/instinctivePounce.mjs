import {animationUtils} from '../../proxy.mjs';
function pounce(position, sourceToken) {
    /* eslint-disable indent */
    new Sequence()
        .animation()
            .on(sourceToken)
            .opacity(0)
            .waitUntilFinished(-100)
        .effect()
            .file('animated-spell-effects-cartoon.air.portal')
            .atLocation(sourceToken)
            .scaleToObject(1.75)
            .belowTokens()
        .effect()
            .copySprite(sourceToken)
            .atLocation(sourceToken)   
            .opacity(1)
            .duration(1000)
            .anchor({ x: 0.5, y: 1 })
            .loopProperty('sprite', 'position.y', {values: [50, 0, 50], duration: 500})
            .moveTowards(position, {rotate: false})
            .zIndex(2)
        .effect()
            .copySprite(sourceToken)
            .atLocation(sourceToken)   
            .opacity(0.5)
            .scale(0.9)
            .belowTokens()
            .duration(1000)
            .anchor({x: 0.5, y: 0.5})
            .filter('ColorMatrix', {brightness: -1})
            .filter('Blur', {blurX: 5, blurY: 10})
            .moveTowards(position, {rotate: false})
            .zIndex(2)
            .waitUntilFinished(-100)
        .animation()
            .on(sourceToken)
            .teleportTo(position)
            .snapToGrid()
            .opacity(1)
        .effect()
            .file('animated-spell-effects-cartoon.air.portal')
            .atLocation(position)
            .scaleToObject(1.75 * sourceToken.document.width)
            .belowTokens()
        .play();
    /* eslint-enable indent */
}
export const instinctivePounce = {
    name: 'CHRISPREMADES.Animations.Pounce',
    macros: {
        play: pounce
    },
    inputs: ['position', 'sourceToken'],
    requirements: ['animated-spell-effects-cartoon'],
    category: 'classFeature',
    get credits() {
        return [animationUtils.getEskieCredits()];
    }
};
