import {automationUtils, constants, workflowUtils} from '../../../../proxy.mjs';
async function damage({document, workflow}) {
    if (workflow.item?.type !== 'spell') return;
    if (workflowUtils.getCastLevel(workflow) !== 0) return;
    const classIdentifier = automationUtils.getConfigValue(document, 'classIdentifier');
    if (workflow.item.system.sourceClass !== classIdentifier) return;
    const ability = automationUtils.getConfigValue(document, 'ability');
    const modifier = workflow.actor.system.abilities[ability].mod;
    await workflowUtils.bonusDamage(workflow, modifier, {damageType: workflow.defaultDamageType});
    await workflowUtils.completeItemUse(document, [], {consumeUsage: false, consumeResources: false});
}
export const potentSpellcasting = {
    name: 'Blessed Strikes: Potent Spellcasting',
    version: '2.0.0',
    rules: '2024',
    roll: [
        {
            pass: 'actorDamageRollComplete',
            macro: damage,
            priority: 250
        }
    ],
    config: {
        classIdentifier: {
            default: 'cleric',
            type: 'text',
            label: 'CHRISPREMADES.Config.ClassIdentifier',
            category: 'homebrew'
        },
        ability: {
            default: 'wis',
            type: 'select',
            get options() {
                return constants.abilityOptions();
            },
            label: 'CHRISPREMADES.Config.Ability',
            category: 'homebrew'
        }
    }
};
