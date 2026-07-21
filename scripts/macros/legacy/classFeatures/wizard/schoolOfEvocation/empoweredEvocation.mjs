import {automationUtils, constants, workflowUtils} from '../../../../../proxy.mjs';
async function damage({document, workflow}) {
    if (workflow.item?.type !== 'spell') return;
    if (workflow.item.system.school !== 'evo') return;
    const ability = automationUtils.getConfigValue(document, 'spellcastingAbility');
    await workflowUtils.bonusDamage(workflow, '@abilities.' + ability + '.mod');
}
export const empoweredEvocation = {
    name: 'Empowered Evocation',
    version: '2.0.0',
    rules: '2014',
    roll: [
        {
            pass: 'actorDamageRollComplete',
            macro: damage,
            priority: 50
        }
    ],
    config: {
        spellcastingAbility: {
            default: 'int',
            type: 'select',
            get options() {
                return constants.abilityOptions();
            },
            label: 'CHRISPREMADES.Config.Ability',
            category: 'homebrew'
        }
    }
};
