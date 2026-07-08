import {documentUtils} from '../../../../proxy.mjs';
async function rest({document}) {
    const restsLeft = document.flags['chris-premades']?.greaterDivineInterventionRest?.value;
    if (!restsLeft || restsLeft === 1) {
        await documentUtils.deleteDocument(document);
    } else {
        await documentUtils.setFlag(document, 'chris-premades', 'greaterDivineInterventionRest.value', restsLeft - 1);
    }
}
export const greaterDivineIntervention = {
    name: 'Greater Divine Intervention',
    version: '2.0.0',
    rules: '2024',
    config: {
        restFormula: {
            default: '2d4',
            type: 'text',
            label: 'CHRISPREMADES.Macros.Modern.GreaterDivineIntervention.RestFormula',
            category: 'homebrew'
        }
    }
};
export const greaterDivineInterventionRest = {
    name: 'Divine Intervention: Blocked',
    version: '2.0.0',
    rules: '2024',
    rest: [
        {
            pass: 'actorLong',
            macro: rest,
            priority: 50
        }
    ]
};
