import {genericUtils} from '../../../../../proxy.mjs';
async function buff({summon, updates}) {
    const school = summon.sourceDocument?.system?.school ?? summon.sourceDocument?.flags.cat?.castData?.school;
    if (school !== 'nec') return;
    const owner = summon.owner;
    const wizardLevels = owner?.classes?.wizard?.system?.levels;
    if (!wizardLevels) return;
    const sourceActor = await summon.getSourceActor();
    const hp = sourceActor.system.attributes.hp;
    const bonuses = sourceActor.system.bonuses;
    const prof = owner.system.attributes.prof;
    genericUtils.mergeObject(updates, {
        system: {
            attributes: {
                hp: {
                    value: hp.value + wizardLevels,
                    max: hp.max + wizardLevels,
                    formula: hp.formula ? hp.formula + ' + ' + wizardLevels : String(wizardLevels)
                }
            },
            bonuses: {
                mwak: {damage: bonuses.mwak.damage ? bonuses.mwak.damage + ' + ' + prof : String(prof)},
                rwak: {damage: bonuses.rwak.damage ? bonuses.rwak.damage + ' + ' + prof : String(prof)}
            }
        }
    });
}
export const undeadThralls = {
    name: 'Undead Thralls',
    version: '2.0.0',
    rules: '2014',
    summon: [
        {
            pass: 'actorPreCreate',
            macro: buff,
            priority: 50
        }
    ]
};
