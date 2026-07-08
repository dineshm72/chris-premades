import {actorUtils, documentUtils} from '../../../../proxy.mjs';
async function change({document}) {
    const actor = document.actor;
    if (!actor) return;
    const effect = actorUtils.getEffectByIdentifier(actor, 'fast-movement-effect');
    if (!effect) return;
    const armor = actor.items.find(i => i.system.equipped && i.type === 'equipment' && i.system.type?.value === 'heavy');
    if (armor && !effect.disabled) await documentUtils.update(effect, {disabled: true});
    if (!armor && effect.disabled) await documentUtils.update(effect, {disabled: false});
}
export const fastMovement = {
    name: 'Fast Movement',
    version: '2.0.0',
    rules: '2024',
    item: [
        {
            pass: 'actorEquipped',
            macro: change,
            priority: 50
        },
        {
            pass: 'actorUnequipped',
            macro: change,
            priority: 50
        }
    ]
};
