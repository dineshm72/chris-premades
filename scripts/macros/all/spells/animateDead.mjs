import {actorUtils, automationUtils, compendiumUtils, dialogUtils, genericUtils, itemUtils, summonUtils, workflowUtils} from '../../../proxy.mjs';
async function getMonsterActor(name) {
    if (!name) return;
    for (const packId of automationUtils.getSourceDataSources('Monster')) {
        const actor = await compendiumUtils.getDocumentByName(packId, name);
        if (actor) return actor;
    }
    return game.actors.getName(name);
}
async function toggleCommand(item, visible) {
    if (visible) await itemUtils.unhideActivities(item, ['animateDeadCommand']);
    else await itemUtils.rehideActivities(item, ['animateDeadCommand']);
}
async function use({document: item, workflow}) {
    if (workflow.activity.identifier !== 'animateDead') return;
    const zombieActor = await getMonsterActor(automationUtils.getConfigValue(item, 'zombieActorName') || 'Zombie');
    const skeletonActor = await getMonsterActor(automationUtils.getConfigValue(item, 'skeletonActorName') || 'Skeleton');
    if (!zombieActor || !skeletonActor) {
        genericUtils.notify('CHRISPREMADES.Error.ActorNotFound', {type: 'warn'});
        return;
    }
    let totalSummons = 1 + ((workflowUtils.getCastLevel(workflow) ?? 3) - 3) * 2;
    if (actorUtils.getItemByIdentifier(workflow.actor, 'undead-thralls')) totalSummons += 1;
    if (totalSummons < 1) return;
    const selection = await dialogUtils.selectDocumentDialog(item.name, _loc('CHRISPREMADES.Summons.SelectSummons', {totalSummons}), [zombieActor, skeletonActor], {max: totalSummons, combobox: true});
    if (!selection) return;
    const chosen = (Array.isArray(selection) ? selection : [{document: selection, amount: 1}]).flatMap(({document, amount}) => Array(amount).fill(document));
    if (!chosen.length) return;
    const animation = automationUtils.getConfigValue(item, 'animation');
    const disposition = workflow.token?.document.disposition;
    const summons = [];
    for (const sourceActor of chosen) {
        const summon = await summonUtils.createSummon(workflow.actor, sourceActor, {duration: 86400, animation, disposition, sourceDocument: item});
        if (summon) summons.push(summon);
    }
    if (!summons.length) return;
    await toggleCommand(item, true);
    if (workflow.token) await summonUtils.placeSummons(summons, workflow.activity.range.value || 10, {token: workflow.token.document});
}
async function early({activity, dialog}) {
    if (activity?.identifier !== 'animateDeadCommand') return;
    dialog.configure = false;
}
async function deleted({document: item, summon}) {
    if (summonUtils.getSummonBySource(item).some(s => s !== summon)) return;
    if (item.actor) await toggleCommand(item, false);
}
export const animateDead = {
    name: 'Animate Dead',
    version: '2.0.0',
    rules: 'all',
    roll: [
        {pass: 'itemRollFinished', macro: use, priority: 50},
        {pass: 'itemPreTargeting', macro: early, priority: 50}
    ],
    summon: [
        {pass: 'delete', macro: deleted, priority: 50}
    ],
    config: {
        animation: {default: {source: 'chris-premades', identifier: 'shadowSummon'}, type: 'selectAnimation', inputs: ['summon', 'location', 'token'], label: 'CHRISPREMADES.Config.Animation', category: 'animations'},
        skeletonActorName: {default: 'Skeleton', type: 'text', label: 'CHRISPREMADES.Summons.CreatureNames.Skeleton', category: 'summons'},
        zombieActorName: {default: 'Zombie', type: 'text', label: 'CHRISPREMADES.Summons.CreatureNames.Zombie', category: 'summons'}
    }
};
