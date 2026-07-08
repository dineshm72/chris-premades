import {actorUtils, documentUtils} from '../../../../proxy.mjs';
async function added({document}) {
    const bardicInspiration = actorUtils.getItemByIdentifier(document.actor, 'bardic-inspiration');
    if (!bardicInspiration) return;
    if (!bardicInspiration.system.uses.recovery.find(i => i.period === 'sr')) {
        const recovery = bardicInspiration.toObject().system.uses.recovery;
        recovery.push({formula: undefined, period: 'sr', type: 'recoverAll'});
        await documentUtils.update(bardicInspiration, {'system.uses.recovery': recovery});
    }
}
export const fontOfInspiration = {
    name: 'Font of Inspiration',
    version: '2.0.0',
    rules: '2024',
    item: [
        {
            pass: 'created',
            macro: added,
            priority: 50
        },
        {
            pass: 'medkit',
            macro: added,
            priority: 50
        },
        {
            pass: 'munched',
            macro: added,
            priority: 50
        }
    ]
};
