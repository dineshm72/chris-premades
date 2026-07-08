import {actorUtils, workflowUtils} from '../../../../../proxy.mjs';
async function use({workflow}) {
    const improvedWardingFlare = actorUtils.getItemByIdentifier(workflow.actor, 'improved-warding-flare');
    if (!improvedWardingFlare) return;
    await workflowUtils.syntheticItemRoll(improvedWardingFlare, Array.from(workflow.targets), {consumeUsage: true, consumeResources: true});
}
export const wardingFlare = {
    name: 'Warding Flare',
    version: '2.0.0',
    rules: '2024',
    roll: [
        {
            pass: 'itemRollFinished',
            macro: use,
            priority: 50
        }
    ]
};
