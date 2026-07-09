import {actorUtils, documentUtils} from '../../../../../proxy.mjs';
async function added({document}) {
    const wardingFlare = actorUtils.getItemByIdentifier(document.actor, 'warding-flare');
    if (!wardingFlare) return;
    if (wardingFlare.system.uses.recovery.find(i => i.period === 'sr')) return;
    const recovery = wardingFlare.toObject().system.uses.recovery;
    recovery.push({formula: undefined, period: 'sr', type: 'recoverAll'});
    await documentUtils.update(wardingFlare, {'system.uses.recovery': recovery});
}
export const improvedWardingFlare = {
    name: 'Improved Warding Flare',
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
