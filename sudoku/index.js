const inSameSquare = (p1, p2) => Math.floor((p1 - 1) / 3) === Math.floor((p2 - 1) / 3);

const isLegalPosition = (template, position) => {
    switch (template.length % 3) {
        case 0:
            return true;
        case 1:
            return !inSameSquare(template[template.length - 1], position);
        case 2:
            return !inSameSquare(template[template.length - 1], position) &&
                !inSameSquare(template[template.length - 2], position);
    }
};

const createTemplates = (templates = [], curTemplate = "") => {
    if (curTemplate.length === 9) {
        templates.push(curTemplate);
        return templates;
    }
    const remains = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(item => !curTemplate.includes(item));
    for (let i = 0; i < remains.length; i++) {
        if (isLegalPosition(curTemplate, remains[i])) {
            createTemplates(templates, curTemplate + remains[i]);
        }
    }
    return templates;
};

const isClash = (t1, t2) => {
    for (let i = 0; i < t1.length; i++) {
        if (t1[i] === t2[i]) {
            return true;
        }
    }
    return false;
};

const hasPosition = (template, x, y) => template[y] - 1 === x;

const initNumTemplates = (templates) => {
    const numTemplates = [];
    for (let i = 0; i < 9; i++) {
        numTemplates[i] = templates;
    }
    return numTemplates;
};

const filterNumTemplates = (numTemplates, num, x, y) => {
    if (typeof num === "number" && num >= 1 && num <= 9) {
        numTemplates = numTemplates.map((item, index) => {
            if (num - 1 === index) {
                return item.filter(t => hasPosition(t, x, y));
            } else {
                return item.filter(t => !hasPosition(t, x, y));
            }
        });
    }
    return numTemplates;
};

const getNumTemplates = (templates, matrix) => {
    let numTemplates = initNumTemplates(templates);
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const num = matrix[i][j];
            numTemplates = filterNumTemplates(numTemplates, num, j, i);
        }
    }
    const singleTemplateIndex = [];
    const addIndex = () => {
        numTemplates.forEach((item, index) => {
            if (item.length === 1 && singleTemplateIndex.indexOf(index) < 0) {
                singleTemplateIndex.push(index);
            }
        });
    };
    addIndex();
    for (let i = 0; i < singleTemplateIndex.length; i++) {
        const template = numTemplates[singleTemplateIndex[i]][0];
        for (let j = 0; j < numTemplates.length; j++) {
            if (j !== singleTemplateIndex[i]) {
                numTemplates[j] = numTemplates[j].filter(item => !isClash(item, template));
            }
        }
        addIndex();
    }
    return numTemplates;
};

const getSolution = (numTemplates) => {
    for (let i = 0; i < numTemplates.length; i++) {
        if (numTemplates[i].length <= 0) {
            return [];
        }
    }
    if (numTemplates.length <= 1) {
        return [numTemplates[0][0]];
    }
    const [templates, ...rest] = numTemplates;
    for (let i = 0; i < templates.length; i++) {
        const filteredRest = rest.map(t => t.filter(item => !isClash(item, templates[i])));
        const solution = getSolution(filteredRest);
        if (solution.length > 0) {
            return [templates[i], ...solution];
        }
    }
    return [];
};

const solution = (matrix) => {
    const templates = createTemplates();
    const numTemplates = getNumTemplates(templates, matrix);
    return getSolution(numTemplates);
};

const result = solution([
    [0, 1, 3, 0, 0, 0, 7, 0, 0],
    [0, 9, 0, 0, 0, 0, 2, 0, 0],
    [0, 0, 0, 6, 5, 9, 0, 0, 0],

    [9, 0, 0, 0, 0, 0, 0, 5, 2],
    [0, 0, 0, 1, 9, 0, 0, 0, 0],
    [0, 8, 4, 0, 0, 0, 0, 6, 0],

    [0, 0, 0, 7, 0, 0, 1, 0, 0],
    [0, 2, 0, 0, 0, 0, 0, 0, 3],
    [5, 0, 9, 0, 0, 8, 0, 0, 0]
]);