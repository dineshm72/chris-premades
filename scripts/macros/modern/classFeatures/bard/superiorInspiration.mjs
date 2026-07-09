import {actorUtils, documentUtils, workflowUtils} from '../../../../proxy.mjs';
async function combatStart({document}) {
    const feature = actorUtils.getItemByIdentifier(document.actor, 'bardic-inspiration');
    if (!feature) return;
    if (feature.system.uses.value >= 2) return;
    await documentUtils.update(feature, {'system.uses.spent': Math.max(0, feature.system.uses.max - 2)});
    await workflowUtils.completeItemUse(document, [], {consumeUsage: false, consumeResources: false});
}
export const superiorInspiration = {
    name: 'Superior Inspiration',
    version: '2.0.0',
    rules: '2024',
    combat: [
        {
            pass: 'actorCombatStart',
            macro: combatStart,
            priority: 250
        }
    ]
};
