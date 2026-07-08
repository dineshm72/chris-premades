import {workflowUtils} from '../../../../proxy.mjs';
async function damage({workflow}) {
    if (workflow.item.type !== 'spell') return;
    const spellLevel = workflowUtils.getCastLevel(workflow);
    if (spellLevel !== 0) return;
    await workflowUtils.bonusDamage(workflow, '@abilities.wis.mod', {damageType: workflow.defaultDamageType});
}
export const elementalFuryPotentSpellcasting = {
    name: 'Elemental Fury: Potent Spellcasting',
    version: '2.0.0',
    rules: '2024',
    roll: [
        {
            pass: 'actorDamageRollComplete',
            macro: damage,
            priority: 50
        }
    ]
};
