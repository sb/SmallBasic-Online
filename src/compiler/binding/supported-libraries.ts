type LibraryMethodDefinition = {
    argumentsCount: number;
    returnsValue: boolean;
};
type LibraryPropertyDefinition = {
    hasGet: boolean;
    hasSet: boolean;
};

type LibraryTypeDefinition = {
    methods: { [name: string]: LibraryMethodDefinition };
    properties: { [name: string]: LibraryPropertyDefinition };
};

type SupportedLibrariesDefinition = { [name: string]: LibraryTypeDefinition };

export const SupportedLibraries: SupportedLibrariesDefinition = {
    "TextWindow": {
        methods: {
            "WriteLine": { argumentsCount: 1, returnsValue: false },
            "Read": { argumentsCount: 0, returnsValue: true }
        },
        properties: {
            "ForegroundColor": { hasGet: true, hasSet: true },
            "BackgroundColor": { hasGet: true, hasSet: true }
        }
    },
    "Clock": {
        methods: {},
        properties: {
            "Time": { hasGet: true, hasSet: false }
        }
    },
    "Program": {
        methods: {
            "End": { argumentsCount: 0, returnsValue: false },
            "Pause": { argumentsCount: 0, returnsValue: false }
        },
        properties: {}
    }
};
