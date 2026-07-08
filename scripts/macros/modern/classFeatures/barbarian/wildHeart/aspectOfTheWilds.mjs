import {workflowUtils} from '../../../../../proxy.mjs';
async function long({document}) {
    await workflowUtils.completeItemUse(document);
}
export const aspectOfTheWilds = {
    name: 'Aspect of the Wilds',
    version: '2.0.0',
    rules: '2024',
    rest: [
        {
            pass: 'actorLong',
            macro: long,
            priority: 50
        }
    ]
};
