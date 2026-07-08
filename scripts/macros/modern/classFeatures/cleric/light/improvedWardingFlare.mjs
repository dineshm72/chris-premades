import {actorUtils, documentUtils} from '../../../../../proxy.mjs';
async function added({document}) {
    const wardingFlare = actorUtils.getItemByIdentifier(document.actor, 'warding-flare');
    if (!wardingFlare) return;
    const updates = {};
    if (!wardingFlare.system.uses.recovery.find(i => i.period === 'sr')) {
        const recovery = wardingFlare.toObject().system.uses.recovery;
        recovery.push({formula: undefined, period: 'sr', type: 'recoverAll'});
        updates['system.uses.recovery'] = recovery;
    }
    const rollMacros = wardingFlare.flags.cat?.macros?.roll ?? [];
    if (!rollMacros.some(i => i.source === 'chris-premades' && i.identifier === 'warding-flare')) {
        updates['flags.cat.macros.roll'] = [...rollMacros, {source: 'chris-premades', rules: '2024', identifier: 'warding-flare'}];
    }
    if (Object.keys(updates).length) await documentUtils.update(wardingFlare, updates);
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
