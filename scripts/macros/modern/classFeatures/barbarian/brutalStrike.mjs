import {actorUtils, automationUtils, combatUtils, dialogUtils, queryUtils, rollUtils, tokenUtils, workflowUtils} from '../../../../proxy.mjs';
async function preAttack({document: item, identifier, workflow}) {
    if (!item.system.uses.value) return;
    if (workflow.activity.ability !== 'str') return;
    if (workflow.disadvantage || !workflow.advantage) return;
    if (!combatUtils.isOwnTurn(workflow.token) || !workflowUtils.isAttackType(workflow, 'attack')) return;
    const effect = actorUtils.getEffectByIdentifier(workflow.actor, 'recklessAttackEffect');
    if (!effect || !effect.active) return;
    const activities = item.system.activities.contents;
    const data = Object.create(Object.prototype, {
        activities: {get: () => activities, enumerable: true},
        workflow: {value: workflow, enumerable: true}
    });
    await automationUtils.calledEvent('brutalStrike', workflow.actor, {canOverlap: true, multiResult: true, data});
    const choices = activities.filter(a => a instanceof dnd5e.dataModels.activity.BaseActivityData);
    if (!choices?.length) return;
    const config = automationUtils.getConfigValues(item, ['count', 'damage']);
    config.count = (await rollUtils.rollDice(config.count, {document: item})).total;
    const options = {addNoneDocument: true, checkbox: true, max: config.count};
    const choice = await dialogUtils.selectDocumentDialog(item.name, _loc('CHRISPREMADES.Macros.Modern.BrutalStrike.Use', {item: item.name}), choices, options);
    const chosen = [];
    if (!choice) return;
    if (config.count > 1) {
        for (const result of choice)
            if (result.amount) chosen.push(result.document);
    }
    else chosen.push(choice);
    if (!chosen.length) return;
    workflowUtils.setWorkflowProperty(workflow, 'brutalStrikesActivities', chosen);
    workflowUtils.setWorkflowProperty(workflow, 'brutalStrikesDamage', config.damage);
    workflow.tracker.advantage.suppress(identifier, item.name);
}
async function damage({workflow}) {
    const formula = workflowUtils.getWorkflowProperty(workflow, 'brutalStrikesDamage');
    if (!formula) return;
    await workflowUtils.bonusDamage(workflow, formula);
}
async function doStrike({workflow}) {
    if (!workflow.hitTargets.size) return;
    const activities = workflowUtils.getWorkflowProperty(workflow, 'brutalStrikesActivities');
    if (!activities) return;
    for (let i = 0; i < activities.length; i++) {
        const userId = queryUtils.firstOwner(activities[i].actor, true);
        await workflowUtils.syntheticActivityRoll(activities[i], workflow.hitTargets, {consumeResources: i === 0, userId});
    }
}
async function forcefulBlowPush({document: activity, workflow}) {
    const distanceFormula = automationUtils.getConfigValue(activity.item, 'push');
    const distance = (await rollUtils.rollDice(distanceFormula, {document: activity})).total;
    for (const token of workflow.hitTargets)
        await tokenUtils.slideToken(token.document, {sourceToken: workflow.token, distance});
}
export const brutalStrike = {
    name: 'Brutal Strike',
    version: '2.0.2',
    rules: '2024',
    notes: 'Use the "actorBrutalStrike" called event (async) to modify the array of activities used as choices.\n\tData available: activities, workflow.',
    roll: [
        {
            pass: 'actorAttackRollConfig',
            macro: preAttack,
            priority: 200
        },
        {
            pass: 'actorDamageRollBonuses',
            macro: damage,
            priority: 200
        },
        {
            pass: 'actorRollFinished',
            macro: doStrike,
            priority: 200
        }
    ],
    config: {
        classIdentifier: {
            default: 'barbarian',
            type: 'text',
            label: 'CHRISPREMADES.Config.ClassIdentifier',
            category: 'behavior'
        },
        count: {
            default: '@scale.barbarian.brutal-strike-count',
            type: 'text',
            label: 'CHRISPREMADES.Macros.Modern.BrutalStrike.Choice',
            category: 'behavior'
        },
        damage: {
            default: '@scale.barbarian.brutal-strike',
            type: 'text',
            label: 'CHRISPREMADES.Config.DamageBonus',
            category: 'behavior'
        },
        push: {
            default: '15',
            type: 'text',
            label: 'CHRISPREMADES.Config.Distance',
            category: 'behavior'
        }
    },
    scales: [
        {
            identifier: 'brutal-strike',
            classIdentifier: 'barbarian',
            data: {
                type: 'ScaleValue',
                configuration: {
                    distance: {
                        units: ''
                    },
                    identifier: 'brutal-strike',
                    type: 'dice',
                    scale: {
                        9: {number: 1, faces: 10},
                        17: {number: 2, faces: 10}
                    }
                },
                value: {},
                title: 'Brutal Strike'
            }
        },
        {
            identifier: 'brutal-strike-count',
            classIdentifier: 'barbarian',
            data: {
                type: 'ScaleValue',
                configuration: {
                    distance: {
                        units: ''
                    },
                    identifier: 'brutal-strike-count',
                    type: 'number',
                    scale: {
                        9: {value: 1},
                        17: {value: 2}
                    }
                },
                value: {},
                title: 'Brutal Strike Choice Count'
            }
        }
    ]
};
export const forcefulBlow = {
    name: 'Forceful Blow',
    version: brutalStrike.version,
    rules: brutalStrike.rules,
    roll: [
        {
            pass: 'activityRollFinished',
            macro: forcefulBlowPush,
            priority: 50
        }
    ]
};
