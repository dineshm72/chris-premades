import { actorUtils, combatUtils, documentUtils, effectUtils, genericUtils, workflowUtils } from '../../../../proxy.mjs';
async function move({document, token}) {
    if (!token.inCombat) return;
    if (!combatUtils.isOwnTurn(token) || !document.system.uses.value) return;
    await workflowUtils.completeItemUse(document, [], {options: {workflowOptions: {steadyAimLockout: true}}});
}
async function use({document, workflow}) {
    if (workflow.workflowOptions?.steadyAimLockout) return;
    if (actorUtils.getItemByIdentifier(workflow.actor, 'infiltration-expertise')) return;
    const sourceEffect = documentUtils.getEffectByIdentifier(document, 'steady-aim-movement');
    if (!sourceEffect) return;
    const effectData = genericUtils.duplicate(sourceEffect.toObject());
    await effectUtils.createEffects(workflow.actor, [effectData]);
}
export const steadyAim = {
    name: 'Steady Aim',
    version: '2.0.0',
    rules: '2024',
    roll: [
        {
            pass: 'itemRollFinished',
            macro: use,
            priority: 50
        }
    ],
    move: [
        {
            pass: 'actorMoved',
            macro: move,
            priority: 50
        }
    ]
};
