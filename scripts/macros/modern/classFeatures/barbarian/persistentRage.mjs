import {actorUtils, dataUtils, dialogUtils, queryUtils, workflowUtils} from '../../../../proxy.mjs';
async function combatStart({document: activity}) {
    if (!activity.item.system.uses.value) return;
    const rage = actorUtils.getItemByIdentifier(activity.actor, 'rage');
    if (!rage?.system.uses.spent) return;
    if (!await dialogUtils.confirmRecoverUses(activity.item, rage, {userId: queryUtils.firstOwner(activity.actor, true)})) return;
    await workflowUtils.completeActivityUse(activity);
}
// duplicate of 2014 modifyRage - move both to all once getFnMacro is fixed
async function modifyRage({data}) {
    const effectData = data.effectData;
    if (!effectData) return;
    const specialDuration = effectData.flags.cat?.specialDuration?.map(d => d === 'incapacitated' ? 'unconscious' : d);
    const removeMacros = [{
        type: 'combat',
        macros: [{identifier: 'keepRage'}]
    }];
    return dataUtils.buildEffectData(effectData, {removeMacros, specialDuration});
}
export const persistentRage = {
    name: 'Persistent Rage',
    version: '2.0.2',
    rules: '2024',
    called: [
        {
            pass: 'actorPreCreateRageEffect',
            macro: modifyRage,
            priority: 200
        }
    ],
    combat: [
        {
            pass: 'actorCombatStart',
            macro: combatStart,
            priority: 50
        }
    ]
};
