import {actorUtils, automationUtils, dialogUtils, queryUtils, workflowUtils} from '../../../../../proxy.mjs';
async function damageApplication({targetToken, ditem}) {
    if (!actorUtils.hasSpellSlots(targetToken.actor)) return;
    if (actorUtils.hasUsedReaction(targetToken.actor)) return;
    const originItem = actorUtils.getItemByIdentifier(targetToken.actor, 'song-of-defense');
    if (!originItem) return;
    const selection = await dialogUtils.selectSpellSlot(targetToken.actor, originItem.name, _loc('CHRISPREMADES.Macros.Legacy.SongOfDefense.Select'), {no: true, userId: queryUtils.firstOwner(targetToken.actor, true)});
    if (!selection) return;
    const slotKey = actorUtils.getSpellSlotKey(targetToken.actor, selection);
    if (!slotKey) return;
    const reductionPerLevel = automationUtils.getConfigValue(originItem, 'reductionPerLevel');
    let damageReduction = targetToken.actor.system.spells[slotKey].level * reductionPerLevel;
    await actorUtils.spendSpellSlots(targetToken.actor, selection);
    const totalDone = ditem.damageDetail.reduce((acc, i) => acc + i.value, 0);
    damageReduction = Math.min(totalDone, damageReduction);
    ditem.damageDetail.push({value: -damageReduction, type: 'none'});
    ditem.hpDamage = totalDone - damageReduction;
    await workflowUtils.completeItemUse(originItem);
}
export const songOfDefense = {
    name: 'Song of Defense',
    version: '2.0.0',
    rules: '2014',
    roll: [
        {
            pass: 'targetDamageFlatReductions',
            macro: damageApplication,
            priority: 50
        }
    ],
    config: {
        reductionPerLevel: {
            default: 5,
            type: 'number',
            label: 'CHRISPREMADES.Macros.Legacy.SongOfDefense.ReductionPerLevel',
            category: 'homebrew'
        }
    }
};
