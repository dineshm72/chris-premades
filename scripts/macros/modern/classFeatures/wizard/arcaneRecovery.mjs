import {actorUtils, automationUtils, dialogUtils, rollUtils} from '../../../../proxy.mjs';
async function use({workflow}) {
    const formula = automationUtils.getConfigValue(workflow.item, 'formula');
    const bonusIdentifiers = ['arcaneGrimoire1', 'arcaneGrimoire2', 'arcaneGrimoire3', 'grimoireInfinitus1', 'grimoireInfinitus2', 'grimoireInfinitus3'];
    let bonus = 0;
    for (const identifier of bonusIdentifiers) {
        const item = actorUtils.getItemByIdentifier(workflow.actor, identifier);
        if (item) bonus += automationUtils.getConfigValue(item, 'bonus') ?? 0;
    }
    const spells = workflow.actor.system.spells;
    const totalSlots = (await rollUtils.rollDice(formula + ' + ' + bonus, {document: workflow.activity})).total;
    const availableLevels = [];
    const fields = [];
    const maxSlotLevel = automationUtils.getConfigValue(workflow.item, 'maxSlotLevel') ?? 5;
    for (let i = 1; i <= maxSlotLevel; i++) {
        const spellData = spells['spell' + i];
        if (spellData?.max > 0 && spellData.value < spellData.max) {
            availableLevels.push(i);
            fields.push({
                label: _loc('CHRISPREMADES.Macros.Modern.ArcaneRecovery.Slot', {slot: i}),
                name: 'spell' + i,
                options: {minAmount: 0, maxAmount: spellData.max - spellData.value, weight: i}
            });
        }
    }
    if (!fields.length) return;
    const selection = await dialogUtils.selectAmounts(workflow.item.name, _loc('CHRISPREMADES.Macros.Modern.ArcaneRecovery.Context', {totalSlots}), fields, {totalMax: totalSlots});
    if (!selection) return;
    for (const i of availableLevels) {
        const amount = selection['spell' + i] || 0;
        if (amount > 0) await actorUtils.recoverSpellSlots(workflow.actor, i, {amount});
    }
}
export const arcaneRecovery = {
    name: 'Arcane Recovery',
    version: '2.0.0',
    rules: '2024',
    roll: [
        {
            pass: 'itemRollFinished',
            macro: use,
            priority: 50
        }
    ],
    config: {
        formula: {
            default: 'ceil(@classes.wizard.levels / 2)',
            type: 'text',
            label: 'CHRISPREMADES.Config.Formula',
            category: 'homebrew'
        },
        maxSlotLevel: {
            default: 5,
            type: 'number',
            label: 'CHRISPREMADES.Config.MaxLevel',
            category: 'homebrew'
        }
    }
};
