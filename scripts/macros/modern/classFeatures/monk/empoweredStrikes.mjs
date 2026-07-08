import {activityUtils, automationUtils, dialogUtils, documentUtils} from '../../../../proxy.mjs';
async function attack({document, workflow}) {
    if (!workflow.item) return;
    const identifier = documentUtils.getIdentifier(workflow.item);
    if (identifier !== 'unarmed-strike') return;
    if (workflow.activity?.type !== 'attack') return;
    const autoApply = automationUtils.getConfigValue(document, 'autoApply');
    if (!autoApply) {
        const selection = await dialogUtils.confirmUseItem(document);
        if (!selection) return;
    }
    const activityData = activityUtils.getDamageModifiedActivityData(workflow.activity, '', {types: ['force']});
    workflow.item = workflow.item.clone({['system.activities.' + workflow.activity.id]: activityData}, {keepId: true});
    workflow.activity = workflow.item.system.activities.get(workflow.activity.id);
}
export const empoweredStrikes = {
    name: 'Empowered Strikes',
    version: '2.0.0',
    rules: '2024',
    roll: [
        {
            pass: 'actorPreambleComplete',
            macro: attack,
            priority: 40
        }
    ],
    config: {
        autoApply: {
            default: false,
            type: 'checkbox',
            label: 'CHRISPREMADES.Config.AutoApply',
            category: 'mechanics'
        }
    }
};
