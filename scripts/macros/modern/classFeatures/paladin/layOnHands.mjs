import {actorUtils, documentUtils} from '../../../../proxy.mjs';
async function poison({workflow}) {
    if (workflow.activity?.identifier !== 'poison') return;
    if (!workflow.targets.size) return;
    const poisoned = actorUtils.getEffectByStatusID(workflow.targets.first().actor, 'poisoned');
    if (poisoned) await documentUtils.deleteDocument(poisoned);
}
export const layOnHands = {
    name: 'Lay On Hands',
    version: '2.0.0',
    rules: '2024',
    roll: [
        {
            pass: 'itemRollFinished',
            macro: poison,
            priority: 50
        }
    ]
};
