import {activityUtils, documentUtils, effectUtils, genericUtils} from '../../../../../proxy.mjs';
async function use({document, workflow}) {
    const target = workflow.targets.first()?.actor ?? workflow.actor;
    const targetUuid = document.flags['chris-premades']?.blessingOfTheTrickster?.targetUuid;
    let effect;
    if (targetUuid) effect = await fromUuid(targetUuid);
    if (effect) await documentUtils.deleteDocument(effect);
    const sourceEffect = document.effects.contents?.[0];
    if (!sourceEffect) return;
    const effectData = genericUtils.duplicate(sourceEffect.toObject());
    effectData.duration = activityUtils.getEffectDuration(workflow.activity);
    const targetEffect = (await effectUtils.createEffects(target, [effectData]))[0];
    await documentUtils.setFlag(document, 'chris-premades', 'blessingOfTheTrickster.targetUuid', targetEffect.uuid);
}
export const blessingOfTheTrickster = {
    name: 'Blessing of the Trickster',
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
