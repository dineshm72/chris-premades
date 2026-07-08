import {actorUtils, documentUtils} from '../../../../proxy.mjs';
async function combatStart({document}) {
    if (!document.system.uses.value) return;
    const rage = actorUtils.getItemByIdentifier(document.actor, 'rage');
    if (!rage?.system.uses.spent) return;
    await documentUtils.update(rage, {'system.uses.spent': 0});
    await documentUtils.update(document, {'system.uses.spent': document.system.uses.spent + 1});
}
function modifyRage({data}) {
    const effect = data.effect;
    if (!effect) return;
    const specialDuration = (effect.flags.cat?.specialDuration?.length ? effect.flags.cat.specialDuration : ['incapacitated', 'heavy'])
        .map(d => d === 'incapacitated' ? 'unconscious' : d);
    effect.updateSource({
        'duration.value': 600,
        'duration.units': 'seconds',
        'flags.cat.specialDuration': specialDuration
    });
}
export const persistentRage = {
    name: 'Persistent Rage',
    version: '2.0.0',
    rules: '2024',
    combat: [
        {
            pass: 'actorCombatStart',
            macro: combatStart,
            priority: 50
        }
    ],
    called: [
        {
            pass: 'actorPreCreateRageEffect',
            macro: modifyRage,
            priority: 50
        }
    ]
};
