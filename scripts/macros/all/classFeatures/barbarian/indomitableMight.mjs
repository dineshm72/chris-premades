import {automationUtils, constants, workflowUtils} from '../../../../proxy.mjs';
const {OperatorTerm, NumericTerm} = foundry.dice.terms;
async function ability({actor, config, document: item, roll}) {
    const ability = automationUtils.getConfigValue(item, 'ability');
    const rolled = roll.data.abilityId ?? config.ability;
    if (rolled !== ability) return;
    const min = actor.system.abilities[ability].value;
    if (roll.total >= min) return;
    let number = min;
    for (const term of roll.terms) {
        if (term.isDeterministic) {
            if (Number.isNumeric(term.total)) number -= term.total;
            continue;
        }
        for (const result of term.results) {
            result.active = false;
            result.rerolled = true;
        }
    }
    roll.terms.push(
        new OperatorTerm({operator: '+'}),
        new NumericTerm({number}).evaluate()
    );
    roll._total = min;
    roll.resetFormula();
    await workflowUtils.completeItemUse(item);
}
export const indomitableMight = {
    name: 'Indomitable Might',
    verison: '2.0.2',
    rules: 'all',
    check: [
        {
            pass: 'actorBonus',
            macro: ability,
            priority: 200
        }
    ],
    skill: [
        {
            pass: 'actorBonus',
            macro: ability,
            priority: 200
        }
    ],
    config: {
        ability: {
            default: 'str',
            type: 'select',
            category: 'behavior',
            label: 'CHRISPREMADES.Config.Ability',
            get options() { return constants.abilityOptions(); }
        }
    }
};
