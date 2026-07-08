import {actorUtils, documentUtils} from '../../../../proxy.mjs';
async function combatStart({document}) {
    const monksFocus = actorUtils.getItemByIdentifier(document.actor, 'monks-focus');
    if (!monksFocus) return;
    if (monksFocus.system.uses.value > 3) return;
    await documentUtils.update(monksFocus, {'system.uses.spent': Math.max(0, monksFocus.system.uses.max - 4)});
}
export const perfectFocus = {
    name: 'Perfect Focus',
    version: '2.0.0',
    rules: '2024',
    combat: [
        {
            pass: 'actorCombatStart',
            macro: combatStart,
            priority: 50
        }
    ]
};
